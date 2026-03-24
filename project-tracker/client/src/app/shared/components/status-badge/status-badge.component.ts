import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-status-badge',
  standalone: true,
  template: `<span class="badge" [class]="'badge-' + status">{{ label || status }}</span>`,
  styles: [`
    .badge {
      display: inline-block;
      padding: 2px 10px;
      border-radius: var(--radius-full);
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-medium);
      text-transform: capitalize;
    }
    .badge-active, .badge-completed, .badge-testing { background-color: var(--color-success-light); color: var(--color-success); }
    .badge-in-progress, .badge-on-hold, .badge-planning { background-color: var(--color-info-light); color: var(--color-info); }
    .badge-planned { background-color: var(--color-bg-hover); color: var(--color-text-secondary); }
    .badge-blocked { background-color: var(--color-danger-light); color: var(--color-danger); }
    .badge-archived { background-color: var(--color-bg-hover); color: var(--color-text-light); }
    .badge-critical, .badge-high { background-color: var(--color-danger-light); color: var(--color-danger); }
    .badge-medium { background-color: var(--color-warning-light); color: var(--color-warning); }
    .badge-low { background-color: var(--color-success-light); color: var(--color-success); }
  `],
})
export class StatusBadgeComponent {
  @Input() status = '';
  @Input() label = '';
}
