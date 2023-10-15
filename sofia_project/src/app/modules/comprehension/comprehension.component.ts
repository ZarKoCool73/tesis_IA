import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {HttpErrorResponse} from "@angular/common/http";
import Swal from "sweetalert2";
import {ResourceServiceService} from "../../../services/resource-service.service";
import {EncryptionService} from "../../../services/encryption-service.service";

@Component({
  selector: 'app-comprehension',
  templateUrl: './comprehension.component.html',
  styleUrls: ['./comprehension.component.scss']
})
export class ComprehensionComponent implements OnInit {

  categoryComprehension: any;
  category = 'comprehension'
  nameList: any
  IdUser: any
  url = {
    question: 'Preguntas',
    verbs: 'Verbos',
    adjetives: 'Adjetivos',
    utensils: 'Artículos del hogar'
  }
  link = ''

  constructor(
    private _activatedRoute: ActivatedRoute,
    private encryptionService: EncryptionService,
    private _servicesResource: ResourceServiceService) {

  }

  ngOnInit(): void {
    const iduser = localStorage.getItem('userId');
    this.IdUser = this.decrypt(iduser)
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
    this.openInfo()
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

  activeProgress(data: any): void {
    this.nameList = data.name;
    const idResource = data._id;
    const state = "1";
    Swal.fire({
      title: '<strong>¡Confirmación de Aprendizaje!</strong>',
      html: 'Antes de confirmar, asegúrate de que te sientes cómodo y seguro ' +
        'con la seña que has aprendido. ¿Estás seguro de que has dominado la seña: <strong>' + this.nameList + '</strong>  ?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#11e38a',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, estoy seguro',
      cancelButtonText: 'Aún necesito practicar',
      allowOutsideClick: false // Evita que el modal se cierre haciendo clic fuera de él
    }).then((result: any) => {
      if (result.isConfirmed) {
        this._servicesResource.addComprehension(this.IdUser, idResource, state).subscribe(
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

  openInfo() {
    Swal.fire({
      icon: 'info',
      title: 'Créditos',
      width: '600px',
      confirmButtonColor: '#11e38a',
      html: `
        Este sistema utiliza información sobre el lenguaje de señas proporcionada por el Gobierno del Perú.<br><br>

        <strong>Créditos:</strong><br>
        - Información sobre el lenguaje de señas: Gobierno del Perú<br>
        - <a href="https://repositorio.minedu.gob.pe/handle/20.500.12799/5545" target="_blank" class="custom-tooltip" aria-label="" title="https://repositorio.minedu.gob.pe/handle/20.500.12799/5545">Lengua de Señas Peruana</a><br><br>

        <strong>Derechos de autor y uso:</strong><br>
        [Incluye aquí cualquier información relevante sobre los derechos de autor y el uso de la información proporcionada por el Gobierno del Perú, como licencias específicas, términos de uso, etc.]<br><br>

        <strong>Agradecemos al Gobierno del Perú por proporcionar valiosa información que ha hecho posible el desarrollo de este sistema.</strong>`,
      /*footer: '<a href="#">¿Por qué tengo este problema?</a>',*/
    });
  }

  decrypt(id: any) {
    return this.encryptionService.decryptData(id);
  }
}
