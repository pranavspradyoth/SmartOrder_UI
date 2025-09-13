import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
 
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
 
  orders: any[] = [];
  statuses: string[] = ['Received', 'Preparing', 'Ready', 'Served'];
  showConfirmationModal = false;
  pendingOrder: any = null;
  pendingStatus: string = '';
  selectedStatuses: { [orderId: string]: string } = {}; // Track selected statuses separately
 
  constructor(private apiService: ApiService) {}
 
   ngOnInit(): void {
    this.loadOrders();
  }
 
  loadOrders() {
    this.apiService.getOrders().subscribe({
      next: (res) => {
        this.orders = res;
        // Initialize selected statuses with current order statuses
        this.orders.forEach(order => {
          this.selectedStatuses[order.id] = order.status;
        });
      },
      error: (err) => console.error(err)
    });
  }
 
  onStatusChange(order: any, newStatus: string) {
    // If the newStatus is empty (placeholder selected), do nothing
    if (!newStatus) {
      return;
    }
    
    // Only proceed if the status has actually changed
    if (order.status === newStatus) {
      return;
    }
    
    // Store the selected status in our map, without changing the actual order status yet
    this.selectedStatuses[order.id] = newStatus;
    
    if (newStatus === 'Ready' || newStatus === 'Served') {
      this.pendingOrder = order;
      this.pendingStatus = newStatus;
      this.showConfirmationModal = true;
    } else {
      this.updateOrderStatus(order, newStatus);
    }
  }

  updateOrderStatus(order: any, status: string) {
    this.apiService.updateOrderStatus(order.id, status).subscribe({
      next: () => {
        console.log(`Updated order ${order.id} to ${status}`);
        // Only update the actual order status after successful API call
        order.status = status;
      },
      error: (err) => {
        console.error(err);
        // Reset the selected status on error
        this.selectedStatuses[order.id] = order.status;
      }
    });
  }

  confirmStatusUpdate() {
    if (this.pendingOrder) {
      // Update the order status in the API
      this.updateOrderStatus(this.pendingOrder, this.pendingStatus);
      this.closeConfirmationModal();
    }
  }

  closeConfirmationModal() {
    if (this.pendingOrder && !this.showConfirmationModal) {
      // If modal is being closed without confirmation (i.e., clicked "No")
      // Reset the selected status to the original order status
      this.selectedStatuses[this.pendingOrder.id] = this.pendingOrder.status;
    }
    
    this.showConfirmationModal = false;
    this.pendingOrder = null;
    this.pendingStatus = '';
  }

  refreshOrders() {
    // Logic to refresh the order list
    this.loadOrders(); // Example logic to simulate refresh
  }
}
