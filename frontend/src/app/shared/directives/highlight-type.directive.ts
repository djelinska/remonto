import { Directive, ElementRef, Input, OnInit, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appHighlightType]',
  standalone: true,
})
export class HighlightTypeDirective implements OnInit {
  @Input('appHighlightType') type!: string;

  private typeColors: Record<string, { color: string; label: string }> = {
    task: { color: '#7e76e7', label: 'Zadanie' },
    material: { color: '#9f55b3', label: 'Materiał' },
    tool: { color: '#a2397d', label: 'Narzędzie' },
  };

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnInit(): void {
    const typeInfo = this.typeColors[this.type] || {
      color: '#444655',
      label: 'Nieznany',
    };

    this.renderer.setStyle(
      this.el.nativeElement,
      'backgroundColor',
      typeInfo.color
    );

    this.el.nativeElement.innerText = typeInfo.label;
  }
}
