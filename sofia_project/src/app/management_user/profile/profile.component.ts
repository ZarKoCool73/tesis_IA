import {Component, OnInit} from '@angular/core';
import {UserServiceService} from "../../../services/user-service.service";
import {HttpErrorResponse} from "@angular/common/http";
import Swal from "sweetalert2";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  constructor(private _userService: UserServiceService) {
  }

  userProfile: any;

  ngOnInit(): void {
    const userId = localStorage.getItem('userId');
    this.loadDetail(userId)
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
}
