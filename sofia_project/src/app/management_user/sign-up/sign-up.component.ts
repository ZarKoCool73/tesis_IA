import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {map, Observable, startWith} from "rxjs";
import {UtilsService} from "../../../services/utils.service";
import {UserServiceService} from "../../../services/user-service.service";
import {Router} from '@angular/router';

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

  constructor(private _utils: UtilsService,
              private _router: Router,
              private _userService: UserServiceService) {
  }

  bandera = false
  message = '';

  ngOnInit() {
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map((value: any) => this._filter(value))
    );
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter(option => option.toLowerCase().indexOf(filterValue) === 0);
  }

  createAccount() {
    const firstValues = this.firstFormGroup.getRawValue()
    const secondValues = this.secondFormGroup.getRawValue()
    const thirdValues = this.thirdFormGroup.getRawValue()
    const body = {
      name: firstValues.names,
      lastname: firstValues.lastname,
      age: firstValues.age,
      email: secondValues.email,
      studentCode: firstValues.code,
      firstQuestion: thirdValues.fquestion,
      secondQuestion: thirdValues.squestion,
      thirdQuestion: thirdValues.tquestion,
      password: secondValues.password
    }

    this._userService.saveUser(body).subscribe((res: any) => {
      this._router.navigate(['/account'])
    }, error => {

    })
  }

  // @ts-ignore
  onInputNumbers(event: any): void {
    event.target.value = event.target.value.replace(/\D/g, ''); // Elimina caracteres no numéricos
  }

  // @ts-ignore
  onInputLetters(event: any): void {
    event.target.value = event.target.value.replace(/[^a-zA-Z]/g, ''); // Elimina caracteres no alfabéticos
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
}
