import { Observable, of } from 'rxjs';

import { Injectable } from '@angular/core';
import { TemplateDto } from '../../../shared/models/template.dto';

@Injectable({
  providedIn: 'root',
})
export class TemplateService {
  private TEMPLATES: TemplateDto[] = [
    {
      id: '1',
      project: {
        name: 'Remont Małej Łazienki',
        description:
          'Remont łazienki w małym mieszkaniu, wymiana płytek, armatury i instalacji elektrycznej.',
        budget: 8000,
      },
      tasks: [
        {
          id: '1',
          name: 'Demontaż starych płytek',
          category: 'CLEANUP',
          priority: 'LOW',
          note: 'Demontaż wymaga ostrożności, aby nie uszkodzić ścian.',
        },
        {
          id: '2',
          name: 'Wymiana instalacji wodnej',
          category: 'CLEANUP',
          priority: 'HIGH',
          note: 'Konieczność wymiany rur w całej łazience.',
        },
        {
          id: '3',
          name: 'Montaż nowych płytek',
          category: 'CONSTRUCTION',
          priority: 'MEDIUM',
          note: 'Płytki ceramiczne w stylu nowoczesnym.',
        },
        {
          id: '4',
          name: 'Montaż armatury',
          category: 'INSTALLATIONS',
          priority: 'HIGH',
          note: 'Nowa armatura w stylu industrialnym.',
        },
      ],
      materials: [
        {
          id: '1',
          name: 'Płytki ceramiczne',
          status: 'ORDERED',
          quantity: 30,
          type: 'Ceramika',
          note: 'Płytki o wymiarach 30x60 cm.',
        },
        {
          id: '2',
          name: 'Fuga',
          status: 'ORDERED',
          quantity: 5,
          type: 'Fuga',
          note: 'Fuga do płytek ceramicznych.',
        },
        {
          id: '3',
          name: 'Rury PVC',
          status: 'ORDERED',
          quantity: 20,
          type: 'Instalacja wodna',
          note: 'Rury do wymiany instalacji wodnej.',
        },
      ],
      tools: [
        {
          id: '1',
          name: 'Wiertarka',
          status: 'ORDERED',
          quantity: 1,
          note: 'Wiertarka do montażu płytek.',
        },
        {
          id: '2',
          name: 'Piła do płytek',
          status: 'ORDERED',
          quantity: 1,
          note: 'Piła do precyzyjnego cięcia płytek.',
        },
      ],
      taskCount: 4,
      materialCount: 3,
      toolCount: 2,
    },
    {
      id: '2',
      project: {
        name: 'Remont Małej Kuchni',
        description:
          'Remont kuchni, wymiana sprzętów AGD, montaż nowych mebli oraz instalacji elektrycznej.',
        budget: 12000,
      },
      tasks: [
        {
          id: '1',
          name: 'Demontaż starych mebli',
          category: 'CLEANUP',
          priority: 'HIGH',
          note: 'Usunięcie starych mebli kuchennych.',
        },
        {
          id: '2',
          name: 'Instalacja nowego AGD',
          category: 'INSTALLATIONS',
          priority: 'HIGH',
          note: 'Montaż nowej lodówki, płyty indukcyjnej i piekarnika.',
        },
        {
          id: '3',
          name: 'Montaż nowych mebli',
          category: 'CONSTRUCTION',
          priority: 'MEDIUM',
          note: 'Meble w stylu nowoczesnym, z wyspą kuchenną.',
        },
        {
          id: '4',
          name: 'Montaż nowych płytek',
          category: 'CONSTRUCTION',
          priority: 'LOW',
          note: 'Płytki na ścianach oraz podłodze.',
        },
      ],
      materials: [
        {
          id: '1',
          name: 'Płytki ceramiczne',
          status: 'ORDERED',
          quantity: 50,
          type: 'Ceramika',
          note: 'Płytki do podłogi i ścian.',
        },
        {
          id: '2',
          name: 'Fuga',
          status: 'ORDERED',
          quantity: 6,
          type: 'Fuga',
          note: 'Fuga do płytek.',
        },
        {
          id: '3',
          name: 'Płyta indukcyjna',
          status: 'ORDERED',
          quantity: 1,
          type: 'Sprzęt AGD',
          note: 'Nowoczesna płyta indukcyjna.',
        },
      ],
      tools: [
        {
          id: '1',
          name: 'Młotek',
          status: 'ORDERED',
          quantity: 1,
          note: 'Młotek do montażu mebli.',
        },
        {
          id: '2',
          name: 'Wkrętarka',
          status: 'ORDERED',
          quantity: 1,
          note: 'Wkrętarka do montażu mebli i urządzeń AGD.',
        },
      ],
      taskCount: 4,
      materialCount: 3,
      toolCount: 2,
    },
  ];

  getAllTemplates(): Observable<TemplateDto[]> {
    return of(this.TEMPLATES);
  }

  getTemplateById(id: string): any {
    const template = this.TEMPLATES.find((t: any) => t.id === id);
    return of(template);
  }

  createTemplate(template: any): Observable<any> {
    template.id = this.generateId();
    template.taskCount = template.tasks.length;
    template.materialCount = template.materials.length;
    template.toolCount = template.tools.length;
    this.TEMPLATES.push(template);
    return of(template);
  }

  updateTemplate(id: string, updatedTemplate: any): Observable<any> {
    const index = this.TEMPLATES.findIndex((t) => t.id === id);
    if (index !== -1) {
      this.TEMPLATES[index] = { ...this.TEMPLATES[index], ...updatedTemplate };
      return of(this.TEMPLATES[index]);
    }
    return of(null);
  }

  deleteTemplate(id: string): Observable<boolean> {
    const index = this.TEMPLATES.findIndex((t) => t.id === id);
    if (index !== -1) {
      this.TEMPLATES.splice(index, 1);
      return of(true);
    }
    return of(false);
  }

  private generateId(): string {
    return Math.random().toString(36).substring(2, 9);
  }
}
