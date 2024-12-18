import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
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
import { AddRestaurantDialogComponent } from '../add-restaurant-dialog/add-restaurant-dialog.component';
// import { Socket, SocketIoModule, SocketIoConfig } from 'ngx-socket-io';

// const config: SocketIoConfig = { url: 'http://localhost:5000', options: {} };

@Component({
  selector: 'app-resto-home',
  standalone: true,
  imports: [CommonModule, MatSelectModule,FormsModule,ReactiveFormsModule,MatInputModule,MatButtonModule,MatIconModule,MatSnackBarModule,
    MatDialogModule,MatRadioModule,MatMenuModule,MatCardModule,MatFormFieldModule,MatFormField,HttpClientModule],
  templateUrl: './resto-home.component.html',
  styleUrl: './resto-home.component.scss',
})
export class RestoHomeComponent {
  data: any;
  userId:any;
  user:string | undefined;
  baseUrl: string = 'http://127.0.0.1:5000/api';
  showPopup = false;
  foodForm: FormGroup;
  profileOpen: boolean = false;
  owner_id: any;
  restaurants: any;
  names:any;
  searchTerm: string = '';
  editProfileForm: FormGroup;
  isPopupVisible = false;
  resto: any;

  constructor(private fb: FormBuilder,private route: ActivatedRoute, private http: HttpClient,private router: Router, public dialog: MatDialog,private snackBar: MatSnackBar, private editfb: FormBuilder) {
    this.foodForm = this.fb.group({
      foodName: [''],
      foodType: [''],
      expiryTime: ['4']
    });
    this.editProfileForm= this.editfb.group({
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone_number: ['', [Validators.required, Validators.pattern(/^[0-9]{10,15}$/)]],
      address: ['', Validators.required],
    });
  }

  ngOnInit(): void {
      this.user = this.route.snapshot.params['id'];
      this.userId=this.user
      console.log("user id: ",this.user);
      this.getOwnerDetails(this.user);
      this.data = history.state.data;
  }
  getFullImageUrl(logo: string): string {
    return logo ? `http://127.0.0.1:5000/uploads/${logo}` : '';
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(AddRestaurantDialogComponent, {
      width: '90%', 
      height: 'auto', 
      maxWidth: '600px',
      data:{ownerId: this.owner_id,}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);
      this.addRestaurant(result);
      this.getRestaurants(this.owner_id);
    });
  }

  profileMenu() {
    this.profileOpen = !this.profileOpen;
  }

  closePopup() {
    this.showPopup = false;
  }

  logout() {
    SharedState.loggedIn = false; 
    this.router.navigate(['/home']); 
  }

  addRestaurant(result:any){
    this.http.post(this.baseUrl+'/restaurants',result).subscribe((resp:any)=>{
      this.snackBar.open("Restaurant added successfully", "Close", { duration: 3000 });
      this.showPopup = false;
      console.log("after added resto",resp)
    })
    this.ngOnInit();
  }

  getRestaurants(owner_id:any){
    this.http.get(this.baseUrl+'/restaurantDetails/'+owner_id).subscribe((res)=>{
      this.restaurants=res
      console.log("Restaurant List",res)
    })
  }

  getOwnerDetails(userId:any){
    this.http.get(this.baseUrl+'/resto/'+userId).subscribe((resp:any)=>{
      this.resto=resp;
      this.owner_id=resp.resto_id;
      this.user=resp.user_id;
      console.log("Owner details",this.resto)
      this.getRestaurants(this.owner_id)
    });
  }

  viewRestaurant(restaurants:any,restoId:number,restoName:string,restaurant_id:number) {
    console.log("viewRestaurant",restoId)
    this.router.navigate(['/resto', restoId, restoName,'details'],{ state: { data:restaurant_id, name:this.data.username, resto_id:restoId, resto_name:restoName } });
  }

  // filteredRestaurants() {
  //   if (!this.searchTerm||this.restaurants.length === 0) {
  //     return this.restaurants;
  //   }
  //   return this.restaurants.filter((names: { restaurant_name: string; }) =>
  //     names.restaurant_name.toLowerCase().includes(this.searchTerm.toLowerCase()));
  // }

  filteredRestaurants() {
    if (!this.restaurants || this.restaurants.length === 0) {
      return [];
    }
    if (!this.searchTerm) {
      return this.restaurants;
    }
    return this.restaurants.filter((restaurant: { restaurant_name: string }) =>
      restaurant.restaurant_name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }
  
  openEditPopup(): void { 
    this.isPopupVisible = true;
    this.editfbForm(); 
  }
  
  editfbForm(){
    this.editProfileForm.patchValue({
      firstname: this.resto.firstname,
      lastname: this.resto.lastname,
      email: this.resto.email,
      phone_number: this.resto.phone_number,
      address: this.resto.address,
    });
  }

  closeEditPopup(): void {
    this.isPopupVisible = false;
  }

  onSubmit(): void {
    if (this.editProfileForm.valid) {
      const updatedData = this.editProfileForm.value;
      console.log("updatedData in form::",updatedData)
      this.http.put(this.baseUrl+'/updateRestaurantOwnerProfile/'+this.userId, updatedData).subscribe((response) => {
        this.snackBar.open("Updated Restaurant Owner details successfully", "Close", { duration: 3000 });
        this.closeEditPopup();
        this.ngOnInit();
      },
      (error) => {
        alert('Error updating profile.');
      });
    }
  }
  
}
