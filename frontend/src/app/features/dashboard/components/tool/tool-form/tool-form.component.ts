import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Observable, of } from 'rxjs';

import { BsModalRef } from 'ngx-bootstrap/modal';
import { ElementStatus } from '../../../../../shared/enums/element-status';
import { FormErrorComponent } from '../../../../../shared/components/form-error/form-error.component';
import { ImageService } from '../../../../../core/services/image/image.service';
import { ToolDto } from '../../../../../shared/models/tool.dto';
import { ToolFormDto } from '../../../../../core/services/tool/models/tool-form.dto';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-tool-form',
  standalone: true,
  imports: [FormErrorComponent, ReactiveFormsModule],
  templateUrl: './tool-form.component.html',
  styleUrl: './tool-form.component.scss',
})
export class ToolFormComponent {
  @Input() tool: ToolDto | null = null;
  @Output() formSubmit = new EventEmitter<ToolFormDto>();

  form: FormGroup;
  statuses = Object.keys(ElementStatus);
  statusLabels: Record<string, string> = ElementStatus;

  imagePreview: string | null = null;
  selectedFile: File | null = null;

  constructor(
    public modalRef: BsModalRef,
    private fb: FormBuilder,
    private imageService: ImageService
  ) {
    this.form = this.fb.group({
      name: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(50),
        ],
      ],
      status: [null, Validators.required],
      deliveryDate: [null],
      allDay: [false],
      cost: [0, Validators.min(0)],
      quantity: [0, Validators.min(0)],
      type: [''],
      location: [''],
      link: [''],
      note: [''],
      imageUrl: [''],
    });
  }

  ngOnInit(): void {
    if (this.tool) {
      const formattedTool = { ...this.tool };

      if (this.tool.imageUrl) {
        this.imageService.getImage(this.tool.imageUrl).subscribe((imageUrl) => {
          this.imagePreview = imageUrl;
        });
      }
      if (formattedTool.deliveryDate) {
        formattedTool.deliveryDate = formatDate(
          formattedTool.deliveryDate,
          formattedTool.allDay ? 'yyyy-MM-dd' : 'yyyy-MM-ddTHH:mm',
          'pl'
        );
      }

      this.form.patchValue(formattedTool);
    }

    this.form.get('status')?.valueChanges.subscribe((value) => {
      if (value !== 'IN_DELIVERY' && value !== 'READY_FOR_PICKUP') {
        this.form.patchValue({ deliveryDate: null, allDay: false });
      }
    });

    this.form.get('allDay')?.valueChanges.subscribe((value) => {
      const deliveryDateControl = this.form.get('deliveryDate');

      if (value) {
        deliveryDateControl?.setValidators(Validators.required);
      } else {
        deliveryDateControl?.removeValidators(Validators.required);
      }

      deliveryDateControl?.setValue(null);
      deliveryDateControl?.updateValueAndValidity();
    });
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  uploadImage(): Observable<string | null> {
    if (!this.selectedFile) {
      return of(null);
    }

    return this.imageService.uploadImage(this.selectedFile);
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.uploadImage().subscribe((imageUrl) => {
        const material: ToolFormDto = {
          name: this.form.value.name,
          status: this.form.value.status,
          deliveryDate: this.form.value.deliveryDate,
          allDay: this.form.value.deliveryDate ? this.form.value.allDay : false,
          cost: this.form.value.cost || 0,
          quantity: this.form.value.quantity || 0,
          location: this.form.value.location,
          link: this.form.value.link,
          note: this.form.value.note,
          imageUrl: imageUrl || this.form.value.imageUrl,
        };
        this.formSubmit.emit(material);
      });
    }
  }

  hideModal(): void {
    if (this.modalRef) {
      this.modalRef.hide();
    }
  }

  onCancel(): void {
    this.hideModal();
  }

  get status() {
    return this.form.get('status')?.value;
  }
}
