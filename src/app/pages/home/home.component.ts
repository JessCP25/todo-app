import { CommonModule } from '@angular/common';
import { Component, computed, effect, signal } from '@angular/core';
import { Task } from '../../models/task.model';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  tasks = signal<Task[]>([]);

  newTaskCtrl = new FormControl('', {
    nonNullable: true,
    validators: [
      Validators.required,
      Validators.pattern('^\\S.*$'),
      Validators.minLength(3),
    ],
  });

  filter = signal('all');

  taskByFilter = computed(()=>{
    const filter = this.filter();
    const tasks = this.tasks();
    if(filter === 'pending'){
      return tasks.filter(task => !task.completed)
    }
    if(filter === 'completed') {
      return tasks.filter(task => task.completed)
    }
    return tasks;
  })

  constructor(){
    effect(()=>{
      const tasks = this.tasks();
      localStorage.setItem('tasks', JSON.stringify(tasks));
    })
  }

  ngOnInit(): void {
    const storage = localStorage.getItem('tasks');
    if(storage) {
      const tasks = JSON.parse(storage);
      this.tasks.set(tasks);
    }
  }

  changeHandler() {
    if (this.newTaskCtrl.invalid || !this.newTaskCtrl.value.trim().length)
      return;

    const newTask = this.newTaskCtrl.value.trim();
    this.addTask(newTask);
    this.newTaskCtrl.reset();
  }

  addTask(title: string) {
    const newTask: Task = {
      id: Date.now(),
      title,
      completed: false,
    };
    this.tasks.update((tasks) => [...tasks, newTask]);
  }

  updateTask(idTask: number) {
    this.tasks.update((tasks) => {
      return tasks.map((task, position) => {
        if (position === idTask) {
          return {
            ...task,
            completed: !task.completed,
          };
        }
        return task;
      });
    });
  }

  deleteTask(index: number) {
    this.tasks.update((tasks) =>
      tasks.filter((task, position) => position !== index)
    );
  }

  updateTaskEditingMode(idTask: number) {
    this.tasks.update((tasks) => {
      return tasks.map((task, position) => {
        if (position === idTask) {
          return {
            ...task,
            editing: true
          };
        }
        return {
          ...task,
          editing: false
        };
      });
    });
  }

  updateTaskText(idTask: number, event: Event) {
    const input = event.target as HTMLInputElement;
    this.tasks.update((tasks) => {
      return tasks.map((task, position) => {
        if (position === idTask) {
          return {
            ...task,
            title: input.value,
            editing: false
          };
        }
        return task;
      });
    });
  }

  changeFilter(filter: string){
    this.filter.set(filter);
  }
}
