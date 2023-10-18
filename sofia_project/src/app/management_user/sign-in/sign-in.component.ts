import {Component, OnInit, ViewChild, TemplateRef, Inject} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {UserServiceService} from 'src/services/user-service.service';
import {Router, RouterLink} from "@angular/router";
import {HttpErrorResponse} from "@angular/common/http";
import Swal from 'sweetalert2';
import {NgbModal, NgbModalConfig} from '@ng-bootstrap/ng-bootstrap';
import {MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import {NgForOf, NgIf} from "@angular/common";
import {MatButtonModule} from "@angular/material/button";
import {ModalServiceReference} from "../../../services/modal-reference.service";
import {MatFormFieldModule} from "@angular/material/form-field";
import {EncryptionService} from "../../../services/encryption-service.service";
import {EntityService} from "../../../services/entity.service";
import {UtilsService} from "../../../services/utils.service";

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
  providers: [NgbModalConfig, NgbModal],
  standalone: true,
  imports: [MatButtonModule, MatDialogModule, RouterLink, ReactiveFormsModule, NgIf, MatFormFieldModule],
})
export class SignInComponent implements OnInit {

  titleEntity: any
  stateEnti: any
  Entidad: any

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
    private _router: Router,
    private modalService: NgbModal,
    public dialog: MatDialog,
    private modalReference: ModalServiceReference,
    private encryptionService: EncryptionService,
    private _entityService: EntityService,
    private _utilsService: UtilsService
  ) {
  }

  ngOnInit(): void {
    this.updateGreeting();
    this.getEntityList()
    this.InitDatos()
  }

  InitDatos() {
    this._utilsService.data$.subscribe(data => {
      if (data) {
        this.Entidad = data.entity
        this.stateEnti = data.entity?.stateEntity || '0'
        if (this.stateEnti != '0') {
          this.titleEntity = data.entity.nameEntity
        } else {
          this.titleEntity = ''
        }
      }
    });
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
      const body = {
        email: values.email,
        password: values.password,
        id_School: this.Entidad.id_Entity
      };
      Swal.showLoading();
      this._userService.login(body).subscribe(
        (res: any) => {
          if (res.state == 1) {
            Swal.close();
            const userId = res.userId;
            console.log('USERID1', userId)
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

  openEntitys() {
    this.referenceModal = this.dialog.open(DialogDataModulosEntidad, {
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
    console.log('USERID2', encryptID)
    localStorage.setItem('userId', encryptID);
  }

  getEntityList() {
    this._entityService.getListEntity().subscribe((res: any) => {
      this.Entidad = res.entities
      const index = this.Entidad.findIndex((f: any) => f.stateEntity == '1')
      if (index == -1) {
        this.openEntitys()
      } else {
        this._utilsService.sendData({entity: this.Entidad[index]})
      }
    })
  }

  /*decrypt() {
    this.decryptedText = this.encryptionService.decryptData(this.encryptedText);
  }*/
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

@Component({
  selector: 'mat-dialog-content',
  templateUrl: 'modulosEntidad.html',
  standalone: true,
  imports: [MatDialogModule, NgIf, RouterLink, NgForOf],
})
export class DialogDataModulosEntidad {
  listEntity: any
  stateEntity: any

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: DialogDataModulosEntidad,
    private modalReference: ModalServiceReference,
    private _entityService: EntityService,
    private _utilsService: UtilsService
  ) {
  }


  ngOnInit() {
    this.getEntityList()
  }

  getEntityList() {
    this._entityService.getListEntity().subscribe((res: any) => {
      this.listEntity = res.entities
    })
  }

  obtenerData(data: any) {
    const idEntity = data
    console.log('asdasd', idEntity)
    Swal.fire({
      title: '<strong>¡Confirmación de Institución!</strong>',
      html: 'Antes de confirmar, asegúrate de que estás seleccionando' +
        ' de manera correcta la institución a la que perteneces. ¿Estás seguro de escoger la institución: <strong>' + idEntity.nameEntity + '</strong>  ?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#11e38a',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, estoy seguro',
      cancelButtonText: 'No, fue un error',
      allowOutsideClick: false // Evita que el modal se cierre haciendo clic fuera de él
    }).then((result: any) => {
      if (result.isConfirmed) {
        const id = data._id;
        let stateEntidad = ''
        if (data.nameEntity == 'COLEGIO MARISCAL RAMÓN CASTILLA N°1199') {
          stateEntidad = "1";
        }
        if (data.nameEntity == 'COLEGIO JOSÉ DE LA RIVA AGUERO Y OSMA') {
          stateEntidad = "1";
        }
        if (data.nameEntity == 'COLEGIO BRIGIDA SILVA DE OCHOA') {
          stateEntidad = "1";
        }
        if (data.nameEntity == 'COLEGIO MARIA INMACULADA') {
          stateEntidad = "1";
        }
        this._entityService.EntityState(id, stateEntidad).subscribe(
          (res: any) => {
            Swal.fire({
              icon: 'success',
              title: '¡Felicidades!',
              html: 'Has confirmado la selección de institución: <strong>' + idEntity.nameEntity + '</strong>.',
              confirmButtonColor: '#3085d6',
              confirmButtonText: 'Ok'
            }).then(() => {
              this._utilsService.sendData(res);
              this.close()
            });
          }, (error: HttpErrorResponse) => {
            console.error('Error en la solicitud:', error);
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: error.error.message,
              confirmButtonColor: '#ff3600',
            });
          }
        );
      }
    })
  }

  close() {
    const dialogRef = this.modalReference.getDialogRef();
    if (dialogRef) {
      dialogRef.close();
    }
  }
}
