import { CommonModule, Location } from '@angular/common';
import { HttpClientModule, HttpClient, HttpParams } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatFormField, MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedState } from '../../shared-state';

interface OrderItem { food_id: number; food_name: string; order_date: string; order_id: number; order_status: string; quantity_ordered: number; food_image: string; firstname: string; lastname: string; email: string }

@Component({
  selector: 'app-contributor-orders-list',
  standalone: true,
  imports: [CommonModule, MatSelectModule, MatInputModule, MatButtonModule, MatIconModule, MatSnackBarModule,
    MatDialogModule, MatRadioModule, MatMenuModule, MatCardModule, MatFormFieldModule, MatFormField, HttpClientModule],
  templateUrl: './contributor-orders-list.component.html',
  styleUrl: './contributor-orders-list.component.scss'
})
export class ContributorOrdersListComponent {
  baseUrl: string = 'http://127.0.0.1:5000/api';
  orders: any[] = [];
  groupedOrderHistory: { [order_id: string]: OrderItem[] } = {};
  profileOpen: boolean = false;
  contributorId: any;
  restoName: any;

  constructor(private route: ActivatedRoute, private http: HttpClient, private location: Location, private router: Router) { }

  ngOnInit(): void {
    this.contributorId = history.state.contributorId;
    console.log("restoId", this.contributorId)
    this.viewOrdersList();
  }

  profileMenu() {
    this.profileOpen = !this.profileOpen;
  }

  goBack() {
    this.location.back();
  }

  logout() {
    SharedState.loggedIn = false;
    this.router.navigate(['/home']);
  }

  viewOrdersList() {
    let params = new HttpParams();
    const contributor_id = this.contributorId;
    if (contributor_id) {
      params = params.set('contributor_id', contributor_id.toString());
    }
    this.http.get(this.baseUrl + '/viewOrder', { params }).subscribe((response: any) => {
      this.orders = response.orders;
      this.orders = this.orders.map(order => ({...order,
        order_date: this.formatDateToSimpleString(order.order_date)
      }));
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
    this.http.put(this.baseUrl + '/updateOrderStatus', {
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

  private formatDateToSimpleString(dateString: string): string {
    const date = new Date(dateString);
    return date.toUTCString().replace('GMT', '').trim();
  }

}
