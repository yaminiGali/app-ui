import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, NgModule } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormField, MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, HttpClientModule, MatSnackBarModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss',
})


export class SignupComponent {
  users: any;
  user = { username: '', firstname:'', lastname:'', email: '', password: '', phone_number: '', address: '', role:'', securityQuestion:'', securityAnswer:'' };
  errorMessage: string = '';
  signupForm: FormGroup;
  baseUrl: string = 'http://127.0.0.1:5000/api';

  constructor(private http: HttpClient, private router: Router, private snackBar: MatSnackBar, private fb: FormBuilder) {
    this.signupForm = this.fb.group({
      username: ['', [Validators.required]],
      firstname:['', [Validators.required]],
      lastname:['', [Validators.required]],
      email: ['', [Validators.required, Validators.email, Validators.pattern(/^[a-zA-Z0-9._%+-]+@(gmail\.com|outlook\.com|yahoo\.com|example\.com)$/)]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)]],
      phone_number: ['', [Validators.required, Validators.pattern(/^\d*$/), Validators.minLength(10), Validators.maxLength(10)]],
      address: ['', Validators.required],
      role: ['', Validators.required],
      securityQuestion: ['', Validators.required],
      securityAnswer: ['', Validators.required]
    });
  }

  getBack() {
    this.router.navigate(['/home']);
  }

  onSubmit() {
    this.http.post(this.baseUrl + '/signup/community', this.signupForm.value).subscribe(
      (response: any) => {
        this.router.navigate(['/home']);
        this.showSuccessMessage(response.message);
      },
      error => {
        if (error.status === 409) {
          this.errorMessage = error.error.message
        } else {
          this.errorMessage = error.error.message
        }
      });
  }

  getUsers() {
    this.http.get(this.baseUrl + '/community').subscribe((resp) => {
      this.users = resp;
    },
      error => {
        this.errorMessage = 'Error while fetching community data. Please try again.';
      })
  }

  showSuccessMessage(message: string) {
    console.log("success message in show", message)
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'top'
    });
  }

}
