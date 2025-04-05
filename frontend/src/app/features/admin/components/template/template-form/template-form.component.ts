import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  MaterialFormDto,
  TaskFormDto,
  TemplateFormDto,
  ToolFormDto,
} from '../../../../../core/services/template/models/template-form.dto';

import { FormErrorComponent } from '../../../../../shared/components/form-error/form-error.component';
import { MaterialFormComponent } from '../../material/material-form/material-form.component';
import { TaskFormComponent } from '../../task/task-form/task-form.component';
import { TemplateDto } from '../../../../../shared/models/template.dto';
import { ToolFormComponent } from '../../tool/tool-form/tool-form.component';

@Component({
  selector: 'app-template-form',
  standalone: true,
  imports: [
    FormErrorComponent,
    TaskFormComponent,
    MaterialFormComponent,
    ToolFormComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './template-form.component.html',
  styleUrl: './template-form.component.scss',
})
export class TemplateFormComponent implements OnInit {
  @Input() template: TemplateDto | null = null;
  @Output() formSubmit = new EventEmitter<TemplateFormDto>();

  step = 1;
  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      project: this.fb.group({
        name: [
          '',
          [
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(50),
          ],
        ],
        description: [''],
        budget: [0, Validators.min(0)],
      }),
      tasks: this.fb.array([]),
      materials: this.fb.array([]),
      tools: this.fb.array([]),
    });
  }

  ngOnInit(): void {
    if (this.template) {
      this.form.patchValue({
        project: this.template.project,
      });

      this.setFormArray(
        'tasks',
        this.template.tasks,
        TaskFormComponent.createTaskForm
      );
      this.setFormArray(
        'materials',
        this.template.materials,
        MaterialFormComponent.createMaterialForm
      );
      this.setFormArray(
        'tools',
        this.template.tools,
        ToolFormComponent.createToolForm
      );
    }
  }

  private setFormArray(
    arrayName: string,
    items: any[],
    createFormFunction: () => FormGroup
  ): void {
    const formArray = this.form.get(arrayName) as FormArray;
    formArray.clear();

    items.forEach((item) => {
      const formGroup = createFormFunction();
      formGroup.patchValue(item);
      formArray.push(formGroup);
    });
  }

  nextStep() {
    if (this.isStepValid(this.step)) {
      this.step++;
    }
  }

  prevStep() {
    if (this.step > 1) this.step--;
  }

  isStepValid(step: number): boolean {
    this.form.markAllAsTouched();
    this.form.updateValueAndValidity();

    switch (step) {
      case 1:
        return this.form.get('project')!.valid;
      case 2:
        return this.tasks.valid;
      case 3:
        return this.materials.valid;
      case 4:
        return this.tools.valid;
      default:
        return false;
    }
  }

  // tasks

  get tasks(): FormArray {
    return this.form.get('tasks') as FormArray;
  }

  getTaskForm(index: number): FormGroup {
    return this.tasks.at(index) as FormGroup;
  }

  addTask() {
    this.tasks.push(TaskFormComponent.createTaskForm());
  }

  removeTask(index: number) {
    this.tasks.removeAt(index);
  }

  // materials

  get materials(): FormArray {
    return this.form.get('materials') as FormArray;
  }

  getMaterialForm(index: number): FormGroup {
    return this.materials.at(index) as FormGroup;
  }

  addMaterial() {
    this.materials.push(MaterialFormComponent.createMaterialForm());
  }

  removeMaterial(index: number) {
    this.materials.removeAt(index);
  }

  // tools

  get tools(): FormArray {
    return this.form.get('tools') as FormArray;
  }

  getToolForm(index: number): FormGroup {
    return this.tools.at(index) as FormGroup;
  }

  addTool() {
    this.tools.push(ToolFormComponent.createToolForm());
  }

  removeTool(index: number) {
    this.tools.removeAt(index);
  }

  onSubmit() {
    if (this.form.valid) {
      const template: TemplateFormDto = {
        project: {
          name: this.form.value.project.name,
          description: this.form.value.project.description,
          budget: this.form.value.project.budget || 0,
        },
        tasks: this.form.value.tasks.map((task: TaskFormDto) => ({ ...task })),
        materials: this.form.value.materials.map(
          (material: MaterialFormDto) => ({
            ...material,
            quantity: material.quantity || 0,
          })
        ),
        tools: this.form.value.tools.map((tool: ToolFormDto) => ({
          ...tool,
          quantity: tool.quantity || 1,
        })),
      };
      this.formSubmit.emit(template);
    }
  }
}
