import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { BsModalRef } from 'ngx-bootstrap/modal';
import { FormErrorComponent } from '../../../../../shared/components/form-error/form-error.component';
import { UserDto } from '../../../../../shared/models/user.dto';
import { UserFormDto } from '../../../../../core/services/user/models/user-form.dto';
import { UserType } from '../../../../../shared/enums/user-type';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [ReactiveFormsModule, FormErrorComponent],
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.scss',
})
export class UserFormComponent {
  @Input() isEditMode: boolean = false;
  @Input() user: UserDto | null = null;
  @Output() formSubmit = new EventEmitter<UserFormDto>();

  form: FormGroup;

  types = Object.keys(UserType);
  typeLabels: Record<string, string> = UserType;

  constructor(public modalRef: BsModalRef, private fb: FormBuilder) {
    this.form = this.fb.group({
      firstName: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(50),
        ],
      ],
      lastName: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(50),
        ],
      ],
      password: [''],
      email: ['', [Validators.required, Validators.email]],
      type: [null, Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadUserData();

    if (!this.isEditMode) {
      this.form.get('password')?.setValidators([Validators.required]);
    }
  }

  private loadUserData(): void {
    if (!this.user) return;

    this.form.patchValue(this.user);
  }

  onSubmit(): void {
    if (this.form.valid) {
      const user: UserFormDto = {
        firstName: this.form.value.firstName,
        lastName: this.form.value.lastName,
        email: this.form.value.email,
        password: this.form.value.password,
        type: this.form.value.type,
      };
      this.formSubmit.emit(user);
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
}
