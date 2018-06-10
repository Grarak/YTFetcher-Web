import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material';

@Component({
  selector: 'app-view-text-select-dialog',
  template: `
    <h1 mat-dialog-title>{{data}}</h1>
    <div mat-dialog-content>
      <mat-form-field>
        <input matInput [(ngModel)]="text">
      </mat-form-field>
    </div>
    <div mat-dialog-actions>
      <button mat-button (click)="dismiss()">Cancel</button>
      <button mat-button [mat-dialog-close]="text">Confirm</button>
    </div>
  `
})
export class ViewTextSelectDialogComponent implements OnInit {

  text: string;

  static open(title: string, dialog: MatDialog): MatDialogRef<ViewTextSelectDialogComponent, string> {
    return dialog.open<ViewTextSelectDialogComponent, string, string>(ViewTextSelectDialogComponent, {data: title});
  }

  constructor(private dialogRef: MatDialogRef<ViewTextSelectDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: string) {
  }

  ngOnInit() {
  }

  dismiss() {
    this.dialogRef.close();
  }

}
