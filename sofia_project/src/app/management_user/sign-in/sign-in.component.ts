import {Component, OnInit, ViewChild, TemplateRef} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {UserServiceService} from 'src/services/user-service.service';
import {Router} from "@angular/router";
import {HttpErrorResponse} from "@angular/common/http";
import Swal from 'sweetalert2';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit {
  msg = 'Buenos días';
  form = new FormGroup({
    email: new FormControl(),
    password: new FormControl()
  });

  constructor(
    private _userService: UserServiceService,
    private _router: Router,
    private modalService: NgbModal,
  ) {
  }

  ngOnInit(): void {
    this.updateGreeting();
  }

  updateGreeting() {
    const now = new Date();
    const hour = now.getHours();

    if (hour >= 5 && hour < 12) {
      this.msg = 'Buenos días';
    } else if (hour >= 12 && hour < 18) {
      this.msg = 'Buenas tardes';
    } else {
      this.msg = 'Buenas noches';
    }
  }

  login(popContent: any) {
    const values = this.form.getRawValue();
    const body = {
      email: values.email,
      password: values.password
    };
    Swal.showLoading();
    this._userService.login(body).subscribe(
      (res: any) => {
        if (res.state == 1) {
          Swal.close();
          const userId = res.userId;
          localStorage.setItem('userId', userId);
          this.toggleWithGreeting(popContent, 'data', 'data')
        }
      },
      (error: HttpErrorResponse) => {
        Swal.close();
        if (error.error.state == 0) {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.error.message,
            confirmButtonColor: '#ff3600',
          });
        }
      }
    );
  }

  toggleWithGreeting(popover: any, greeting: string, language: string) {
    if (popover.isOpen()) {
      popover.close();
    } else {
      popover.open({greeting, language});
    }
  }
}
