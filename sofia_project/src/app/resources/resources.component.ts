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
  }

  loadDetail(id: any) {
    Swal.showLoading()
    this._servicesResource.getCategory(id).subscribe((res: any) => {
      console.log('res', res)
      if (res.state == 1) {
        console.log('res', res)
        this.category = res.resources
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
}
