import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material';

@Component({
  selector: 'app-view-error-dialog',
  template: `
    <div mat-dialog-content>
      <p>{{data}}</p>
    </div>
    <div mat-dialog-actions>
      <button mat-button (click)="dismiss()">OK</button>
    </div>
  `
})
export class ViewErrorDialogComponent {

  static open(message: string, dialog: MatDialog): MatDialogRef<ViewErrorDialogComponent> {
    return dialog.open<ViewErrorDialogComponent, string>(ViewErrorDialogComponent, {data: message});
  }

  constructor(private dialogRef: MatDialogRef<ViewErrorDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: string) {
  }

  dismiss() {
    this.dialogRef.close();
  }

}
