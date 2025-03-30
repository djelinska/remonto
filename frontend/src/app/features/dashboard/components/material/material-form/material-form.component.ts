import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Observable, finalize, of } from 'rxjs';

import { BsModalRef } from 'ngx-bootstrap/modal';
import { ElementStatus } from '../../../../../shared/enums/element-status';
import { FormErrorComponent } from '../../../../../shared/components/form-error/form-error.component';
import { ImageService } from '../../../../../core/services/image/image.service';
import { MaterialDto } from '../../../../../shared/models/material.dto';
import { MaterialFormDto } from '../../../../../core/services/material/models/material-form.dto';
import { MaterialUnit } from '../../../../../shared/enums/material-unit';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-material-form',
  standalone: true,
  imports: [ReactiveFormsModule, FormErrorComponent],
  templateUrl: './material-form.component.html',
  styleUrl: './material-form.component.scss',
})
export class MaterialFormComponent {
  @Input() material: MaterialDto | null = null;
  @Output() formSubmit = new EventEmitter<MaterialFormDto>();

  form: FormGroup;
  statuses = Object.keys(ElementStatus);
  statusLabels: Record<string, string> = ElementStatus;
  units = Object.keys(MaterialUnit);
  unitLabels: Record<string, string> = MaterialUnit;

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
      unit: [null],
      type: [''],
      location: [''],
      link: [''],
      note: [''],
      imageUrl: [''],
    });
  }

  ngOnInit(): void {
    if (this.material) {
      const formattedMaterial = { ...this.material };

      if (this.material.imageUrl) {
        this.imageService
          .getImage(this.material.imageUrl)
          .subscribe((imageUrl) => {
            this.imagePreview = imageUrl;
          });
      }

      if (formattedMaterial.deliveryDate) {
        formattedMaterial.deliveryDate = formatDate(
          formattedMaterial.deliveryDate,
          formattedMaterial.allDay ? 'yyyy-MM-dd' : 'yyyy-MM-ddTHH:mm',
          'pl'
        );
      }

      this.form.patchValue(formattedMaterial);
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
        const material: MaterialFormDto = {
          name: this.form.value.name,
          status: this.form.value.status,
          deliveryDate: this.form.value.deliveryDate,
          allDay: this.form.value.deliveryDate ? this.form.value.allDay : false,
          cost: this.form.value.cost || 0,
          quantity: this.form.value.quantity || 0,
          unit: this.form.value.unit,
          type: this.form.value.type,
          location: this.form.value.location,
          link: this.form.value.link,
          note: this.form.value.note,
          imageUrl: imageUrl || this.form.value.imageUrl,
        };
        this.formSubmit.emit(material);
      });
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

  get status() {
    return this.form.get('status')?.value;
  }
}
