import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule, MatFormField } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pswd-reset',
  standalone: true,
  imports: [CommonModule, MatSelectModule,FormsModule,ReactiveFormsModule,MatInputModule,MatButtonModule,MatIconModule,MatSnackBarModule,
    MatDialogModule,MatRadioModule,MatMenuModule,MatCardModule,MatFormFieldModule,MatFormField,HttpClientModule],
  templateUrl: './pswd-reset.component.html',
  styleUrl: './pswd-reset.component.scss'
})
export class PswdResetComponent {
  baseUrl: string = 'http://127.0.0.1:5000/api';
  email = '';
  userAnswer = '';
  securityQuestion : any;
  correctAnswer = 'blue';
  isVerified = false;
  isAnswerMatched = false;
  errorMessage: string = '';
  resetPasswordForm: FormGroup;
  emailForm: FormGroup;

  constructor(private fb: FormBuilder, private router: Router, private http: HttpClient, private snackBar: MatSnackBar,public dialogRef: MatDialogRef<PswdResetComponent>) {
    this.resetPasswordForm = this.fb.group({
      password: ['',[Validators.required, Validators.minLength(8), Validators.pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)]]
    });
    this.emailForm = this.fb.group({
      email: ['', [Validators.required, Validators.email, Validators.pattern(/^[a-zA-Z0-9._%+-]+@(gmail\.com|outlook\.com|yahoo\.com|example\.com)$/)]]
    })
  }

  back(){
    this.isAnswerMatched = false;
  }

  getQuestion(email:string){
    this.http.get(this.baseUrl+'/getSecurityQuestion/'+email).subscribe((resp:any)=>{
      this.securityQuestion = resp.securityQuestion;
      this.isVerified = true;
      this.errorMessage = '';
    },
    error => {
      this.errorMessage = error.statusText;
    });
  }

  submitSecurityAnswer(email: string, answer: string) {
    return this.http.post<{match?: boolean, error?: string}>(this.baseUrl+'/checkSecurityAnswer', {
      email: email,
      answer: answer
    });
  }

  checkAnswer(email:string,answer:string) {
    this.submitSecurityAnswer(email, answer).subscribe(
      response => {
        if (response.match) {
          this.isAnswerMatched = true;
          this.errorMessage = '';
        } else {
          this.errorMessage = response.error || '';
        }
      },
      error => {
        console.error('HTTP Error:', error);
    });
  }

  resetPassword(email:string) {
    if (this.resetPasswordForm.valid) {
      const newPassword = this.resetPasswordForm.value.password;
      this.updatePassword(email, newPassword).subscribe(response => {
        if (response.message) {
          this.snackBar.open(response.message, 'Close', { duration: 3000, horizontalPosition: 'center', verticalPosition: 'top' });
          this.dialogRef.close();
        } else {
          this.errorMessage = response.error || '';
          console.error('Error:', response.error);
        }
      },
      error => {
        this.errorMessage = error.error.error
        console.error('HTTP Error:', error.error);
      });
    }
  }

  updatePassword(email: string, password: string) {
    return this.http.post<{message?: string, error?: string}>(this.baseUrl+'/updatePassword', {
      email: email,
      password: password
    });
  }

}
