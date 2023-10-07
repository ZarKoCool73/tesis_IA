import {Component, OnInit} from '@angular/core';
import {UserServiceService} from "../../../services/user-service.service";
import {HttpErrorResponse} from "@angular/common/http";
import Swal from "sweetalert2";
import {User} from "../../models/user";
import {ResourceServiceService} from "../../../services/resource-service.service";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  userProfile: User;

  constructor(
    private _userService: UserServiceService,
    private _resourceService: ResourceServiceService) {
    this.userProfile = new User('', '', '', '', '', '', '', '', '');

  }


  ngOnInit(): void {
    const userId = localStorage.getItem('userId');
    this.loadDetail(userId)
    this.loadDetailComprehension()
    this.loadDetailExpression()
    this.loadDetailComunication()
  }

  loadDetail(id: any) {
    this._userService.getUser(id).subscribe((res: any) => {
      if (res.state == 1) {
        this.userProfile = res.user
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

  loadDetailComprehension() {
    this._resourceService.getListComprehension().subscribe((res: any) => {
      if (res.state == 1) {
        console.log('loadDetailComprehension', res)
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

  loadDetailExpression() {
    this._resourceService.getListExpression().subscribe((res: any) => {
      if (res.state == 1) {
        console.log('loadDetailExpression', res)
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

  loadDetailComunication() {
    this._resourceService.getListComunication().subscribe((res: any) => {
      if (res.state == 1) {
        console.log('loadDetailComunication', res)
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
