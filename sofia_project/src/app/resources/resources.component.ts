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
    if (!localStorage.getItem('infoShowed')) {
      this.openInfo()
    }
  }

  loadDetail(id: any) {
    this._servicesResource.getCategory(id).subscribe((res: any) => {
      if (res.state == 1) {
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
            Este sistema web de aprendizaje de lenguaje de señas utiliza el dataset de gestos de lenguaje de señas de <strong>Torres Rojas, Javier Je-Hu</strong>.
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
}
