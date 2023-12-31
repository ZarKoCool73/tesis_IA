import {Component, ElementRef, Input, OnInit} from '@angular/core';
import {UserServiceService} from "../../../services/user-service.service";
import {HttpErrorResponse} from "@angular/common/http";
import Swal from "sweetalert2";
import {User} from "../../models/user";
import {ResourceServiceService} from "../../../services/resource-service.service";
import {EncryptionService} from "../../../services/encryption-service.service";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  userProfile: User;

  constructor(
    private _userService: UserServiceService,
    private el: ElementRef,
    private encryptionService: EncryptionService,
    private _resourceService: ResourceServiceService) {
    this.userProfile = new User('', '', '', '', '', '', '', '', '');

  }


  color = 'primary';
  mode = 'determinate';
  value = 50;

  /*COMUNICATION*/
  dataComunicationEnd: any
  dataComunicationInit: any

  /*COMPREHENSION*/
  dataComprehensionEnd: any
  dataComprehensionInit: any

  /*EXPRESSION*/
  dataExpressionEnd: any
  dataExpressionInit: any

  ngOnInit(): void {
    const userId = localStorage.getItem('userId');
    const idDecrypt = this.decrypt(userId)
    this.loadDetail(idDecrypt)
    this.loadDetailComprehension(idDecrypt)
    this.loadDetailExpression(idDecrypt)
    this.loadDetailComunication(idDecrypt)
  }

  loadDetail(id: any) {
    Swal.showLoading()
    this._userService.getUser(id).subscribe((res: any) => {
      if (res.state == 1) {
        this.userProfile = res.user
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

  loadDetailComprehension(id: any) {
    this._resourceService.getListComprehension().subscribe((res: any) => {
      if (res.state == 1) {
        console.log('loadDetailComprehension', res)
        this.dataComprehensionEnd = res.resources.length
        this._resourceService.getComprehensionsByIdUser(id).subscribe((res: any) => {
          if (res.state == 1) {
            this.dataComprehensionInit = (res.comprehensions || []).length
          }
        })
        const filteredResources = res.resources.filter((resource: any) => resource.state === '1');
        this.dataComprehensionInit = filteredResources.length
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

  loadDetailExpression(id: any) {
    this._resourceService.getListExpression().subscribe((res: any) => {
      if (res.state == 1) {
        console.log('loadDetailExpression', res)
        this.dataExpressionEnd = res.resources.length
        this._resourceService.getExpressionsByIdUser(id).subscribe((res: any) => {
          if (res.state == 1) {
            this.dataExpressionInit = (res.expressions || []).length
          }
        })
        const filteredResources = res.resources.filter((resource: any) => resource.state === '1');
        this.dataExpressionInit = filteredResources.length
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

  loadDetailComunication(id: any) {
    this._resourceService.getListComunication().subscribe((res: any) => {
      if (res.state == 1) {
        this.dataComunicationEnd = res.resources.length
        this._resourceService.getCommunicationsByIdUser(id).subscribe((res: any) => {
          if (res.state == 1) {
            this.dataComunicationInit = (res.communications || []).length
          }
        })
        const filteredResources = res.resources.filter((resource: any) => resource.state === '1');
        this.dataComunicationInit = filteredResources.length
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

  decrypt(id: any) {
    return this.encryptionService.decryptData(id);
  }
}
