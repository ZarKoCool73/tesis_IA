import {Component, OnInit, Inject} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {UserServiceService} from 'src/services/user-service.service';
import {RouterLink} from "@angular/router";
import {HttpErrorResponse} from "@angular/common/http";
import Swal from 'sweetalert2';
import {NgbModal, NgbModalConfig} from '@ng-bootstrap/ng-bootstrap';
import {MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import {NgClass, NgIf} from "@angular/common";
import {MatButtonModule} from "@angular/material/button";
import {ModalServiceReference} from "../../../services/modal-reference.service";
import {MatFormFieldModule} from "@angular/material/form-field";
import {EncryptionService} from "../../../services/encryption-service.service";
import {UtilsService} from "../../../services/utils.service";
import {MatIconModule} from "@angular/material/icon";

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
  providers: [NgbModalConfig, NgbModal],
  standalone: true,
  imports: [MatButtonModule, MatDialogModule, RouterLink, ReactiveFormsModule, NgIf, MatFormFieldModule, NgClass, MatIconModule],
})
export class SignInComponent implements OnInit {
  hideToggle = true
  hide = true

  /*BANDERAS*/
  stateEmail = false
  statePassword = false
  referenceModal: MatDialogRef<any> | any
  msg = 'Buenos días';

  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required),
    id_School: new FormControl('')
  });

  constructor(
    private _userService: UserServiceService,
    public dialog: MatDialog,
    private modalReference: ModalServiceReference,
    private encryptionService: EncryptionService,
    private _utilsService: UtilsService
  ) {
  }

  ngOnInit(): void {
    this.updateGreeting();
  }

  togglePassword() {
    this.hide = !this.hide;
  }

  updateGreeting() {
    const now = new Date();
    const hour = now.getHours();

    if (hour >= 5 && hour < 12) {
      this.msg = 'Buenos días';
    } else if (hour >= 12 && hour < 18) {
      this.msg = 'Buenas tardes';
    } else {
      this.msg = 'Buenas noches';
    }
  }

  login() {
    if (!this.form.invalid) {
      const values = this.form.getRawValue();
      this.convert(values)
      const body = {
        email: values.email,
        password: values.password,
      };
      Swal.showLoading();
      this._userService.login(body).subscribe(
        (res: any) => {
          if (res.state == 1) {
            Swal.close();
            const userId = res.userId;
            this.encrypt(userId)
            //localStorage.setItem('userId', userId);
            this.open()
          }
        },
        (error: HttpErrorResponse) => {
          Swal.close();
          if (error.error.state == 0) {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: error.error.message,
              confirmButtonColor: '#ff3600',
            });
          }
        }
      );
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Completar de manera correcta los datos',
        confirmButtonColor: '#ff3600',
      });
    }
  }

  convert(obj: { [key: string]: any }): void {
    for (let key in obj) {
      if (typeof obj[key] === 'string') {
        obj[key] = obj[key].toUpperCase();
      }
    }
  }

  open() {
    this.referenceModal = this.dialog.open(DialogDataExampleDialog, {
      data: {
        animal: 'panda',
      },
      height: '530px',
      width: '650px',
      disableClose: true,
    })
    this.modalReference.setDialogRef(this.referenceModal);
  }

  verifyEmail(event: any): boolean {
    const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const data = event
    let valido = true
    if (regexCorreo.test(data)) {
      valido = true
    } else {
      valido = false
    }
    return valido
  }

  validateEmail() {
    const resultado = this.verifyEmail(this.form.value.email);
    this.stateEmail = resultado;
  }

  encrypt(id: any) {
    const encryptID = this.encryptionService.encryptData(id);
    localStorage.setItem('userId', encryptID);
  }


}

@Component({
  selector: 'mat-dialog-content',
  templateUrl: 'modulos.html',
  standalone: true,
  imports: [MatDialogModule, NgIf, RouterLink],
})
export class DialogDataExampleDialog {
  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogDataExampleDialog,
              private modalReference: ModalServiceReference
  ) {
  }


  close() {
    const dialogRef = this.modalReference.getDialogRef();
    if (dialogRef) {
      dialogRef.close();
    }
  }
}
