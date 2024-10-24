import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedState } from '../../shared-state';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatFormField, MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-user-home',
  standalone: true,
  imports: [CommonModule, MatSelectModule,FormsModule,ReactiveFormsModule,MatInputModule,MatButtonModule,MatIconModule,MatSnackBarModule,
    MatDialogModule,MatRadioModule,MatMenuModule,MatCardModule,MatFormFieldModule,MatFormField,HttpClientModule],
  templateUrl: './user-home.component.html',
  styleUrl: './user-home.component.scss'
})

export class UserHomeComponent {
  baseUrl: string = 'http://127.0.0.1:5000/api';
  custoId: any;
  restaurants: any;
  contributors: any;
  customerInfo: any;
  searchTerm: string = '';
  name: string | undefined;
  customerName: any;
  profileOpen: boolean = false;

  constructor(private fb: FormBuilder,private route: ActivatedRoute, private http: HttpClient,private router: Router, public dialog: MatDialog,private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.custoId = this.route.snapshot.params['id'];
    console.log("Customer ID",this.custoId);
    this.getRestaurants();
    this.getContributors();
    this.customerDetails(this.custoId)
  }

  getFullImageUrl(logo: string): string {
    return logo ? `http://127.0.0.1:5000/uploads/${logo}` : '../../assets/default.jpg';
  }

  logout() {
    SharedState.loggedIn = false; 
    this.router.navigate(['/home']); 
  }

  profileMenu() {
    this.profileOpen = !this.profileOpen;
  }

  viewRestaurant(restaurant:any,restoName:string,restaurant_id:number) {
    this.router.navigate(['/customer', this.custoId, restoName,'details'],{ state: { data:restaurant_id, info:restaurant, detail:this.customerName, userId:this.custoId}});
  }

  viewContributor(contributor:any,contributorName:string,contributor_id:number) {
    this.router.navigate(['/customer', this.custoId, contributorName,'details'],{ state: { data:contributor_id, info:contributor, detail:this.customerName, userId:this.custoId}});

  }

  getRestaurants(){
    this.http.get(this.baseUrl+'/allRestaurantDetails').subscribe((res)=>{
      this.restaurants=res
      console.log("Restaurant List",res)
    })
  }

  getContributors(){
    this.http.get(this.baseUrl+'/allContributorDetails').subscribe((res)=>{
      this.contributors=res
      console.log("Contributor List",res)
    })
  }

  customerDetails(custoId:any){
    this.http.get(this.baseUrl+'/customer/'+custoId).subscribe((resp:any)=>{
      const foodDetails = [resp];
      this.customerInfo= foodDetails
      console.log("Customer Info",this.customerInfo)
      this.customerName=this.customerInfo[0]
      console.log("Customer details",this.customerName)
      this.name=this.customerName.username;
    })
  }

  filteredRestaurants() {
    if (!this.searchTerm) {
      return this.restaurants;
    }
    return this.restaurants.filter((names: { restaurant_name: string; }) =>
      names.restaurant_name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  filteredContributors() {
    if (!this.searchTerm) {
      return this.contributors;
    }
    return this.contributors.filter((names: { username: string; }) =>
      names.username.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  cartItems: any[] = [];

  increment(food: any): void {
    // if (food.selected_quantity < food.quantity_available) {
    //   food.selected_quantity++;
    // }
  }

  decrement(food: any): void {
    // if (food.selected_quantity > 0) {
    //   food.selected_quantity--;
    // }
  }

  addToCart(food: any): void {
    // if (food.selected_quantity > 0) {
    //   const existingItem = this.cartItems.find(item => item.food_name === food.food_name);
    //   if (!existingItem) {
    //     this.cartItems.push({ ...food });
    //   }
    // }
  }
  editFoodItem(food:any){

  }

  checkout(): void {
    // Logic for checkout
    console.log('Cart Items:', this.cartItems);
  }

}
