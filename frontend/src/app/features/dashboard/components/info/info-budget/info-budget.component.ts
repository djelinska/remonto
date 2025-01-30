import { ChartData, ChartOptions, ChartType } from 'chart.js';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { Component, Input, SimpleChanges } from '@angular/core';

import { NgChartsModule } from 'ng2-charts';
import { ProjectBudgetDto } from '../../../../../core/services/project/models/project-budget.dto';

@Component({
  selector: 'app-info-budget',
  standalone: true,
  imports: [CurrencyPipe, NgChartsModule, CommonModule],
  templateUrl: './info-budget.component.html',
  styleUrl: './info-budget.component.scss',
})
export class InfoBudgetComponent {
  @Input() projectBudget!: ProjectBudgetDto;

  pieChartOptions: ChartOptions = {
    responsive: true,
  };
  pieChartLabels: string[] = ['Robocizna', 'Materiały', 'Narzędzia'];
  pieChartData: ChartData<'pie'> = {
    labels: this.pieChartLabels,
    datasets: [{ data: [0, 0, 0] }],
  };
  pieChartType: ChartType = 'pie';

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['projectBudget']?.currentValue) {
      this.updateChartData();
    }
  }

  private updateChartData(): void {
    if (this.projectBudget) {
      this.pieChartData = {
        labels: this.pieChartLabels,
        datasets: [
          {
            data: [
              this.projectBudget.laborCost,
              this.projectBudget.materialsCost,
              this.projectBudget.toolsCost,
            ],
            backgroundColor: ['#7e76e7', '#9f55b3', '#a2397d'],
            hoverBackgroundColor: ['#9993ec', '#af72c0', '#bd4292'],
          },
        ],
      };
    }
  }
}
