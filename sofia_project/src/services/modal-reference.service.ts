import {Injectable} from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';

@Injectable({
  providedIn: 'root'
})
export class ModalServiceReference {
  private dialogRef: MatDialogRef<any> | null = null;

  setDialogRef(ref: MatDialogRef<any>) {
    this.dialogRef = ref;
  }

  getDialogRef() {
    return this.dialogRef;
  }
}
