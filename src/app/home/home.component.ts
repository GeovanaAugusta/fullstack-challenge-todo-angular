import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Task } from './home.component.interface';
import { MessageService } from 'primeng/api';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
import { ToastModule } from 'primeng/toast';
import { TaskService } from '../services/tasks-service';
import { UserService } from '../services/users-service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HomeComponent, FormsModule, CommonModule, MessagesModule, MessageModule, ToastModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  providers: [MessageService],
})
export class HomeComponent {
  tasks: Task[] = [];
  taskName: string = '';
  searchTerm: string = '';
  isEditing: boolean = false;
  isAdding: boolean = false;
  editingTaskId: number | null = null;
  messages: any[] = [];
  taskDesc: string = '';
  isModalVisible: boolean = false;
  taskId: number = 0;
  taskInicio: string = '';
  taskFim: string = '';
  taskAnexos: [] = [];
  taskUsuarioId: number = 1;

  constructor(
    private messageService: MessageService,
    private taskService: TaskService,
    private userService: UserService) { }

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
    } else if (status === 'Em produção') {
      return this.tasks.filter(task => task.fim);
    }
    return [];
  }

  // APIs call

  getAllUsers(): void {
    this.userService.allUsers().subscribe({
      next: (response: any) => {
        this.tasks = response;
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
    if (!this.taskName.trim()) {
      this.messageService.add({
        severity: 'error',
        detail: 'Por favor, insira um nome para a tarefa.',
        key: 'tst',
      });
      return;
    }

    const newTask: Task = {
      id: this.taskId,
      nome: this.taskName.trim(),
      descricao: this.taskDesc,
      inicio: this.taskInicio,
      fim: this.taskFim,
      anexos: this.taskAnexos,
      usuarioId: this.taskUsuarioId,
    };

    if (this.isEditing) {
      this.updateTask(newTask);
    } else {
      this.addTask(newTask);
    }
    this.closeModal();
  }

  addTask(newTask: Task): void {
    this.openModal();
    if (this.taskName.trim() === '') {
      this.messageService.add({
        severity: 'error',
        detail: 'Por favor, insira uma descrição para a tarefa.',
        key: 'tst',
      });
      return;
    }

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
      console.log(this.tasks);

      this.messageService.add({
        severity: 'success',
        detail: 'Tarefa adicionada com sucesso!',
        key: 'tst',
      });

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
      next: (response: any) => {
        this.messageService.add({
          severity: 'success',
          detail: 'Tarefa editada com sucesso!',
          key: 'tst',
        });
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

  editTask(task: Task): void {
    this.isEditing = true;
    this.taskId = task.id ? task.id : 0;
    this.taskName = task.nome;
    this.taskDesc = task.descricao;
    this.taskInicio = task.inicio || '';
    this.taskFim = task.fim || '';
    this.taskAnexos = task.anexos || [];
    this.taskUsuarioId = task.usuarioId;
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
    this.isModalVisible = true;
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

}
