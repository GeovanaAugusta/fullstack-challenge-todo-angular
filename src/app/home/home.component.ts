import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Task, User } from './home.component.interface';
import { MessageService } from 'primeng/api';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
import { ToastModule } from 'primeng/toast';
import { TaskService } from '../services/tasks-service';
import { UserService } from '../services/users-service';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzUploadFile, NzUploadModule } from 'ng-zorro-antd/upload';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HomeComponent, FormsModule, CommonModule, MessagesModule, MessageModule, ToastModule, NzButtonModule, NzInputModule, NzDatePickerModule, NzUploadModule, NzIconModule, NzSelectModule, ReactiveFormsModule, NzRadioModule, NgxMaskDirective],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  providers: [MessageService, provideNgxMask()],
})
export class HomeComponent {
  tasks: Task[] = [];
  users: User[] = [];
  taskAnexos: [] = [];
  fileList: NzUploadFile[] = [];
  taskName: string = '';
  searchTerm: string = '';
  isEditing: boolean = false;
  isAdding: boolean = false;
  uploadSuccess: boolean = false;
  addNewUser: boolean = false;
  editingTaskId: number | null = null;
  isModalVisible: boolean = false;
  taskId: number = 0;
  taskUsuarioId: number = 1;
  taskBegin: string = '';
  taskEnd: string = '';
  taskDesc: string = '';
  taskForm: FormGroup;
  userForm: FormGroup;

  constructor(
    private messageService: MessageService,
    private taskService: TaskService,
    private userService: UserService,
    private fb: FormBuilder) {
    this.taskForm = this.fb.group({
      nome: ['', Validators.required],
      descricao: [''],
      inicio: [''],
      fim: [''],
      usuarioId: ['', Validators.required],
      anexos: this.fb.array([])
    });

    this.userForm = this.fb.group({
      nome: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telefone: [''],
      preference: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
      this.tasks = JSON.parse(storedTasks);
    }

    this.getAllTasks();
    this.getAllUsers();
  }

  // Filters
  filterTasksByStatus(status: string): Task[] {
    if (status === 'Aguardando desenvolvimento') {
      return this.tasks.filter(task => !task.inicio && !task.fim);
    } else if (status === 'Em andamento') {
      return this.tasks.filter(task => task.inicio && !task.fim);
    } else if (status === 'Finalizado') {
      return this.tasks.filter(task => task.fim);
    }
    return [];
  }

  // APIs call
  getAllUsers(): void {
    this.userService.allUsers().subscribe({
      next: (response: any) => {
        this.users = response;
      },
      error: (err: any) => {
        console.error(err);
        this.messageService.add({
          severity: 'error',
          detail: 'Um erro ocorreu ao carregar os usuários!',
          key: 'tst',
        });
      }
    });
    console.log(this.tasks);
  }

  getAllTasks(): void {
    this.taskService.allTasks().subscribe({
      next: (response: any) => {
        this.tasks = response;
      },
      error: (err: any) => {
        console.error(err);
        this.messageService.add({
          severity: 'error',
          detail: 'Um erro ocorreu ao carregar as tarefas!',
          key: 'tst',
        });
      }
    });
    console.log(this.tasks);
  }

  saveTask(): void {
    if (!this.taskForm.value.nome.trim()) {
      this.messageService.add({
        severity: 'error',
        detail: 'Por favor, insira um nome para a tarefa.',
        key: 'tst',
      });
      return;
    }

    const newTask: Task = {
      nome: this.taskForm.value.nome.trim(),
      descricao: this.taskForm.value.descricao,
      inicio: this.taskForm.value.inicio,
      fim: this.taskForm.value.fim,
      anexos: this.fileList.map(file => file.url).filter(url => url !== undefined) as string[],
      usuarioId: this.taskForm.value.usuarioId,
    };

    const updateTask: Task = {
      id: this.taskId,
      nome: this.taskForm.value.nome.trim(),
      descricao: this.taskForm.value.descricao,
      inicio: this.taskForm.value.inicio,
      fim: this.taskForm.value.fim,
      anexos: this.fileList.map(file => file.url).filter(url => url !== undefined) as string[],
      usuarioId: this.taskForm.value.usuarioId,
    };

    if (this.isEditing) {
      this.updateTask(updateTask);
    } else {
      this.addTask(newTask);
    }
    this.closeModal();
  }

  saveUsers(): void {
    const newUser: User = {
      nome: this.userForm.value.nome.trim(),
      email: this.userForm.value.email.trim(),
      telefone: this.userForm.value.telefone.trim().replace(/\D/g, '') !== '' ? `55${this.userForm.value.telefone.trim().replace(/\D/g, '')}` : null,
      notificationPreference: this.userForm.value.preference.trim(),
    };

    this.userService.addUser(newUser).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          detail: 'Usuário adicionado com sucesso!',
          key: 'tst',
        });
        this.getAllUsers();
        this.userForm.reset();
      },
      error: (err: any) => {
        console.error(err);
        this.messageService.add({
          severity: 'error',
          detail: 'Um erro ocorreu ao adicionar o usuário!',
          key: 'tst',
        });
      }
    });

  }

  addUser(): void {
    this.addNewUser = !this.addNewUser;
    this.userForm.reset();
    console.log(this.addNewUser);

  }

  addTask(newTask: Task): void {

    if (!this.taskForm.value.nome.trim()) {
      this.messageService.add({
        severity: 'error',
        detail: 'Por favor, insira uma descrição para a tarefa.',
        key: 'tst',
      });
      return;
    }

    this.openModal();

    console.log(this.isEditing, this.editingTaskId);


    if (this.isEditing && this.editingTaskId !== null) {
      if (this.editingTaskId !== null) {
        this.taskService.updateTask(newTask, this.editingTaskId).subscribe({
          next: (response: any) => {
            this.messageService.add({
              severity: 'success',
              detail: 'Tarefa editada com sucesso!',
              key: 'tst',
            });
            const taskIndex = this.tasks.findIndex(task => task.id === this.editingTaskId);
            this.tasks[taskIndex].nome = newTask.nome;
            this.isEditing = false;
            this.editingTaskId = null;
            this.tasks = response;
            this.getAllTasks();
          },
          error: (err: any) => {
            console.error(err);
            this.messageService.add({
              severity: 'error',
              detail: 'Um erro ocorreu ao editar a tarefa!',
              key: 'tst',
            });
          }
        });
      }

    } else {
      this.isAdding = true;
      this.tasks.push(newTask);

      this.taskService.addTask(newTask).subscribe({
        next: (response: any) => {
          this.messageService.add({
            severity: 'success',
            detail: 'Tarefa adicionada com sucesso!',
            key: 'tst',
          });
          this.tasks = response;
          this.getAllTasks();
        },
        error: (err: any) => {
          console.error(err);
          this.messageService.add({
            severity: 'error',
            detail: 'Um erro ocorreu ao adicionar a tarefa!',
            key: 'tst',
          });
        }
      });
    }

    this.taskName = '';
  }

  updateTask(updatedTask: Task): void {
    this.taskService.updateTask(updatedTask, this.taskId).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          detail: 'Tarefa editada com sucesso!',
          key: 'tst',
        });
        this.getAllTasks();
        this.isEditing = false;
        this.editingTaskId = null
      },
      error: (err: any) => {
        console.error(err);
        this.messageService.add({
          severity: 'error',
          detail: 'Um erro ocorreu ao editar a tarefa!',
          key: 'tst',
        });
      }
    });
  }

  editTask(task: Task): void {
    this.isEditing = true;
    this.taskId = task.id ? task.id : 0;

    this.taskForm.patchValue({
      id: task.id ? task.id : 0,
      nome: task.nome,
      descricao: task.descricao,
      inicio: task.inicio,
      fim: task.fim,
      anexo: this.fileList.map(file => file.url).filter(url => url !== undefined) as string[],
      usuarioId: task.usuarioId
    });

    if (task.anexos) {
      this.fileList = task.anexos.map(url => {
        const fileName = url.split('/').pop();
        if (!fileName) {
          throw new Error(`Nome do arquivo não encontrado para a URL: ${url}`);
        }

        return {
          uid: url,
          name: fileName,
          url: url,
          status: 'done'
        };
      });
    }

    console.log(this.taskForm);

    this.openModal();
  }

  deleteTask(taskId: number): void {

    if (taskId !== null) {
      this.taskService.deleteTask(taskId).subscribe({
        next: (response: any) => {
          this.tasks = response;
          this.messageService.add({
            severity: 'success',
            detail: 'Tarefa deletada com sucesso!',
            key: 'tst',
          });
          this.tasks = response;
          this.getAllTasks();
        },
        error: (err: any) => {
          console.error(err);
          this.messageService.add({
            severity: 'error',
            detail: 'Um erro ocorreu ao deletar a tarefa!',
            key: 'tst',
          });
        }
      });
    }
  }

  searchTasks(): Task[] {
    return this.tasks.filter(task =>
      task.nome.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  // Modal
  openModal(task?: Task): void {
    console.log(task);

    this.isModalVisible = true;
    if (!this.isEditing) {
      this.taskForm.reset();
      this.fileList = [];
    }
    if (task) {
      this.editTask(task);
    }
  }

  closeModal(): void {
    this.isModalVisible = false;
    this.taskName = '';
    this.taskDesc = '';
    this.isEditing = false;
    this.editingTaskId = null;
  }

  // Upload
  handleChange(info: { fileList: NzUploadFile[] }): void {
    let newFileList = [...info.fileList];

    if (newFileList.length > 1) {
      newFileList = [newFileList[newFileList.length - 1]];
    }

    this.fileList = newFileList.map(file => ({
      ...file,
      url: file.originFileObj ? URL.createObjectURL(file.originFileObj) : file.url
    }));
  }

  removeFile(file: NzUploadFile): void {
    this.fileList = this.fileList.filter(f => f.uid !== file.uid);
  }

  getNameById(id: number) {
    return this.users.find(user => user.id === id)?.nome;
  }

}
