import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

  constructor(private router: Router) {}

  restoLogin() {
    this.router.navigate(['/resto']);
  }

  contributorLogin() {
    this.router.navigate(['/contributor']);
  }

  userLogin() {
    this.router.navigate(['/customer']);
  }

  signUp() {
    this.router.navigate(['/signup']);
  }
}
