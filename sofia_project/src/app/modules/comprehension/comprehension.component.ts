import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {HttpErrorResponse} from "@angular/common/http";
import Swal from "sweetalert2";
import {ResourceServiceService} from "../../../services/resource-service.service";

@Component({
  selector: 'app-comprehension',
  templateUrl: './comprehension.component.html',
  styleUrls: ['./comprehension.component.scss']
})
export class ComprehensionComponent implements OnInit {

  categoryComprehension: any;
  category = 'comprehension'
  url = {
    question: 'Preguntas',
    verbs: 'Verbos',
    adjetives: 'Adjetivos',
    utensils: 'Artículos del hogar'
  }
  link = ''

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _servicesResource: ResourceServiceService) {

  }

  ngOnInit(): void {
    this._activatedRoute.params.subscribe((params: any) => {
      switch (params.type) {
        case 'question':
          this.link = 'Preguntas';
          this.loadDetail('question')
          break;
        case  'verbs':
          this.link = 'Verbos';
          this.loadDetail('verbs')
          break;
        case   'adjetives':
          this.link = 'Adjetivos';
          this.loadDetail('adjetives')
          break;
        case  'utensils':
          this.link = 'Artículos del hogar';
          this.loadDetail('utensils')
          break;
      }
    })
  }

  loadDetail(id: any) {
    this._servicesResource.getCategory(id).subscribe((res: any) => {
      if (res.state == 1) {
        console.log('res', res)
        this.categoryComprehension = res.resources
      }
    }, (error: HttpErrorResponse) => {
      Swal.close();
      if (error.error.state == 0) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.error.message,
          confirmButtonColor: '#ff3600',
        });
      }
    })
  }
}
