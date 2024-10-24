import { ChangeDetectorRef, Component, TemplateRef, ViewChild } from '@angular/core';
import { HttpClient, HttpClientModule, HttpParams } from '@angular/common/http';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedState } from '../../shared-state';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatFormField, MatFormFieldModule } from '@angular/material/form-field';
import { AddRestaurantDialogComponent } from '../add-restaurant-dialog/add-restaurant-dialog.component';
import { CommonModule } from '@angular/common';
import { Location } from '@angular/common';


interface FoodDetails {food_id:string, food_name: string; food_description: string; quantity_available: number; food_type: string; leftover_status: string; expiry_time: number; food_image_url:string}
@Component({
  selector: 'app-restaurant-food',
  standalone: true,
  imports: [CommonModule, MatSelectModule,FormsModule,ReactiveFormsModule,MatInputModule,MatButtonModule,MatIconModule,MatSnackBarModule,
    MatDialogModule,MatRadioModule,MatMenuModule,MatCardModule,MatFormFieldModule,MatFormField,HttpClientModule],
  templateUrl: './restaurant-food.component.html',
  styleUrl: './restaurant-food.component.scss'
})
export class RestaurantFoodComponent {
  baseUrl: string = 'http://127.0.0.1:5000/api';
  foodForm: FormGroup;
  foodItems:any;
  restaurant:any;
  foodItem:string | undefined
  showPopup: boolean = false;
  restaurant_id:number | undefined;
  profileOpen: boolean = false;
  isEdit = false;
  food_id:any;
  user_id:number | undefined;
  historyData: any;
  @ViewChild('myTemplate') myTemplate!: TemplateRef<any>;
  food_image: any;
  foodDetails: FoodDetails[]=[{food_id:'', food_name: '', food_description: '', quantity_available: 1, food_type: '', leftover_status: '', expiry_time: 24, food_image_url: 'Please Upload'}]
  selectedFoodItem!: FoodDetails | null;
  food_info: FoodDetails[]=[];
  ownerName: any;
  selectedfoodFile: File | null = null;

  constructor(private fb: FormBuilder,private route: ActivatedRoute, private http: HttpClient, private location: Location, private router: Router, public dialog: MatDialog,private snackBar: MatSnackBar, private cdr: ChangeDetectorRef) {
    this.historyData=history.state.data
    this.foodForm = this.fb.group({
      food_id:[],
      restaurant_id:[this.historyData],
      food_name: ['', [Validators.required, Validators.maxLength(100)]],
      food_description: [''],
      quantity_available: [1, [Validators.required, Validators.min(1)]],
      food_type: ['Veg', Validators.required],
      leftover_status: ['Available'],
      food_image_url: ['Please Upload'],
      expiry_time: [24, Validators.min(1)]
    });
  }

  ngOnInit(): void {
    this.restaurant_id = history.state.data;
    this.ownerName=history.state.name;
    this.restaurantDetails(this.restaurant_id)
    this.getFoodData(this.restaurant_id);
  }

  openPopup(): void {
    this.showPopup = true;
  }

  closePopup(): void {
    this.showPopup = false;
  }

  editFood(food: FoodDetails ): void {
    this.showPopup = true;
    this.isEdit=true
    this.food_id=food.food_id
    console.log("restaurant food Id",this.food_id);
    if (this.foodDetails.length > 0) {
      this.foodForm.patchValue({
        restaurant_id:this.historyData,
        food_name: food.food_name,
        food_description: food.food_description,
        quantity_available: food.quantity_available,
        food_type: food.food_type,
        leftover_status: food.leftover_status,
        food_image_url: food.food_image_url,
        expiry_time: food.expiry_time,
      });
    } else {
      this.selectedFoodItem = null; 
    }
  }

  getFullImageUrl(logo: string): string {
    return logo ? `http://127.0.0.1:5000/uploads/${logo}` : '';
  }

  onFileSelected(event:any) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedfoodFile = input.files[0];
    }
    console.log("this.selectedFile",this.selectedfoodFile)
  }

  clearForm(): void {
    this.closePopup()
    this.selectedFoodItem = null;
    this.foodForm.reset({
      food_id:'',
      restaurant_id:this.historyData,
      quantity_available:1,
      food_type: 'Veg',
      leftover_status: 'Available',
      expiry_time: 24,
    });
  }

  async submitFood() {
    let foodData = new FormData(); 
    Object.keys(this.foodForm.controls).forEach(key => {
      const value = this.foodForm.get(key)?.value;
      if (value !== null && value !== undefined) {
        foodData.append(key, value);
      }
    });
    if (this.selectedfoodFile) {
      foodData.append('food_image', this.selectedfoodFile, this.selectedfoodFile.name); 
      console.log("food data", foodData); 
    } else {
      console.error('No file selected');
    }
    if (this.isEdit) {
      this.updateFood(foodData); 
      this.isEdit = false;
    } else {
      this.addFood(foodData); 
    }

    await this.clearForm()
    await this.cdr.detectChanges();
    await this.ngOnInit();
  }

  addFood(result:any){
    this.http.post(this.baseUrl+'/addFood',result).subscribe((resp:any)=>{
      this.snackBar.open("New Food item added successfully", "Close", { duration: 3000 });
      this.showPopup = false;
      console.log("after added new food",resp)
      this.clearForm();
      this.ngOnInit();
      this.cdr.detectChanges();
    })
  }

  profileMenu() {
    this.profileOpen = !this.profileOpen;
  }

  goBack(){
    this.location.back();
  }

  logout() {
    SharedState.loggedIn = false; 
    this.router.navigate(['/home']); 
  }

  getOwnerDetails(userId:any){
    this.http.get(this.baseUrl+'/resto/'+userId).subscribe((resp:any)=>{
      console.log("Food details",resp)
    });
  }

  restaurantDetails(id:any){
    this.http.get(this.baseUrl+'/restaurant/'+id).subscribe((resp:any)=>{
      console.log('Restaurant',resp)
      this.restaurant=resp;
    })
  }

  getFoodData(id:any) {
    let params = new HttpParams();
    const restaurant_id=id;
    if (restaurant_id) {
      params = params.set('restaurant_id', restaurant_id.toString());
    }
    this.http.get(this.baseUrl + '/getFoodDetails', { params }).subscribe((data) => {
      this.foodItems = data;
      console.log("this.foodItems",this.foodItems);
      this.foodDetails.push(this.foodItems);
      console.log("this.foodDetails", this.foodDetails[1])
    });
  }

  updateFood(result:any){
    let params = new HttpParams();
    const restaurant_id=this.restaurant_id;
    if (restaurant_id) {
      params = params.set('restaurant_id', restaurant_id.toString());
    }
    console.log("result after edit",result)
    this.http.put(this.baseUrl+'/updateFood/'+this.food_id,result,{ params }).subscribe((resp:any)=>{
      this.snackBar.open("Updated Food details successfully", "Close", { duration: 3000 });
      this.showPopup = false;
      console.log("after updating food details",resp)
      this.clearForm();
      this.ngOnInit();
      this.cdr.detectChanges();
    })
  }

  deleteFood(foodId:any){
    this.http.delete(this.baseUrl+'/deleteFood/'+foodId).subscribe((resp:any)=>{
      console.log("delete food",resp)
      this.ngOnInit();
      this.cdr.detectChanges();
    })
  }
  
  deleteRestaurant(restaurantId: any) {
    this.http.delete(this.baseUrl+'/deleteRestaurant/'+restaurantId).subscribe((resp:any)=>{
      console.log("delete restaurant",resp)
      this.goBack()
    })
  }

}
