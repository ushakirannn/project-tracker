import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { User } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private currentUser = signal<User | null>(null);
  private loading = signal(true);

  user = this.currentUser.asReadonly();
  isAuthenticated = computed(() => !!this.currentUser());
  isLoading = this.loading.asReadonly();

  constructor(private http: HttpClient, private router: Router) {}

  get token(): string | null {
    return localStorage.getItem('token');
  }

  init(): void {
    const token = this.token;
    if (token) {
      this.loadUser();
    } else {
      this.loading.set(false);
    }
  }

  handleCallback(token: string): void {
    localStorage.setItem('token', token);
    this.loadUser(true);
  }

  private loadUser(navigateAfter = false): void {
    this.loading.set(true);
    this.http.get<User>(`${environment.apiUrl}/auth/me`).subscribe({
      next: (user) => {
        this.currentUser.set(user);
        this.loading.set(false);
        if (navigateAfter) {
          this.router.navigate(['/dashboard']);
        }
      },
      error: () => {
        this.logout();
        this.loading.set(false);
      },
    });
  }

  login(): void {
    window.location.href = `${environment.apiUrl}/auth/google`;
  }

  logout(): void {
    localStorage.removeItem('token');
    this.currentUser.set(null);
    this.router.navigate(['/login']);
  }
}
