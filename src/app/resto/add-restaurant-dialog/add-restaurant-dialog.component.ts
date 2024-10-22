import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatFormField, MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-add-restaurant-dialog',
  standalone: true,
  imports: [CommonModule, MatSelectModule,FormsModule,ReactiveFormsModule,MatInputModule,MatButtonModule,MatIconModule,MatSnackBarModule,
    MatDialogModule,MatRadioModule,MatMenuModule,MatCardModule,MatFormFieldModule,MatFormField],
  templateUrl: './add-restaurant-dialog.component.html',
  styleUrl: './add-restaurant-dialog.component.scss'
})
export class AddRestaurantDialogComponent {

  addRestoForm: FormGroup;
  selectedFile: File | null = null;
  // addRestoForm!: FormGroup;
  isEditMode: boolean = false;
  restaurantId!: number;

  user = { username: '', email: '', password: '', phone_number: '', address: '', role:'' };
  restaurant_details: any = {resto_id: null,restaurant_name: '',cuisine_type: '',opening_time: '',closing_time: '',restaurant_logo: '',rating:'', status:'', phone_number: '',address:'',pincode:''};
  // selectedFoodItem!: addRestoForm| null;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,public dialogRef: MatDialogRef<AddRestaurantDialogComponent>, private fb: FormBuilder) {
    this.restaurant_details.resto_id=data.ownerId;
    this.addRestoForm = this.fb.group({
      resto_id:[data.ownerId],
      restaurant_name: ['', [Validators.required]],
      cuisine_type: ['', [Validators.required]],
      opening_time: ['', Validators.required],
      closing_time: ['', Validators.required],
      phone_number: ['', [Validators.required, Validators.pattern(/^\d*$/), Validators.minLength(10), Validators.maxLength(10)]],
      address: ['', Validators.required],
      rating:['0'],
      status:['open']
    });
  }

  onSubmit(): void {
    const formData = new FormData();
    if (this.selectedFile) {
      formData.append('restaurant_logo', this.selectedFile, this.selectedFile.name);
    } else {
      console.error('No file selected');
    }
    Object.keys(this.addRestoForm.controls).forEach(key => {
      const value = this.addRestoForm.get(key)?.value;
      if (value !== null && value !== undefined) {
        formData.append(key, value);
      }
    });
  
    // Check the formData contents for debugging
    formData.forEach((value, key) => {
      console.log(key + ': ' + value);
      // console.log("get all form data",formData.getAll)
    });
    this.dialogRef.close(formData);
  }

  // onFileSelected(event: any) {
  //   this.restaurant_details.restaurant_logo = event.target.files[0];
  //   console.log("LOGOO",this.restaurant_details.restaurant_logo)
    
  // }
  onFileSelected(event:any) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0]; // Assign the selected file
    }
    console.log("this.selectedFile",this.selectedFile)
  }

  editFood(resto: any): void {
    // this.showPopup = true;
    // this.isEdit=true
    // this.food_id=food.food_id
    // console.log("food",food);
    // console.log("food Iddd",this.food_id);
    // if (this.foodDetails.length > 0) {
    //   this.foodForm.patchValue({
    //     food_name: food.food_name,
    //     food_description: food.food_description,
    //     quantity_available: food.quantity_available,
    //     food_type: food.food_type,
    //     leftover_status: food.leftover_status,
    //     food_image_url: food.food_image_url,
    //     expiry_time: food.expiry_time,
    //   });
    //   this.editForm(this.foodItems)
    // } else {
    //   this.selectedFoodItem = null; 
    // }
  }

  clearForm(): void {
    // this.closePopup()
    // this.selectedResto = null;
    this.addRestoForm.reset({
      rating: '0',
      status: 'open',
      restaurant_logo: 'Please Update',
    });
  }
}