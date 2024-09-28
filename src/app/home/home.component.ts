import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Task } from './home.component.interface';
import { MessageService } from 'primeng/api';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
import { ToastModule } from 'primeng/toast';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

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

  constructor(
    private messageService: MessageService,
  ) { }

  addTask(): void {
    if (this.taskName.trim() === '') {
      this.messageService.add({
        severity: 'error',
        detail: 'Por favor, insira um nome para a tarefa.',
        key: 'tst',
      });
      return
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
    } else {
      this.tasks.push(newTask);
    }

    this.taskName = '';
  }

  editTask(task: Task): void {
    this.isEditing = true;
    this.taskName = task.name;
    this.editingTaskId = task.id;
  }


}

