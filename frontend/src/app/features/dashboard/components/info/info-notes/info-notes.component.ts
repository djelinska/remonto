import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  ProjectDto,
  ProjectNoteDto,
} from '../../../../../shared/models/project.dto';

import { DatePipe } from '@angular/common';
import { FormErrorComponent } from '../../../../../shared/components/form-error/form-error.component';
import { ProjectService } from '../../../../../core/services/project/project.service';

@Component({
  selector: 'app-info-notes',
  standalone: true,
  imports: [ReactiveFormsModule, FormErrorComponent, DatePipe],
  templateUrl: './info-notes.component.html',
  styleUrl: './info-notes.component.scss',
})
export class InfoNotesComponent implements OnInit {
  @Input() projectId!: string;
  project!: ProjectDto;
  projectNotes: ProjectNoteDto[] = [];

  form = this.fb.group({
    note: ['', Validators.required],
  });

  constructor(
    private fb: FormBuilder,
    private projectService: ProjectService
  ) {}

  ngOnInit(): void {
    this.loadProjectNotes();
  }

  onAddNote(): void {
    if (this.form.valid) {
      const note = this.form.value.note;
      if (note) {
        this.projectService.addNoteToProject(this.projectId, note).subscribe({
          next: () => {
            this.loadProjectNotes();
            this.form.reset();
          },
        });
      }
    }
  }

  deleteNote(noteId: string): void {
    this.projectService
      .deleteNoteFromProject(this.projectId, noteId)
      .subscribe({
        next: () => {
          this.loadProjectNotes();
        },
      });
  }

  private loadProjectNotes(): void {
    if (this.projectId) {
      this.projectService
        .getProjectById(this.projectId)
        .subscribe((project) => {
          if (project.notes) {
            this.projectNotes = [...project.notes];
          }
        });
    }
  }
}
