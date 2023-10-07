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

  activeProgress(): void {
    this.isActive = !this.isActive; // Cambia el estado de isActive al hacer clic en el ícono
  }
}
