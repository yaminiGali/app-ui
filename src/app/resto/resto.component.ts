import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SharedState } from '../shared-state';

@Component({
  selector: 'app-resto',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './resto.component.html',
  styleUrl: './resto.component.scss'
})
export class RestoComponent {

  loginForm: FormGroup;
  errorMessage: string = '';
  baseUrl: string = 'http://127.0.0.1:5000/api';

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  getBack() {
    this.router.navigate(['/home']);
  }
  restoLogin() {
    if (this.loginForm.valid) { 
      this.http.post(this.baseUrl +'/login', this.loginForm.value).subscribe(
        response => {
          SharedState.loggedIn = true;
          const user = (response as any).user;
          if (user.acc_type === 'restaurant') {
            this.router.navigate(['/resto',user.user_id], { state: { data:user } });
          } else if (user.acc_type === 'customer') {
            this.router.navigate(['/customer',user.user_id], { state: { data:user } });
          } else {
            console.error('Unknown account type');
          }
        },
        error => {
          this.errorMessage = error.error.error;
        }
      );
    }
  }
}
