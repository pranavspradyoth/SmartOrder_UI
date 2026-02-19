import { Component } from '@angular/core';
import { ApiService } from '../api.service';
import { NgModule } from '@angular/core';

@Component({
  selector: 'app-update-menu',
  templateUrl: './update-menu.component.html',
  styleUrls: ['./update-menu.component.scss']
})

export class UpdateMenuComponent {
  items: any[] = [];
  categories: any = [];
  newItem = { name: '', price: '', stock: '', available: true, category: '' };
  editPopupVisible = false;
  editinItem: any = {};

  constructor(private api: ApiService) {}
 
  ngOnInit(): void {
    this.loadItems();
    this.loadCategories();
  }

  loadCategories() {
    this.api.getCategories().subscribe({
      next: (res) => {
        this.categories = res;
        console.log(this.categories,res);
      },
      error: (err) => console.error(err)
    });
  }
 
  loadItems() {
    this.api.getItems().subscribe({
      next: (res) => this.items = res,
      error: (err) => console.error(err)
    });
  }
 
  addItem() {
    this.api.addItem(this.newItem).subscribe({
      next: () => {
        this.newItem = { name: '', price: '', stock: '', available: true, category: '' };
        this.loadItems();
      },
      error: (err) => console.error(err)
    });
  }
 
  editItem(item: any) {
    // For simplicity: toggle availability
    this.api.updateItem(item._id, item).subscribe({
      next: () => this.loadItems(),
      error: (err) => console.error(err)
    });
  }
 
  deleteItem(id: any) {
    this.api.deleteItem(id).subscribe({
      next: () => this.loadItems(),
      error: (err) => console.error(err)
    });
  }
  allowOnlyNumbers(event: KeyboardEvent) {
    const charCode = event.charCode;
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
    }
  }

  openEditPopup(item: any) {
    this.editPopupVisible = true;
    this.editinItem = { ...item };
    // If item.category is undefined, set to empty string for dropdown
    if (!this.editinItem.category) this.editinItem.category = '';
  }
 
  closeEditPopup() {
    this.editPopupVisible = false;
    this.editinItem = {};
  }
 
  saveEdit() {
    this.api.updateItem(this.editinItem._id, this.editinItem).subscribe(() => {
      this.loadItems();
      this.closeEditPopup();
    });
  }
}
