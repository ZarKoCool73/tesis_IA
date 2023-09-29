import { Component, OnInit } from '@angular/core';
import {FormGroup} from "@angular/forms";

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {
  firstFormGroup = new FormGroup({})
  secondFormGroup = new FormGroup({})
  constructor() { }

  ngOnInit(): void {
    console.log('h')
  }

}
