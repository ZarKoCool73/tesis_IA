import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {HttpErrorResponse} from "@angular/common/http";
import Swal from "sweetalert2";
import {ResourceServiceService} from "../../../services/resource-service.service";
import {EncryptionService} from "../../../services/encryption-service.service";
import {CommunicationService} from "../../../services/communication.service";

@Component({
  selector: 'app-comunication',
  templateUrl: './comunication.component.html',
  styleUrls: ['./comunication.component.scss']
})
export class ComunicationComponent implements OnInit {

  categoryComunication: any;
  link = ''
  nameList: any
  IdUser: any

  constructor(
    private _activatedRoute: ActivatedRoute,
    private encryptionService: EncryptionService,
    private _servicesResource: ResourceServiceService,
    private _communicationService: CommunicationService,
  ) {

  }

  text: string = 'fa-regular fa-circle-check fa-xl gray-icon';
  isActive = false

  ngOnInit(): void {
    const iduser = localStorage.getItem('userId');
    this.IdUser = this.decrypt(iduser)

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
    if (!localStorage.getItem('infoShowed')) {
      this.openInfo()
    }
  }

  loadDetail(id: any) {
    this._servicesResource.getCategory(id).subscribe((res: any) => {
      if (res.state == 1) {
        this.categoryComunication = res.resources
        this.categoryComunication = this.categoryComunication.map((c: any) => ({...c, state: '0'}))
        this.loadCommunicationProgress()
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
        this._communicationService.addCommunication(this.IdUser, idResource, state).subscribe(
          response => {
            Swal.fire({
              icon: 'success',
              title: '¡Felicidades!',
              html: 'Has confirmado tu aprendizaje de la seña: <strong>' + this.nameList + '</strong>. Sigue practicando y mejorando tus habilidades.',
              confirmButtonColor: '#3085d6',
              confirmButtonText: 'Ok'
            }).then(() => {
              this.loadDetail(data.category)
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

  loadCommunicationProgress() {
    this._communicationService.getCommunicationsByIdUser(this.IdUser).subscribe((res: any) => {
      if (res.state == 1) {
        const ids = (res?.response || []).map((c: any) => c.id_Resource)
        this.categoryComunication = this.categoryComunication.map((c: any) => ({
          ...c,
          state: ids.includes(c._id) ? '1' : '0'
        }))
      }
    })
  }

  openInfo() {
    Swal.fire({
      icon: 'info',
      title: 'Créditos',
      showCloseButton: true,
      width: '1100px',
      confirmButtonColor: '#11e38a',
      html: `<div class="creditos">
    <p>Este sistema utiliza información sobre el lenguaje de señas proporcionada por el Gobierno del Perú.</p>

    <div class="container text-center">
    <div class="creditos-seccion">
        <strong>Créditos:</strong>
        <p>Información sobre el lenguaje de señas: Gobierno del Perú</p>
        <ul class="list-inline">
            <li class="list-inline-item"><a href="https://lc.cx/OYmoMx" target="_blank" class="custom-tooltip" title="Lengua de Señas Peruana">Lengua de Señas Peruana</a></li>
            <li class="list-inline-item"><a href="https://lc.cx/VnoLQt" target="_blank" class="custom-tooltip" title="Asociación de Sordos de Lima">Asociación de Sordos de Lima</a></li>
            <li class="list-inline-item"><a href="https://lc.cx/t5pkOB" target="_blank" class="custom-tooltip" title="Gerencia de Desarrollo Humano MML">Gerencia de Desarrollo Humano MML</a></li>
        </ul>
    </div>
</div>
    <div class="creditos-seccion">
        <strong>Derechos de autor y uso:</strong>
        <p>
            Este sistema web de aprendizaje de lenguaje de señas utiliza un dataset de gestos que ha sido creado por nuestro <strong>propio equipo.</strong>
            <br>
            Este sistema web de aprendizaje de lenguaje de señas utiliza el libro "Lenguaje de señas peruana: vocabulario básico" del Ministerio de Educación de Perú, disponible en <a href="https://repositorio.minedu.gob.pe/handle/20.500.12799/5545"
             target="_blank">Repositorio del Ministerio de Educación de Perú</a>. El libro está licenciado bajo la licencia Creative Commons
             Reconocimiento-NoComercial-SinObraDerivada 4.0 Internacional (CC BY-NC-ND 4.0). El autor original del libro es el Ministerio de Educación de Perú,
             y el libro fue publicado en 2023.
        </p>
    </div>
    <p class="agradecimiento">
        <strong>Agradecemos al Gobierno del Perú por proporcionar valiosa información que ha hecho posible el desarrollo de este sistema.</strong>
    </p>
</div>`,
      /*footer: '<a href="#">¿Por qué tengo este problema?</a>',*/
    }).then(() => {
      localStorage.setItem('infoShowed', '1')
    });
  }

  decrypt(id: any) {
    return this.encryptionService.decryptData(id);
  }
}
