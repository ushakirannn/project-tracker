import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})
export class SidebarComponent {
  constructor(public authService: AuthService) {}

  navItems = [
    { label: 'Dashboard', icon: '\u229E', route: '/dashboard' },
    { label: 'Projects', icon: '\u25C8', route: '/projects' },
    { label: 'Tasks', icon: '\u2611', route: '/tasks' },
    { label: 'Sprints', icon: '\u23F1', route: '/sprints' },
    { label: 'Releases', icon: '\u2B06', route: '/releases' },
    { label: 'Discussions', icon: '\u2658', route: '/discussions' },
    { label: 'Activity', icon: '\u21BA', route: '/activity' },
  ];
}
