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
  nameList: any

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
    this._servicesResource.getCategory(id).subscribe((res: any) => {
      if (res.state == 1) {
        console.log('res', res)
        this.categoryComunication = res.resources
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
    this.nameList = data.name;
    const id = data._id;
    const state = "1";
    Swal.fire({
      title: '<strong>¡Confirmación de Aprendizaje!</strong>',
      html: 'Antes de confirmar, asegúrate de que te sientes cómodo y seguro ' +
        'con la seña que has aprendido. ¿Estás seguro de que has dominado la seña: <strong>' + this.nameList + '</strong>?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#11e38a',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, estoy seguro',
      cancelButtonText: 'Aún necesito practicar',
      allowOutsideClick: false // Evita que el modal se cierre haciendo clic fuera de él
    }).then((result: any) => {
      if (result.isConfirmed) {
        this._servicesResource.refreshState(id, state).subscribe(
          response => {
            console.log('Respuesta del servidor:', response);
            this.loadDetail(data.category)
            return Swal.fire({
              icon: 'success',
              title: '¡Felicidades!',
              html: 'Has confirmado tu aprendizaje de la seña: <strong>' + this.nameList + '</strong>. Sigue practicando y mejorando tus habilidades.',
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
