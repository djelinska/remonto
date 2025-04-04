import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { CalendarOptions, EventApi, EventInput } from '@fullcalendar/core';
import { CommonModule, DatePipe } from '@angular/common';
import {
  Component,
  ElementRef,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { FullCalendarModule } from '@fullcalendar/angular';
import { MaterialService } from '../../../../core/services/material/material.service';
import { ProjectService } from '../../../../core/services/project/project.service';
import { TaskAddComponent } from '../../components/task/task-add/task-add.component';
import { TaskDto } from '../../../../shared/models/task.dto';
import { TaskEditComponent } from '../../components/task/task-edit/task-edit.component';
import { TaskService } from '../../../../core/services/task/task.service';
import { ToolService } from '../../../../core/services/tool/tool.service';
import dayGridPlugin from '@fullcalendar/daygrid';
import { forkJoin } from 'rxjs';
import plLocale from '@fullcalendar/core/locales/pl';
import timeGridPlugin from '@fullcalendar/timegrid';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule, FullCalendarModule, DatePipe],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss',
})
export class CalendarComponent implements OnInit {
  @ViewChild('popoverElement') popoverElementRef!: ElementRef;

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
    eventMouseEnter: this.onEventHover.bind(this),
    eventMouseLeave: this.onEventLeave.bind(this),
  };

  title: string = '';
  startDate: string = '';
  endDate: string | null = null;
  allDay: boolean = false;
  visible: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private projectSerivce: ProjectService,
    private taskService: TaskService,
    private materialService: MaterialService,
    private toolService: ToolService,
    private modalService: BsModalService,
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {
    this.route.parent?.paramMap.subscribe((params) => {
      const projectId = params.get('id');
      if (projectId) {
        this.projectId = projectId;
        this.loadTasks();
        this.loadMaterialsAndTools();
        this.loadProjectDates();
      }
    });
  }

  private loadTasks(): void {
    this.taskService.getTasksByProject(this.projectId).subscribe((tasks) => {
      this.tasks = tasks;
      this.tasksWithDates = tasks.filter(
        (task) => task.startDate || task.endDate
      );

      const taskEvents = this.tasksWithDates.map((task) => ({
        id: task.id,
        title: task.name,
        start: task.startDate,
        end: task.endDate,
        allDay: task.allDay,
      }));

      this.updateCalendarEvents(taskEvents);
    });
  }

  private loadMaterialsAndTools(): void {
    forkJoin({
      materials: this.materialService.getMaterialsByProject(this.projectId),
      tools: this.toolService.getToolsByProject(this.projectId),
    }).subscribe(({ materials, tools }) => {
      const events = [...materials, ...tools]
        .filter((item) => item.deliveryDate)
        .map((item) => ({
          id: item.id,
          title: `${
            item.status === 'READY_FOR_PICKUP' ? 'Odbiór' : 'Dostawa'
          }: ${item.name}`,
          start: item.deliveryDate,
          allDay: item.allDay,
        }));

      this.updateCalendarEvents(events);
    });
  }

  private loadProjectDates(): void {
    this.projectSerivce.getProjectById(this.projectId).subscribe((project) => {
      const events: EventInput[] = [
        {
          id: `creation-${project.id}`,
          title: 'Data rozpoczęcia',
          start: project.startDate,
          allDay: true,
        },
        ...(project.endDate
          ? [
              {
                id: `planned-end-${project.id}`,
                title: 'Planowana data zakończenia',
                start: project.endDate,
                allDay: true,
              },
            ]
          : []),
      ];

      this.updateCalendarEvents(events);
    });
  }

  private updateCalendarEvents(newEvents: EventInput[]): void {
    const currentEvents = Array.isArray(this.calendarOptions.events)
      ? this.calendarOptions.events
      : [];
    this.calendarOptions = {
      ...this.calendarOptions,
      events: [...currentEvents, ...newEvents],
    };
  }

  private onEventHover(info: any): void {
    this.title = info.event.title;
    this.startDate = new Date(info.event.start).toISOString();
    this.endDate = info.event.end
      ? new Date(info.event.end).toISOString()
      : null;
    this.allDay = info.event.allDay;
    this.visible = true;

    const rect = info.el.getBoundingClientRect();
    const popoverWidth = 200;

    setTimeout(() => {
      if (this.popoverElementRef) {
        const popoverHeight = this.popoverElementRef.nativeElement.offsetHeight;
        const spaceBelow = window.innerHeight - rect.bottom;

        const calculatedTop =
          spaceBelow < popoverHeight + 8
            ? rect.top - popoverHeight - 8
            : rect.top + rect.height + 8;

        let calculatedLeft = rect.left + rect.width / 2 - popoverWidth / 2;

        if (calculatedLeft + popoverWidth > window.innerWidth) {
          calculatedLeft = rect.left + rect.width / 2 - popoverWidth;
        } else if (calculatedLeft < 0) {
          calculatedLeft = rect.left + rect.width / 2;
        }

        this.renderer.setStyle(
          this.popoverElementRef.nativeElement,
          'top',
          `${calculatedTop}px`
        );

        this.renderer.setStyle(
          this.popoverElementRef.nativeElement,
          'left',
          `${calculatedLeft}px`
        );

        this.renderer.setStyle(
          this.popoverElementRef.nativeElement,
          'opacity',
          '100'
        );
      }
    }, 0);
  }

  private onEventLeave(): void {
    this.visible = false;
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
