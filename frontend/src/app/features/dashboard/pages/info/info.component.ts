import { Component } from '@angular/core';
import { InfoGeneralComponent } from '../../components/info/info-general/info-general.component';

@Component({
  selector: 'app-info',
  standalone: true,
  imports: [InfoGeneralComponent],
  templateUrl: './info.component.html',
  styleUrl: './info.component.scss',
})
export class InfoComponent {}
