import { RouterModule, Routes } from '@angular/router';
import { RestoComponent } from './resto/resto.component';
import { UserComponent } from './user/user.component';
import { NgModule } from '@angular/core';
import { HomeComponent } from './home/home.component';
import { SignupComponent } from './signup/signup.component';
import { UserHomeComponent } from './user/user-home/user-home.component';
import { RestoHomeComponent } from './resto/resto-home/resto-home.component';
import { authGuard } from './auth.guard';
import { RestaurantFoodComponent } from './resto/restaurant-food/restaurant-food.component';
import { CustomerFoodComponent } from './user/customer-food/customer-food.component';
import { ContributorsComponent } from './contributors/contributors.component';
import { ContributorHomeComponent } from './contributors/contributor-home/contributor-home.component';

export const routes: Routes = [
    { path: 'resto', component: RestoComponent },
    { path: 'customer', component: UserComponent },
    { path: 'contributor', component: ContributorsComponent },
    { path: 'home', component: HomeComponent },
    { path: 'signup', component: SignupComponent },
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: 'customer/:id', component: UserHomeComponent }, // ,canActivate: [authGuard]
    { path: 'resto/:id', component: RestoHomeComponent },
    { path: 'contributor/:id', component: ContributorHomeComponent },
    { path: 'resto/:id/:name/details', component: RestaurantFoodComponent },
    { path: 'customer/:id/:name/details', component: CustomerFoodComponent }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)], 
    exports: [RouterModule]
  })

export class AppRoutesModule { }