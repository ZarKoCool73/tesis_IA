import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {map, Observable, startWith} from "rxjs";
import {UtilsService} from "../../../services/utils.service";
import {UserServiceService} from "../../../services/user-service.service";
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {
  firstFormGroup = new FormGroup({
    code: new FormControl('', Validators.required),
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
}
