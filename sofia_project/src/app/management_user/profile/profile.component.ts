import {Component, ElementRef, Input, OnInit} from '@angular/core';
import {UserServiceService} from "../../../services/user-service.service";
import {HttpErrorResponse} from "@angular/common/http";
import Swal from "sweetalert2";
import {User} from "../../models/user";
import {ResourceServiceService} from "../../../services/resource-service.service";
import {EncryptionService} from "../../../services/encryption-service.service";
import {ExpressionService} from "../../../services/expression.service";
import {ComprehensionService} from "../../../services/comprehension.service";
import {CommunicationService} from "../../../services/communication.service";

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
    private _resourceService: ResourceServiceService,
    private _expressionService: ExpressionService,
    private _comprehensionService: ComprehensionService,
    private _communicationService: CommunicationService,
  ) {
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
        this.userProfile = res.response
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
    this._comprehensionService.getListComprehension().subscribe((res: any) => {
      if (res.state == 1) {
        console.log('loadDetailComprehension', res)
        this.dataComprehensionEnd = res.response.length
        this._comprehensionService.getComprehensionsByIdUser(id).subscribe((res: any) => {
          console.log('res2', res)
          if (res.state == 1) {
            this.dataComprehensionInit = (res.response || []).length
          }
        })
        const filteredResources = res.response.filter((resource: any) => resource.state === '1');
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
    this._expressionService.getListExpression().subscribe((res: any) => {
      if (res.state == 1) {
        this.dataExpressionEnd = res.response.length
        this._expressionService.getExpressionsByIdUser(id).subscribe((res: any) => {
          console.log('data', res)
          if (res.state == 1) {
            this.dataExpressionInit = (res?.response || []).length
          }
        })
        const filteredResources = res.response.filter((resource: any) => resource.state === '1');
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
    this._communicationService.getListComunication().subscribe((res: any) => {
      if (res.state == 1) {
        this.dataComunicationEnd = res.response.length
        this._communicationService.getCommunicationsByIdUser(id).subscribe((res: any) => {
          if (res.state == 1) {
            this.dataComunicationInit = (res?.response || []).length
          }
        })
        const filteredResources = res.response.filter((resource: any) => resource.state === '1');
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
