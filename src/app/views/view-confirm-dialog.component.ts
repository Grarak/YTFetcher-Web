import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material';

@Component({
  selector: 'app-view-confirm-dialog',
  template: `
    <div mat-dialog-content>
      <p>{{data}}</p>
    </div>
    <div mat-dialog-actions>
      <button mat-button [mat-dialog-close]="false">Cancel</button>
      <button mat-button [mat-dialog-close]="true">Ok</button>
    </div>
  `
})
export class ViewConfirmDialogComponent {

  static open(message: string, dialog: MatDialog): MatDialogRef<ViewConfirmDialogComponent> {
    return dialog.open<ViewConfirmDialogComponent, string>(ViewConfirmDialogComponent, {data: message});
  }

  constructor(@Inject(MAT_DIALOG_DATA) public data: string) {
  }

}
