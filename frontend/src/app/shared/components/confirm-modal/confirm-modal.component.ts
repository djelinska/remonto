import { BsModalRef } from 'ngx-bootstrap/modal';
import { Component } from '@angular/core';

@Component({
  selector: 'app-confirm-modal',
  standalone: true,
  imports: [],
  templateUrl: './confirm-modal.component.html',
  styleUrl: './confirm-modal.component.scss',
})
export class ConfirmModalComponent {
  title: string = 'Potwierdź';
  message: string = 'Czy na pewno chcesz wykonać tę operację?';
  btnTitle: string = 'Potwierdź';

  constructor(public modalRef: BsModalRef) {}

  confirmCallback?: () => void;
  cancelCallback?: () => void;

  onConfirm(): void {
    if (this.confirmCallback) {
      this.confirmCallback();
    }
    this.modalRef.hide();
  }

  onCancel(): void {
    if (this.cancelCallback) {
      this.cancelCallback();
    }
    this.modalRef.hide();
  }
}
