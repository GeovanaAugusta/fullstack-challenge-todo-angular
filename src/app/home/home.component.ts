import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Task } from './home.component.interface';
import { MessageService } from 'primeng/api';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
import { ToastModule } from 'primeng/toast';

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
  editingTaskId: number | null = null;
  messages: any[] = [];

  constructor(private messageService: MessageService) { }

  ngOnInit(): void {

    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
      this.tasks = JSON.parse(storedTasks);
    }
  }

  saveTasksToLocalStorage(): void {
    localStorage.setItem('tasks', JSON.stringify(this.tasks));
  }

  addTask(): void {
    if (this.taskName.trim() === '') {
      this.messageService.add({
        severity: 'error',
        detail: 'Por favor, insira uma descrição para a tarefa.',
        key: 'tst',
      });
      return;
    }

    const newTask: Task = {
      id: this.tasks.length + 1,
      name: this.taskName.trim()
    };

    if (this.isEditing && this.editingTaskId !== null) {
      const taskIndex = this.tasks.findIndex(task => task.id === this.editingTaskId);
      this.tasks[taskIndex].name = newTask.name;
      this.isEditing = false;
      this.editingTaskId = null;

      this.messageService.add({
        severity: 'success',
        detail: 'Tarefa editada com sucesso!',
        key: 'tst',
      });
    } else {
      this.tasks.push(newTask);
      this.messageService.add({
        severity: 'success',
        detail: 'Tarefa adicionada com sucesso!',
        key: 'tst',
      });
    }

    this.saveTasksToLocalStorage();
    this.taskName = '';
  }

  editTask(task: Task): void {
    this.isEditing = true;
    this.taskName = task.name;
    this.editingTaskId = task.id;
  }

  deleteTask(taskId: number): void {
    this.tasks = this.tasks.filter(task => task.id !== taskId);
    this.messageService.add({
      severity: 'success',
      detail: 'Tarefa deletada com sucesso!',
      key: 'tst',
    });

    this.saveTasksToLocalStorage();
  }

  searchTasks(): Task[] {
    return this.tasks.filter(task =>
      task.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }
}
