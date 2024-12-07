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
import { CommonModule } from '@angular/common';
import { Location } from '@angular/common';
import { SocketModule } from '../../socket.module';
import { Socket } from 'ngx-socket-io';


interface FoodDetails {food_id:string, food_name: string; food_description: string; quantity_available: number; food_type: string; leftover_status: string; expiry_time: number; food_image:string}
@Component({
  selector: 'app-restaurant-food',
  standalone: true,
  imports: [CommonModule, MatSelectModule,FormsModule,ReactiveFormsModule,MatInputModule,MatButtonModule,MatIconModule,MatSnackBarModule,
    MatDialogModule,MatRadioModule,MatMenuModule,MatCardModule,MatFormFieldModule,MatFormField,HttpClientModule,SocketModule],
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
  foodDetails: FoodDetails[]=[{food_id:'', food_name: '', food_description: '', quantity_available: 1, food_type: '', leftover_status: '', expiry_time: 24, food_image: 'Please Upload'}]
  selectedFoodItem!: FoodDetails | null;
  food_info: FoodDetails[]=[];
  ownerName: any;
  selectedfoodFile: File | null = null;
  orders: any[] = []; 
  restoName: string='';
  restoId:string='';
  newOrderAlert = false;
  notifications: any[] = [];
  editRestaurant: boolean = false;
  editRestaurantForm: FormGroup;
  selectedFile: File | undefined;
  showLogoUpload = false;
  formData = new FormData();

  constructor(private socket: Socket, private fb: FormBuilder, private editfb: FormBuilder, private route: ActivatedRoute, private http: HttpClient, private location: Location, private router: Router, public dialog: MatDialog,private snackBar: MatSnackBar, private cdr: ChangeDetectorRef) {
    this.historyData=history.state.data
    this.foodForm = this.fb.group({
      food_id:[],
      restaurant_id:[this.historyData],
      food_name: ['', [Validators.required, Validators.maxLength(100)]],
      food_description: [''],
      quantity_available: [1, [Validators.required, Validators.min(1)]],
      food_type: ['Veg', Validators.required],
      leftover_status: ['Available'],
      food_image: ['Please Upload'],
      expiry_time: [24, Validators.min(1)]
    });
    this.editRestaurantForm = this.editfb.group({
      restaurant_name: ['', Validators.required],
      opening_time: ['', Validators.required],
      closing_time: ['', Validators.required],
      restaurant_logo: [null],
      phone_number: ['', [Validators.required, Validators.pattern(/^[0-9]{10,15}$/)]],
      address: ['', Validators.required],
      status: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.restaurant_id = history.state.data;
    this.ownerName=history.state.name;
    this.restoName=history.state.resto_name;
    this.restoId=history.state.resto_id;
    this.restaurantDetails(this.restaurant_id)
    this.getFoodData(this.restaurant_id);
    this.notification();
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
        food_image: food.food_image,
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

  notification(){
    this.socket.on(`new_order_${this.restaurant_id}`, (notification: any) => {
      console.log('New order received:', notification);
      this.notifications.push(notification);
      if(this.notifications){
        setTimeout(() => {
          this.newOrderAlert = true;
        }, 2000);
        this.playNotificationSound();

      }
      console.log('New order received:', notification);
      console.log('New order in notofications array::', this.notifications);
    });
  }
  
  playNotificationSound(): void {
    const audio = new Audio('../../../assets/notification.mpeg'); 
    audio.play();
    console.log("audio played")
  }

  viewOrder() {
    this.newOrderAlert = false;
    this.router.navigate(['/resto', this.restoId, this.restoName,'order-list'],{ state: { resto_id:this.restaurant_id, resto_name:this.restoName}});
  }

  openEditPopup(){
    this.editRestaurant=true;
    this.editRestaurantDetails();
  }

  onFileSelectedEdit(event: any): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      this.showLogoUpload = false;
    } 
  }

  editRestaurantDetails(){
    this.editRestaurantForm.patchValue({
      restaurant_name: this.restaurant[0].restaurant_name,
      opening_time: this.restaurant[0].opening_time,
      closing_time: this.restaurant[0].closing_time,
      restaurant_logo: this.restaurant[0].restaurant_logo,
      phone_number: this.restaurant[0].phone_number,
      address: this.restaurant[0].address,
      status: this.restaurant[0].status
    });
  }

  closeEditPopup(): void {
    this.editRestaurant = false;
  }

onSubmit(){
  const formData = new FormData();
    Object.keys(this.editRestaurantForm.value).forEach((key) => {
      if (key === 'restaurant_logo' && this.selectedFile) {
        formData.append(key, this.selectedFile, this.selectedFile.name);
      } else {
        formData.append(key, this.editRestaurantForm.value[key]);
      }
    });
    this.http.put(this.baseUrl+'/updateRestaurant/'+this.restaurant[0].restaurant_id, formData).subscribe((response) => {
      this.snackBar.open("Updated Restaurant details successfully", "Close", { duration: 3000 });
      this.closeEditPopup();
      this.ngOnInit();
    },
    (error) => {
      alert('Error updating profile');
    });
  }

}
