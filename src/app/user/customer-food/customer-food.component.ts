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
interface FoodItem { food_id: number; food_name: string; food_description: string; quantity_available: number; food_type: string; leftover_status: string; food_image: string; }

@Component({
  selector: 'app-customer-food',
  standalone: true,
  imports: [CommonModule, MatSelectModule,FormsModule,ReactiveFormsModule,MatInputModule,MatButtonModule,MatIconModule,MatSnackBarModule,
    MatDialogModule,MatRadioModule,MatMenuModule,MatCardModule,MatFormFieldModule,MatFormField,HttpClientModule],
  templateUrl: './customer-food.component.html',
  styleUrl: './customer-food.component.scss'
})
export class CustomerFoodComponent {
  baseUrl: string = 'http://127.0.0.1:5000/api';
  info:any;
  userId:any;
  restaurant: any;
  contributor: any;
  customer:any;
  profileOpen: boolean = false;
  foodItems: FoodItem[] = [];
  foodDetails:any[]=[];
  cartItems: any[] = [];
  maxCartQuantity = 2;
  showCartPopup = false;

  constructor(private fb: FormBuilder,private route: ActivatedRoute, private http: HttpClient,private router: Router, private location: Location, public dialog: MatDialog,private snackBar: MatSnackBar,private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.restaurant = history.state.info;
    this.contributor = history.state.info;
    this.customer= history.state.detail;
    this.userId=history.state.userId;
    console.log("this.userId",this.userId)

    if(this.restaurant.restaurant_id){
      this.getRestaurantFoodList(this.restaurant.restaurant_id);
    } else {
      this.getContributorFoodList(this.contributor.contributor_id)
    }
    
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

  getFullImageUrl(logo: string): string {
    return logo ? `http://127.0.0.1:5000/uploads/${logo}` : '';
  }

  getRestaurantFoodList(id:any){
    let params = new HttpParams();
    const restaurant_id=id;
    if (restaurant_id) {
      params = params.set('restaurant_id', restaurant_id.toString());
    }
    this.http.get(this.baseUrl+'/foodList',{ params }).subscribe((resp:any)=>{
      console.log('Restaurant Food List',resp)
      this.foodItems=resp;
      this.foodDetails.push(this.foodItems);
      console.log("this.foodDetails",this.foodDetails)
    })
  }

  getContributorFoodList(id:any){
    let params = new HttpParams();
    const contributor_id=id;
    if (contributor_id) {
      params = params.set('contributor_id', contributor_id.toString());
    }
    this.http.get(this.baseUrl+'/foodList',{ params }).subscribe((resp:any)=>{
      console.log('Contributor Food List',resp)
      this.foodItems=resp;
      this.foodDetails.push(this.foodItems);
      console.log("this.foodDetails",this.foodDetails[0])
    });
  }

  isFoodUnavailable(food: any): boolean {
    const foodInCart = this.getItemInCart(food);
    return food.leftover_status === 'Not Available' || (foodInCart && foodInCart.order_quantity >= food.quantity_available);
  }

  addToCart(food: any) {
    const totalQuantityInCart = this.getTotalCartQuantity();
    const foodInCart = this.getItemInCart(food);

    if (totalQuantityInCart >= this.maxCartQuantity) {
      this.snackBar.open('Cart has reached the maximum quantity limit', 'Close', {
        duration: 3000,
      });
      return;
    }

    if (foodInCart) {
      if (foodInCart.order_quantity >= food.quantity_available) {
        this.snackBar.open(`Only ${food.quantity_available} of ${food.food_name} is available.`, 'Close', {
          duration: 3000,
        });
        return;
      }
      this.cartItems = this.cartItems.map(item =>
        item.food_id === food.food_id ? { ...item, order_quantity: item.order_quantity + 1 } : item);
    } else {
      this.cartItems.push({
        food_id: food.food_id,
        food_name: food.food_name,
        customer_id: this.customer.customer_id,
        order_quantity: 1,
      });
    }

    const formattedCart = {
      customer_id: this.customer.customer_id,
      food_items: this.cartItems.map(item => ({
        food_id: item.food_id,
        quantity_ordered: item.order_quantity
      }))
    };
    console.log("Formatted Cart to Send to Backend:", formattedCart);
  }
  
  increaseQuantity(food: any): void {
  const foodInCart = this.getItemInCart(food);
  const totalQuantityInCart = this.getTotalCartQuantity();
  if (totalQuantityInCart >= this.maxCartQuantity) {
    this.snackBar.open('Cart has reached the maximum quantity limit', 'Close', { duration: 3000 });
    return;
  }
  if (foodInCart) {
    if (foodInCart.order_quantity < food.quantity_available) {
      this.cartItems = this.cartItems.map(item =>
        item.food_id === food.food_id ? { ...item, order_quantity: item.order_quantity + 1 } : item
      );
      console.log("Item quantity increased:", foodInCart.order_quantity + 1);
    } else {
      this.snackBar.open(`Only ${food.quantity_available} of ${food.food_name} is available`, 'Close', { duration: 3000 });
    }
  }
  console.log("cartItems after increase", this.cartItems);
  }
  
  decreaseQuantity(food: any) {
    this.cartItems = this.cartItems
      .map(item => {
        if (item.food_id === food.food_id) {
          const newQuantity = item.order_quantity - 1;
          return newQuantity > 0 ? { ...item, order_quantity: newQuantity } : null;
        }
        return item;
      }).filter(item => item !== null);
    console.log("cartItems after decrease", this.cartItems);
  }
  
  getTotalCartQuantity(): number {
    return this.cartItems.reduce((total, item) => total + item.order_quantity, 0);
  }
  
  getItemInCart(food: any) {
    return this.cartItems.find(item => item.food_id === food.food_id);
  }

  toggleCartPopup(event:Event) {
    event.stopPropagation();
    this.showCartPopup = !this.showCartPopup;
  }

  closeCartPopup(): void {
    this.showCartPopup = false;
  }

  placeOrder(cartItems:any) {
    const orderData = {
      customer_id: this.customer.customer_id,
      cartItems: cartItems
    }; 
    this.http.post(this.baseUrl + '/placeOrder', orderData).subscribe(response => {
      this.router.navigate(['/customer',this.userId])
      this.snackBar.open('Order Placed Succesfully', 'Close', { duration: 3000 });
    }, error => {
      console.error('Error placing order:', error);
    });
  }
  
}