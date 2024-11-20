import { HttpClient, HttpClientModule, HttpParams } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedState } from '../../shared-state';
import { CommonModule, Location } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormField, MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatRadioModule } from '@angular/material/radio';
import { MatDialogModule } from '@angular/material/dialog';

interface OrderItem { food_id: number; food_name: string; order_date: string; order_id: number; order_status: string; quantity_ordered: number; food_image: string; firstname:string; lastname:string; email:string}

@Component({
  selector: 'app-orders-list',
  standalone: true,
  imports: [CommonModule, MatSelectModule,MatInputModule,MatButtonModule,MatIconModule,MatSnackBarModule,
    MatDialogModule,MatRadioModule,MatMenuModule,MatCardModule,MatFormFieldModule,MatFormField,HttpClientModule],
  templateUrl: './resto-orders-list.component.html',
  styleUrl: './resto-orders-list.component.scss'
})
export class RestoOrdersListComponent {
  baseUrl: string = 'http://127.0.0.1:5000/api';
  orders: any[] = []; 
  groupedOrderHistory: { [order_id: string]: OrderItem[] } = {};
  profileOpen: boolean = false;
  restoId: any;
  restoName: any;

  constructor(private route: ActivatedRoute, private http: HttpClient, private location: Location, private router: Router) {}

  ngOnInit(): void {
    this.restoName=history.state.resto_name;
    this.restoId=history.state.resto_id;
    console.log("restoId",this.restoId)
    this.viewOrdersList();
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


  viewOrdersList() {
    let params = new HttpParams();
    const restaurant_id=this.restoId;
    if (restaurant_id) {
      params = params.set('restaurant_id', restaurant_id.toString());
    }
    this.http.get(this.baseUrl + '/viewOrder',{ params }).subscribe((response: any) => {
        this.orders = response.orders;
        console.log('Order details:', this.orders);
        this.groupOrdersByOrderId(this.orders);
      },
      (error) => {
        console.error('Error fetching order details:', error);
      }
    );
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

  getStatusClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'status-badge status-pending';
      case 'completed':
        return 'status-badge status-completed';
      case 'cancelled':
        return 'status-badge status-cancelled';
      default:
        return 'status-badge';
    }
  }
  

  updateOrderStatus(orderId: number, status: string) {
    this.http.put(this.baseUrl+'/updateOrderStatus', {
      order_id: orderId,
      order_status: status
    }).subscribe((response) => {
        console.log('Order status updated:', response);
        this.ngOnInit();
    },
    (error) => {
      console.error('Error updating order status:', error);
    });
  }
}
