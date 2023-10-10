import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {HttpErrorResponse} from "@angular/common/http";
import Swal from "sweetalert2";
import {ResourceServiceService} from "../../../services/resource-service.service";

@Component({
  selector: 'app-comunication',
  templateUrl: './comunication.component.html',
  styleUrls: ['./comunication.component.scss']
})
export class ComunicationComponent implements OnInit {

  categoryComunication: any;
  link = ''

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _servicesResource: ResourceServiceService) {

  }

  text: string = 'fa-regular fa-circle-check fa-xl gray-icon';
  isActive = false

  ngOnInit(): void {
    this._activatedRoute.params.subscribe((params: any) => {
      switch (params.type) {
        case 'adverb':
          this.link = 'Adverbios';
          this.loadDetail('adverb')
          break;
        case  'preposition':
          this.link = 'Preposiciones';
          this.loadDetail('preposition')
          break;
      }
    })
  }

  loadDetail(id: any) {
    Swal.showLoading()
    this._servicesResource.getCategory(id).subscribe((res: any) => {
      if (res.state == 1) {
        console.log('res', res)
        this.categoryComunication = res.resources
        Swal.close()
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
