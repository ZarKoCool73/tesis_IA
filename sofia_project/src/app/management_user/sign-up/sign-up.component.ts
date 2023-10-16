import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {map, Observable, startWith} from "rxjs";
import {UtilsService} from "../../../services/utils.service";
import {UserServiceService} from "../../../services/user-service.service";
import {Router} from '@angular/router';
import Swal from "sweetalert2";
import {HttpErrorResponse} from "@angular/common/http";
import {EntityService} from "../../../services/entity.service";

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {
  firstFormGroup = new FormGroup({
    code: new FormControl('', [Validators.required]),
    names: new FormControl('', Validators.required),
    lastname: new FormControl('', Validators.required),
    age: new FormControl('', Validators.required),
    id_School: new FormControl('', Validators.required),
  })
  secondFormGroup = new FormGroup({
    email: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
    repeated_password: new FormControl('', Validators.required),
  }, this._utils.repeatedPassword)
  thirdFormGroup = new FormGroup({
    fquestion: new FormControl('', Validators.required),
    squestion: new FormControl('', Validators.required),
    tquestion: new FormControl('', Validators.required),

  })
  myControl = new FormControl();
  options: string[] = ['One', 'Two', 'Three'];
  filteredOptions: Observable<string[]> | undefined;
  esCorreoValido = false;

  constructor(private _utils: UtilsService,
              private _router: Router,
              private _utilsService: UtilsService,
              private _entityService: EntityService,
              private _userService: UserServiceService) {
  }

  bandera = false
  banderaEmail = false
  banderaCode = false
  message = '';
  listSchool: any
  id_school: any

  Entidad: any
  titleEntity: any
  stateEnti: any

  ngOnInit() {
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map((value: any) => this._filter(value))
    );
    this.getEntityList()
    this.InitDatos()
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter(option => option.toLowerCase().indexOf(filterValue) === 0);
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

  /*getEntityList() {
    this._entityService.getListEntity().subscribe((res: any) => {
      console.log('res', res.entities)
      this.listSchool = res.entities
    })
  }*/
  getEntityList() {
    this._entityService.getListEntity().subscribe((res: any) => {
      //this.listSchool = res.entities
      this.Entidad = res.entities
      const index = this.Entidad.findIndex((f: any) => f.stateEntity == '1')
      if (index !== -1) {
        this._utilsService.sendData({entity: this.Entidad[index]})
      }
    })
  }

  onSchoolSelectionChange(event: any) {
    this.id_school = event.value; // Obtener el ID seleccionado
    console.log('ID del colegio seleccionado:', this.id_school);
  }

  createAccount() {
    debugger
    const firstValues = this.firstFormGroup.getRawValue()
    const secondValues = this.secondFormGroup.getRawValue()
    const thirdValues = this.thirdFormGroup.getRawValue()
    const body = {
      name: firstValues.names,
      lastname: firstValues.lastname,
      age: firstValues.age,
      id_School: firstValues.id_School,
      email: secondValues.email,
      studentCode: firstValues.code,
      firstQuestion: thirdValues.fquestion,
      secondQuestion: thirdValues.squestion,
      thirdQuestion: thirdValues.tquestion,
      password: secondValues.password
    }
    console.log('body', body)
    Swal.showLoading();
    if (this.banderaCode && this.bandera && this.banderaEmail) {
      this._userService.saveUser(body).subscribe((res: any) => {
        Swal.close();
        Swal.fire({
          icon: 'success',
          title: 'Éxito',
          text: 'Su cuenta sea creado exitosamente',
          confirmButtonColor: '#11e38a'
        }).then((result) => {
          if (result.isConfirmed) {
            this._router.navigate(['/account']);
          }
        });
      }, (error: HttpErrorResponse) => {
        Swal.close();
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.error.message,
          confirmButtonColor: '#ff3600',
        });
      })
    } else {
      Swal.close();
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Completar de manera correcta los datos',
        confirmButtonColor: '#ff3600',
      });
    }
  }

  // @ts-ignore
  onInputNumbers(event: any): void {
    const inputValue = event.target.value;
    const numericValue = inputValue.replace(/\D/g, ''); // Elimina caracteres no numéricos
    if (inputValue !== numericValue) {
      event.preventDefault(); // Evita que se ingresen caracteres no numéricos
      event.target.value = numericValue; // Actualiza el valor del campo solo si ha habido cambios
    }
    if (numericValue.length < 8) {
      this.banderaCode = false
    } else {
      this.banderaCode = true
    }
  }

  onInputNumbersAge(event: any): void {
    const inputValue = event.target.value;
    const numericValue = inputValue.replace(/\D/g, ''); // Elimina caracteres no numéricos
    if (inputValue !== numericValue) {
      event.preventDefault(); // Evita que se ingresen caracteres no numéricos
      event.target.value = numericValue; // Actualiza el valor del campo solo si ha habido cambios
    }
  }

  // @ts-ignore
  onInputLetters(event: any): void {
    event.target.value = event.target.value.replace(/[^a-zA-Z\s]/g, ''); // Elimina caracteres no alfabéticos ni espacios
  }

  validarContrasenaFuerte(contrasena: any): { valido: boolean, mensaje: string } {
    console.log('con', contrasena);
    let mensaje = '';
    let valido = true;
    if (contrasena.length < 8) {
      mensaje = 'La contraseña debe tener al menos 8 caracteres de longitud.';
      valido = false;
    } else if (!/[A-Z]/.test(contrasena) || !/[a-z]/.test(contrasena) || !/\d/.test(contrasena)) {
      mensaje = 'La contraseña debe contener al menos una letra mayúscula, una letra minúscula y un dígito.';
      valido = false;
    } else {
      console.log('ab', contrasena);
      this.bandera = true; // Contraseña fuerte
    }
    return {valido, mensaje};
  }

  validatePassword() {
    const resultado = this.validarContrasenaFuerte(this.secondFormGroup.value.password);
    this.bandera = resultado.valido;
    this.message = resultado.mensaje; // Establece el mensaje de validación en la variable message.
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
    const resultado = this.verifyEmail(this.secondFormGroup.value.email);
    this.banderaEmail = resultado;
  }
}
