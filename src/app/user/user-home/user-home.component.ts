import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
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
import { DisclaimerDialogComponent } from '../disclaimer-dialog/disclaimer-dialog.component';

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
  customerId: any;
  editProfileForm: FormGroup;
  isPopupVisible = false;
  constructor(private fb: FormBuilder,private route: ActivatedRoute, private http: HttpClient,private router: Router, public dialog: MatDialog,private snackBar: MatSnackBar,  private editfb: FormBuilder) {
    this.editProfileForm= this.editfb.group({
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone_number: ['', [Validators.required, Validators.pattern(/^[0-9]{10,15}$/)]],
      address: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.custoId = this.route.snapshot.params['id'];
    console.log("user ID",this.custoId);
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

  history(){
    this.router.navigate(['/customer', this.custoId,'order-history'],{ state: { info:this.customerName, customerId:this.customerId }});
  }

  viewRestaurant(restaurant:any,restoName:string,restaurant_id:number) {
    const dialogRef = this.dialog.open(DisclaimerDialogComponent, {
      width: '520px',
      height: '500px'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.router.navigate(['/customer', this.custoId, restoName,'details'],{ state: { data:restaurant_id, info:restaurant, detail:this.customerName, userId:this.custoId, customerId:this.customerId}});
      }
    });
  }

  viewContributor(contributor:any,contributorName:string,contributor_id:number) {
    const dialogRef = this.dialog.open(DisclaimerDialogComponent, {
      width: '520px',
      height: '500px'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.router.navigate(['/customer', this.custoId, contributorName,'details'],{ state: { data:contributor_id, info:contributor, detail:this.customerName, userId:this.custoId, customerId:this.customerId}});
      }
    });
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
      this.customerName=this.customerInfo[0];
      console.log("Customer details",this.customerName)
      this.name=this.customerName.username;
      this.customerId=this.customerName.customer_id;
    })
  }

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

  filteredContributors() {
    if (!this.contributors || this.contributors.length === 0) {
      return [];
    }
    if (!this.searchTerm) {
      return this.contributors;
    }
    return this.contributors.filter((names: { username: string; }) =>
      names.username.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

    
  openEditPopup(): void { 
    this.isPopupVisible = true;
    this.editfbForm(); 
  }
  
  editfbForm(){
    this.editProfileForm.patchValue({
      firstname: this.customerInfo[0].firstname,
      lastname: this.customerInfo[0].lastname,
      email: this.customerInfo[0].email,
      phone_number: this.customerInfo[0].phone_number,
      address: this.customerInfo[0].address,
    });
  }

  closeEditPopup(): void {
    this.isPopupVisible = false;
  }

  onSubmit(): void {
    if (this.editProfileForm.valid) {
      const updatedData = this.editProfileForm.value;
      console.log("updatedData in form::",updatedData)
      this.http.put(this.baseUrl+'/updateCustomerProfile/'+this.custoId, updatedData).subscribe((response) => {
        this.snackBar.open("Updated Customer details successfully", "Close", { duration: 3000 });
        this.closeEditPopup();
        this.ngOnInit();
      },
      (error) => {
        alert('Error updating profile.');
      });
    }
  }

}
