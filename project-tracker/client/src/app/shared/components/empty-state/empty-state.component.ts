import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  template: `
    <div class="empty-state">
      <p class="empty-title">{{ title }}</p>
      <p class="empty-message">{{ message }}</p>
    </div>
  `,
  styles: [`
    .empty-state {
      text-align: center;
      padding: var(--space-2xl);
      color: var(--color-text-light);
    }
    .empty-title {
      font-size: var(--font-size-lg);
      font-weight: var(--font-weight-medium);
      margin-bottom: var(--space-sm);
      color: var(--color-text-secondary);
    }
    .empty-message {
      font-size: var(--font-size-sm);
    }
  `],
})
export class EmptyStateComponent {
  @Input() title = 'Nothing here yet';
  @Input() message = '';
}
