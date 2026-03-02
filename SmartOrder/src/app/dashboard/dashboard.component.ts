import { Component, OnInit, OnDestroy } from '@angular/core';
import { ApiService } from '../api.service';
import { Subscription, interval } from 'rxjs';
 
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
 
  orders: any[] = [];
  allOrders: any[] = [];
  showConfirmationModal = false;
  pendingOrder: any = null;
  pendingStatus: string = '';
  private pollingSubscription: Subscription | null = null;
  private currentSearchTerm: string = ''; // Track current search term for polling
 
  constructor(private apiService: ApiService) {}
 
   ngOnInit(): void {
    // Load immediately
    this.loadOrders();

    // Start polling every 2 seconds to refresh orders
    this.pollingSubscription = interval(2000).subscribe(() => {
      this.loadOrders();
    });
  }

  ngOnDestroy(): void {
    // Clean up polling subscription to avoid memory leaks
    if (this.pollingSubscription) {
      this.pollingSubscription.unsubscribe();
      this.pollingSubscription = null;
    }
  }
 
  loadOrders() {
    this.apiService.getOrders().subscribe({
      next: (res) => {
        this.allOrders = res;
        
        // Reapply search filter if one is active
        if (this.currentSearchTerm.trim()) {
          this.applySearchFilter(this.currentSearchTerm);
        } else {
          this.orders = Array.isArray(res) ? [...res] : [];
        }
      },
      error: (err) => console.error(err)
    });
  }
 
  onServe(order: any) {
    this.pendingOrder = order;
    this.pendingStatus = 'Served';
    this.showConfirmationModal = true;
  }

  onCancel(order: any) {
    this.pendingOrder = order;
    this.pendingStatus = 'Cancelled';
    this.showConfirmationModal = true;
  }

  updateOrderStatus(order: any, status: string) {
    this.apiService.updateOrderStatus(order.id, status,order.studentName,order.orderId).subscribe({
      next: () => {
        console.log(`Updated order ${order.id} to ${status}`);
        // Only update the actual order status after successful API call
        order.status = status;
      },
      error: (err) => {
        console.error(err);
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
    this.showConfirmationModal = false;
    this.pendingOrder = null;
    this.pendingStatus = '';
  }

  refreshOrders() {
    // Logic to refresh the order list
    this.loadOrders(); // Example logic to simulate refresh
  }

  onSearch(searchTerm: string) {
    this.currentSearchTerm = searchTerm; // Store the search term
    this.applySearchFilter(searchTerm);
  }

  private applySearchFilter(searchTerm: string) {
    const term = (searchTerm || '').toString().trim().toLowerCase();
    if (!term) {
      this.orders = [...this.allOrders];
      return;
    }

    this.orders = this.allOrders.filter(order => {
      const id = order.orderId ?? order.id ?? '';
      return id.toString().toLowerCase().includes(term);
    });
  }
}
