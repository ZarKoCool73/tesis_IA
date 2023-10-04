import {Component, OnInit, ViewChild, TemplateRef, Inject} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {UserServiceService} from 'src/services/user-service.service';
import {Router, RouterLink} from "@angular/router";
import {HttpErrorResponse} from "@angular/common/http";
import Swal from 'sweetalert2';
import {NgbModal, NgbModalConfig} from '@ng-bootstrap/ng-bootstrap';
import {MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import {NgIf} from "@angular/common";
import {MatButtonModule} from "@angular/material/button";
import {ModalServiceReference} from "../../../services/modal-reference.service";

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
  providers: [NgbModalConfig, NgbModal],
  standalone: true,
  imports: [MatButtonModule, MatDialogModule, RouterLink, ReactiveFormsModule],
})
export class SignInComponent implements OnInit {
  referenceModal: MatDialogRef<any> | any
  msg = 'Buenos días';
  form = new FormGroup({
    email: new FormControl(),
    password: new FormControl()
  });

  constructor(
    private _userService: UserServiceService,
    private _router: Router,
    private modalService: NgbModal,
    config: NgbModalConfig,
    public dialog: MatDialog,
    private modalReference: ModalServiceReference
  ) {
  }

  ngOnInit(): void {
    this.updateGreeting();
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
    const values = this.form.getRawValue();
    const body = {
      email: values.email,
      password: values.password
    };
    Swal.showLoading();
    this._userService.login(body).subscribe(
      (res: any) => {
        if (res.state == 1) {
          Swal.close();
          const userId = res.userId;
          localStorage.setItem('userId', userId);
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
  }

  open() {
    this.referenceModal = this.dialog.open(DialogDataExampleDialog, {
      data: {
        animal: 'panda',
      },
      height:'550px',
      width:'650px',
    })
    this.modalReference.setDialogRef(this.referenceModal);
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
    // Accede al dialogRef a través del servicio y cierra el diálogo
    const dialogRef = this.modalReference.getDialogRef();
    if (dialogRef) {
      dialogRef.close();
    }
  }
}
