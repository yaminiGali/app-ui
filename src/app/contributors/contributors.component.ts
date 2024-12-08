import { Component } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SharedState } from '../shared-state';
import { MatDialog } from '@angular/material/dialog';
import { PswdResetComponent } from '../signup/pswd-reset/pswd-reset.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-contributors',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './contributors.component.html',
  styleUrl: './contributors.component.scss'
})
export class ContributorsComponent {

  loginForm: FormGroup;
  errorMessage: string = '';
  baseUrl: string = 'http://127.0.0.1:5000/api';
  contributorId: any;

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router, public dialog: MatDialog, private snackBar: MatSnackBar,) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  getBack() {
    this.router.navigate(['/home']);
  }
  contributorsLogin() {
    if (this.loginForm.valid) { 
      this.http.post(this.baseUrl +'/login', this.loginForm.value).subscribe(
        response => {
          SharedState.loggedIn = true;
          const user = (response as any).user;
          if (user.acc_type === 'restaurant') {
            this.router.navigate(['/resto',user.user_id], { state: { data:user } });
          } else if (user.acc_type === 'customer') {
            this.snackBar.open('Customer account! Navigating...', 'Close', { duration: 3000 });
            this.router.navigate(['/customer',user.user_id], { state: { data:user } });
          } else if (user.acc_type === 'contributor'){
            this.snackBar.open('Contributor account! Navigating...', 'Close', { duration: 3000 });
            this.router.navigate(['/contributor',user.user_id], { state: { data:user } });
          } else {
            console.error('Unknown account type');
            this.snackBar.open('Unknown account type', 'Close', { duration: 3000 });
          }
        },
        error => {
          this.errorMessage = error.error.error;
        }
      );
    }
  }

  forgotPswd(){
    const dialogRef = this.dialog.open(PswdResetComponent, {
      width: '90%', height: 'auto', maxWidth: '400px',
    });
    dialogRef.afterClosed().subscribe(result => {
    });
  }

}
