import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { CalendarOptions, EventApi } from '@fullcalendar/core';
import { Component, OnInit } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FullCalendarModule } from '@fullcalendar/angular';
import { TaskAddComponent } from '../../components/task/task-add/task-add.component';
import { TaskDto } from '../../../../shared/models/task.dto';
import { TaskEditComponent } from '../../components/task/task-edit/task-edit.component';
import { TaskService } from '../../../../core/services/task/task.service';
import dayGridPlugin from '@fullcalendar/daygrid';
import plLocale from '@fullcalendar/core/locales/pl';
import timeGridPlugin from '@fullcalendar/timegrid';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule, FullCalendarModule],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss',
})
export class CalendarComponent implements OnInit {
  projectId!: string;
  tasks: TaskDto[] = [];
  tasksWithDates: TaskDto[] = [];

  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    plugins: [timeGridPlugin, dayGridPlugin],
    locale: plLocale,
    headerToolbar: {
      right: 'prev,today,next addTask',
      left: 'title',
      center: 'dayGridMonth,timeGridWeek,timeGridDay',
    },
    buttonText: {
      today: 'Dzisiaj',
    },
    customButtons: {
      addTask: {
        text: '+ Dodaj zadanie',
        click: () => {
          this.openAddTaskModal();
        },
      },
    },
    views: {
      dayGridMonth: {
        dayHeaderFormat: { weekday: 'long' },
      },
      timeGridWeek: {
        dayHeaderFormat: { weekday: 'long', day: 'numeric' },
      },
      timeGridDay: {
        dayHeaderFormat: { weekday: 'long' },
      },
    },
    nowIndicator: true,
    height: 'auto',
    eventClick: (info) => this.openEditTaskModal(info.event),
  };

  constructor(
    private route: ActivatedRoute,
    private taskService: TaskService,
    private modalService: BsModalService
  ) {}

  ngOnInit(): void {
    this.route.parent?.paramMap.subscribe((params) => {
      const projectId = params.get('id');
      if (projectId) {
        this.projectId = projectId;
        this.loadTasks();
      }
    });
  }

  private loadTasks(): void {
    this.taskService.getTasksByProject(this.projectId).subscribe((tasks) => {
      this.tasks = tasks;
      this.tasksWithDates = tasks.filter(
        (task) => task.startTime || task.endTime
      );

      this.calendarOptions.events = this.tasksWithDates.map((task) => ({
        id: task.id,
        title: task.name,
        start: task.startTime,
        end: task.endTime,
        allDay: task.allDay,
      }));
    });
  }

  private openAddTaskModal(): void {
    const initialState = { projectId: this.projectId };
    const modalRef: BsModalRef = this.modalService.show(TaskAddComponent, {
      class: 'modal-md',
      backdrop: 'static',
      keyboard: false,
      initialState,
    });

    modalRef.content.taskAdded.subscribe(() => {
      this.loadTasks();
    });
  }

  private openEditTaskModal(event: EventApi): void {
    const task = this.tasks.find((t) => t.id === event.id);

    if (!task) return;

    const initialState = {
      task,
      projectId: this.projectId,
    };
    const modalRef: BsModalRef = this.modalService.show(TaskEditComponent, {
      class: 'modal-md',
      backdrop: 'static',
      keyboard: false,
      initialState,
    });

    modalRef.content.taskUpdated.subscribe(() => {
      this.loadTasks();
    });
  }
}
