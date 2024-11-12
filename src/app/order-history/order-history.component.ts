import { CommonModule, Location } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormField, MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { SharedState } from '../shared-state';

// interface Order { food_id: number; food_name: string; order_date: string; order_id: number; order_status: string; quantity_ordered: number; }
interface OrderItem {
  food_id: number;
  food_name: string;
  order_date: string;
  order_id: number;
  order_status: string;
  quantity_ordered: number;
  food_image: string;
}
@Component({
  selector: 'app-order-history',
  standalone: true,
  imports: [HttpClientModule, CommonModule, MatSelectModule,FormsModule,ReactiveFormsModule,MatInputModule,MatButtonModule,MatIconModule,MatSnackBarModule,
    MatDialogModule,MatRadioModule,MatMenuModule,MatCardModule,MatFormFieldModule,MatFormField],
  templateUrl: './order-history.component.html',
  styleUrl: './order-history.component.scss'
})
export class OrderHistoryComponent {
  customerId: any;
  customerInfo: any;
  // orderHistory: Order[] = [];
  profileOpen: boolean = false;
  groupedOrderHistory: { [order_id: string]: OrderItem[] } = {};
  baseUrl: string = 'http://127.0.0.1:5000/api';

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router, private location: Location) {}

  ngOnInit() {
    this.customerInfo=history.state.info;
    this.customerId=history.state.customerId;
    console.log("CustomerId: ",this.customerId)
    this.http.get<OrderItem[]>(this.baseUrl+'/orderHistory/'+this.customerId).subscribe((res)=>{
      this.groupOrdersByOrderId(res);
      // this.orderHistory=res
      console.log("Order response List: ",res)
  })
}
  goBack(){
    this.location.back();
  }

  logout() {
    SharedState.loggedIn = false; 
    this.router.navigate(['/home']); 
  }
  profileMenu() {
    this.profileOpen = !this.profileOpen;
  }

  private groupOrdersByOrderId(orderItems: OrderItem[]) {
    this.groupedOrderHistory = orderItems.reduce((acc, item) => {
      if (!acc[item.order_id]) {
        acc[item.order_id] = [];
      }
      acc[item.order_id].push(item);
      return acc;
    }, {} as { [order_id: number]: OrderItem[] });
  }


}
