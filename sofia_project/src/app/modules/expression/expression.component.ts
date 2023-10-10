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
  fullPath: any;
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
    Swal.showLoading();
    this._servicesResource.getCategory(id).subscribe((res: any) => {
      if (res.state == 1) {
        console.log('res', res)
        this.categoryExpression = res.resources
        Swal.close();
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

  activeProgress(data: any): void {
    const id = data._id
    const state = "1"
    Swal.fire({
      title: '¿Estás seguro?',
      text: '¿Quieres actualizar el estado?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, actualizar'
    }).then((result: any) => {
      if (result.isConfirmed) {
        this._servicesResource.refreshState(id, state).subscribe(
          response => {
            console.log('Respuesta del servidor:', response);
            this.loadDetail(data.category)
            return Swal.fire({
              icon: 'success',
              title: 'Éxito',
              text: 'Estado de la imagen actualizado exitosamente',
              confirmButtonColor: '#3085d6',
              confirmButtonText: 'Ok'
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
}
