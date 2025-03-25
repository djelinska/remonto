import { Directive, ElementRef, Input, OnInit, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appPriorityBadge]',
  standalone: true,
})
export class PriorityBadgeDirective implements OnInit {
  @Input('appPriorityBadge') priority!: string;

  private priorityStyles: Record<string, { color: string; label: string }> = {
    low: { color: '#23c197', label: 'Niski' },
    medium: { color: '#a9aabc', label: 'Średni' },
    high: { color: '#f7516b', label: 'Wysoki' },
  };

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnInit(): void {
    const priorityInfo = this.priorityStyles[this.priority.toLowerCase()] || {
      color: '#444655',
      label: 'Nieznany',
    };

    this.renderer.setStyle(this.el.nativeElement, 'color', priorityInfo.color);
    this.renderer.setStyle(this.el.nativeElement, 'display', 'flex');
    this.renderer.setStyle(this.el.nativeElement, 'alignItems', 'center');
    this.renderer.setStyle(this.el.nativeElement, 'gap', '5px');
    this.renderer.setStyle(this.el.nativeElement, 'padding', '4px 8px');
    this.renderer.setStyle(
      this.el.nativeElement,
      'border',
      `1px solid ${priorityInfo.color}`
    );
    this.renderer.setStyle(this.el.nativeElement, 'borderRadius', '3px');

    const icon = this.renderer.createElement('i');
    this.renderer.addClass(icon, 'bi');
    this.renderer.addClass(icon, 'bi-flag');

    const text = this.renderer.createText(` ${priorityInfo.label}`);

    this.renderer.appendChild(this.el.nativeElement, icon);
    this.renderer.appendChild(this.el.nativeElement, text);
  }
}
