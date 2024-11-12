import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-disclaimer-dialog',
  standalone: true,
  imports: [],
  templateUrl: './disclaimer-dialog.component.html',
  styleUrl: './disclaimer-dialog.component.scss'
})
export class DisclaimerDialogComponent {

  constructor(public dialogRef: MatDialogRef<DisclaimerDialogComponent>) {}

  onAccept(): void {
    this.dialogRef.close(true);
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
  
}
