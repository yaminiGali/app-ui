import { ChangeDetectorRef, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { HttpClient, HttpClientModule, HttpParams } from '@angular/common/http';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
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
import { SocketModule } from '../../socket.module';
import { Socket } from 'ngx-socket-io';
interface FoodDetails { food_id: string, contributor_id:number; food_name: string; food_description: string; quantity_available: number; food_type: string; leftover_status: string; expiry_time: number; food_image: string }
@Component({
  selector: 'app-contributor-home',
  standalone: true,
  imports: [CommonModule, MatSelectModule, FormsModule, ReactiveFormsModule, MatInputModule, MatButtonModule, MatIconModule, MatSnackBarModule,
    MatDialogModule, MatRadioModule, MatMenuModule, MatCardModule, MatFormFieldModule, MatFormField, HttpClientModule, SocketModule],
  templateUrl: './contributor-home.component.html',
  styleUrl: './contributor-home.component.scss'
})
export class ContributorHomeComponent {
  baseUrl: string = 'http://127.0.0.1:5000/api';
  foodForm: FormGroup;
  contributorId: any;
  userId:any;
  foodItems: any;
  restaurant:any[]=[];
  contributorInfo: any;
  searchTerm: string = '';
  customerName: string | undefined;
  profileOpen: boolean = false;
  showPopup: boolean = false;
  isEdit = false;
  food_id: any;
  foodDetails: FoodDetails[] = [{ food_id: '',contributor_id:0, food_name: '', food_description: '', quantity_available: 1, food_type: '', leftover_status: '', expiry_time: 24, food_image: 'Please Upload' }]
  selectedFoodItem!: FoodDetails | null;
  food_info: FoodDetails[] = [];
  contributor: any;
  selectedfoodFile: File | null = null;
  newOrderAlert = false;
  notifications: any[] = [];
  // constructor(private fb: FormBuilder,private route: ActivatedRoute, private http: HttpClient,private router: Router, public dialog: MatDialog,private snackBar: MatSnackBar) {}
  constructor(private socket: Socket, private fb: FormBuilder, private route: ActivatedRoute, private http: HttpClient, private router: Router, public dialog: MatDialog, private snackBar: MatSnackBar, private cdr: ChangeDetectorRef) {
    this.foodForm = this.fb.group({
      food_id: [''],
      contributor_id: [],
      food_name: ['', [Validators.required, Validators.maxLength(100)]],
      food_description: [''],
      quantity_available: [1, [Validators.required, Validators.min(1)]],
      food_type: ['Veg', Validators.required],
      leftover_status: ['Available'],
      food_image: ['Please Upload'],
      expiry_time: [4, Validators.min(1)]
    });
  }
  ngOnInit(): void {
    this.userId = this.route.snapshot.params['id'];
    this.getContributor(this.userId)
  }

  getFullImageUrl(logo: string): string {
    return logo ? `http://127.0.0.1:5000/uploads/${logo}` : '';
  }

  getContributor(userId:any){
    this.http.get(this.baseUrl+'/contributor/'+userId).subscribe((resp:any)=>{
      this.contributor = resp
      this.contributorId=resp[0].contributor_id;
      this.contributorInfo=resp[0].username;
      this.getFoodData(this.contributorId);
      this.notification(this.contributorId);
    });
  }

  logout() {
    SharedState.loggedIn = false;
    this.router.navigate(['/home']);
  }

  profileMenu() {
    this.profileOpen = !this.profileOpen;
  }
  openPopup(): void {
    this.foodForm.patchValue({
      contributor_id: this.contributorId
    });
    this.showPopup = true;
  }

  closePopup(): void {
    this.showPopup = false;
  }

  editForm(foodItems: any) {
    console.log("edit food logs", foodItems)
  }

  clearForm(): void {
    this.closePopup()
    this.selectedFoodItem = null;
    this.foodForm.reset({
      food_type: 'Veg',
      leftover_status: 'Available',
      expiry_time: 4,
    });
  }

  onFileSelected(event:any) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedfoodFile = input.files[0];
    }
    console.log("this.selectedFile",this.selectedfoodFile)
  }

  submitFood() {
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
    } else {
      this.addFood(foodData);
      console.log('submit form in add', foodData);
    }
  }

  addFood(result: any) {
    this.http.post(this.baseUrl + '/addFood', result).subscribe((resp: any) => {
      this.snackBar.open("New Food item added successfully", "Close", { duration: 3000 });
      this.showPopup = false;
      console.log("after added new food", resp)
      this.clearForm();
      this.ngOnInit();
    })
  }

  getFoodData(id:any) {
    let params = new HttpParams();
    const contributor_id=id;
    if (contributor_id) {
      params = params.set('contributor_id', contributor_id.toString());
    }
    this.http.get(this.baseUrl + '/getFoodDetails', { params }).subscribe((data) => {
      this.foodItems = data;
      console.log("this.foodItems",this.foodItems);
      this.foodDetails.push(this.foodItems);
      console.log("this.foodDetails", this.foodDetails[1])
    });
  }

  updateFood(result: any) {
    let params = new HttpParams();
    const contributor_id=this.contributorId;
    if (contributor_id) {
      params = params.set('contributor_id', contributor_id.toString());
    }
    console.log("result after edit", result)
    this.http.put(this.baseUrl + '/updateFood/' + this.food_id, result,{ params }).subscribe((resp: any) => {
      this.snackBar.open("Updated Food details successfully", "Close", { duration: 3000 });
      this.showPopup = false;
      console.log("after updating food details", resp)
      this.ngOnInit();
    })
  }

  editFood(food: FoodDetails): void {
    // this.showPopup = true;
    this. openPopup();
    this.isEdit = true
    this.food_id = food.food_id
    console.log("food", food);
    console.log("food Iddd", this.food_id);
    if (this.foodDetails.length > 0) {
      this.foodForm.patchValue({
        food_id:this.food_id,
        food_name: food.food_name,
        food_description: food.food_description,
        quantity_available: food.quantity_available,
        food_type: food.food_type,
        leftover_status: food.leftover_status,
        food_image: food.food_image,
        expiry_time: food.expiry_time,
      });
      this.editForm(this.foodItems)
    } else {
      this.selectedFoodItem = null;
    }
  }
  deleteFood(foodId:any){
    this.http.delete(this.baseUrl+'/deleteFood/'+foodId).subscribe((resp:any)=>{
      console.log("delete food",resp)
      this.ngOnInit();
      this.cdr.detectChanges();
    })
  }

  notification(contributorId:any){
    this.socket.on(`new_order_${contributorId}`, (notification: any) => {
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
    this.router.navigate(['/contributor',this.userId,'order-list'], { state: { contributorId:this.contributorId } });
  }
}
