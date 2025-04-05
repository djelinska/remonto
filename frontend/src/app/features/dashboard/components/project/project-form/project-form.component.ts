import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  MaterialDto,
  TaskDto,
  TemplateDto,
  ToolDto,
} from '../../../../../shared/models/template.dto';

import { BsModalRef } from 'ngx-bootstrap/modal';
import { ElementStatus } from '../../../../../shared/enums/element-status';
import { FormErrorComponent } from '../../../../../shared/components/form-error/form-error.component';
import { ProjectDto } from '../../../../../shared/models/project.dto';
import { ProjectFormDto } from '../../../../../core/services/project/models/project-form.dto';
import { TaskStatus } from '../../../../../shared/enums/task-status';
import { TemplateService } from '../../../../../core/services/template/template.service';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-project-form',
  standalone: true,
  imports: [ReactiveFormsModule, FormErrorComponent],
  templateUrl: './project-form.component.html',
  styleUrl: './project-form.component.scss',
})
export class ProjectFormComponent {
  @Input() isEditMode: boolean = false;
  @Input() project: ProjectDto | null = null;
  @Output() formSubmit = new EventEmitter<ProjectFormDto>();

  form: FormGroup;
  templates: TemplateDto[] = [];

  constructor(
    public modalRef: BsModalRef,
    private fb: FormBuilder,
    private templateService: TemplateService
  ) {
    this.form = this.fb.group({
      template: [null],
      name: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(50),
        ],
      ],
      description: [''],
      startDate: ['', Validators.required],
      endDate: [''],
      budget: [0, Validators.min(0)],
      tasks: this.fb.array([]),
      materials: this.fb.array([]),
      tools: this.fb.array([]),
    });
  }

  ngOnInit(): void {
    this.loadTemplates();

    if (this.project) {
      const formattedProject = { ...this.project };

      if (formattedProject.startDate) {
        formattedProject.startDate = formatDate(
          formattedProject.startDate,
          'yyyy-MM-dd',
          'pl'
        );
      }

      if (formattedProject.endDate) {
        formattedProject.endDate = formatDate(
          formattedProject.endDate,
          'yyyy-MM-dd',
          'pl'
        );
      }

      this.form.patchValue(formattedProject);
    }
  }

  onTemplateSelect(event: any) {
    const selectedTemplateId = event.target.value;
    const selectedTemplate = this.templates.find(
      (template) => template.id === selectedTemplateId
    );

    if (selectedTemplate) {
      this.form.patchValue({
        name: selectedTemplate.project.name,
        description: selectedTemplate.project.description,
        budget: selectedTemplate.project.budget,
      });

      const tasks = selectedTemplate.tasks.map((task) => ({
        ...task,
        status: Object.keys(TaskStatus).find(
          (key) =>
            TaskStatus[key as keyof typeof TaskStatus] ===
            TaskStatus.NOT_STARTED
        ),
      }));

      const taskFormArray = this.form.get('tasks') as FormArray;
      tasks.forEach((task) => {
        taskFormArray.push(this.createTaskForm(task));
      });

      const materials = selectedTemplate.materials.map((material) => ({
        ...material,
        status: Object.keys(ElementStatus).find(
          (key) =>
            ElementStatus[key as keyof typeof ElementStatus] ===
            ElementStatus.REQUIRED
        ),
      }));

      const materialFormArray = this.form.get('materials') as FormArray;
      materials.forEach((material) => {
        materialFormArray.push(this.createMaterialForm(material));
      });

      const tools = selectedTemplate.tools.map((tool) => ({
        ...tool,
        status: Object.keys(ElementStatus).find(
          (key) =>
            ElementStatus[key as keyof typeof ElementStatus] ===
            ElementStatus.REQUIRED
        ),
      }));

      const toolFormArray = this.form.get('tools') as FormArray;
      tools.forEach((tool) => {
        toolFormArray.push(this.createToolForm(tool));
      });
    }
  }

  private createTaskForm(task: TaskDto): FormGroup {
    return this.fb.group({
      name: [task.name, [Validators.required]],
      category: [task.category, [Validators.required]],
      status: [task.status, [Validators.required]],
      priority: [task.priority, [Validators.required]],
      note: [task.note],
    });
  }

  private createMaterialForm(material: MaterialDto): FormGroup {
    return this.fb.group({
      name: [material.name, [Validators.required]],
      status: [material.status, [Validators.required]],
      quantity: [material.quantity, [Validators.required]],
      unit: [material.unit],
      type: [material.type],
      note: [material.note],
    });
  }

  private createToolForm(tool: ToolDto): FormGroup {
    return this.fb.group({
      name: [tool.name, [Validators.required]],
      status: [tool.status, [Validators.required]],
      quantity: [tool.quantity, [Validators.required]],
      note: [tool.note],
    });
  }

  onSubmit(): void {
    if (this.form.valid) {
      const project: ProjectFormDto = {
        name: this.form.value.name,
        description: this.form.value.description,
        startDate: this.form.value.startDate,
        endDate: this.form.value.endDate,
        budget: this.form.value.budget || 0,
        template: this.form.value.template,
        tasks: this.form.value.tasks,
        materials: this.form.value.materials,
        tools: this.form.value.tools,
      };

      this.formSubmit.emit(project);
    }
    this.form.markAllAsTouched();
  }

  hideModal(): void {
    if (this.modalRef) {
      this.modalRef.hide();
    }
  }

  onCancel(): void {
    this.hideModal();
  }

  private loadTemplates(): void {
    this.templateService.getAllTemplates().subscribe((templates) => {
      this.templates = templates;
    });
  }
}
