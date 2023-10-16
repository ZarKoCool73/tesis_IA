import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {HttpErrorResponse} from "@angular/common/http";
import Swal from "sweetalert2";
import {ResourceServiceService} from "../../services/resource-service.service";

@Component({
  selector: 'app-resources',
  templateUrl: './resources.component.html',
  styleUrls: ['./resources.component.scss']
})
export class ResourcesComponent implements OnInit {

  link = ''
  category: any

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _servicesResource: ResourceServiceService
  ) {

  }

  ngOnInit(): void {
    this._activatedRoute.params.subscribe((params: any) => {
      switch (params.type) {
        case 'books':
          this.loadDetail('books')
          this.link = 'Libros';
          break;
        case  'web':
          this.link = 'Páginas web y apps';
          this.loadDetail('web')
          break;
      }
    })
    this.openInfo()
  }

  loadDetail(id: any) {
    this._servicesResource.getCategory(id).subscribe((res: any) => {
      console.log('res', res)
      if (res.state == 1) {
        console.log('res', res)
        this.category = res.resources
      }
    }, (error: HttpErrorResponse) => {
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
        - <a href="https://repositorio.minedu.gob.pe/handle/20.500.12799/5545" target="_blank" class="custom-tooltip" aria-label="" title="https://lc.cx/OYmoMx">Lengua de Señas Peruana</a><br>
        - <a href="https://www.slideshare.net/assoliperu?utm_campaign=profiletracking&utm_medium=sssite&utm_source=ssslideview" target="_blank" class="custom-tooltip" aria-label=""
        title="https://lc.cx/VnoLQt">Asociacion de Sordos de Lima</a><br>
        - <a href="https://www.youtube.com/@GerenciaDeDesarrolloHumanoMML" target="_blank" class="custom-tooltip" aria-label=""
        title="https://lc.cx/t5pkOB">Gerencia de Desarrollo Humano MML</a><br><br>
        <strong>Derechos de autor y uso:</strong><br>
        [Incluye aquí cualquier información relevante sobre los derechos de autor y el uso de la información proporcionada por el Gobierno del Perú, como licencias específicas, términos de uso, etc.]<br><br>

        <strong>Agradecemos al Gobierno del Perú por proporcionar valiosa información que ha hecho posible el desarrollo de este sistema.</strong>`,
      /*footer: '<a href="#">¿Por qué tengo este problema?</a>',*/
    });
  }
}
