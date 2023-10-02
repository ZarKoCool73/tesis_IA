import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {HttpErrorResponse} from "@angular/common/http";
import Swal from "sweetalert2";
import {ResourceServiceService} from "../../../services/resource-service.service";

@Component({
  selector: 'app-expression',
  templateUrl: './expression.component.html',
  styleUrls: ['./expression.component.scss']
})
export class ExpressionComponent implements OnInit {

  link = ''
  categoryExpression: any;
  category = 'expression'

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _servicesResource: ResourceServiceService) {

  }

  ngOnInit(): void {
    this._activatedRoute.params.subscribe((params: any) => {
      switch (params.type) {
        case 'abc':
          this.link = 'Abecedario';
          this.loadDetail('abc')
          break;
        case  'common-expressions':
          this.link = 'Expresiones comunes';
          this.loadDetail('common-expressions')
          break;
        case   'numbers':
          this.link = 'Números';
          this.loadDetail('numbers')
          break;
        case  'colors':
          this.link = 'Colores';
          this.loadDetail('colors')
          break;
      }
    })
  }

  loadDetail(id: any) {
    this._servicesResource.getCategory(id).subscribe((res: any) => {
      if (res.state == 1) {
        console.log('res', res)
        this.categoryExpression = res.resources
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
