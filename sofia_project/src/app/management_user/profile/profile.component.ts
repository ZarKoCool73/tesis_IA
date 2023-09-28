import {Component, OnInit} from '@angular/core';
import {UserServiceService} from "../../../services/user-service.service";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  constructor(private _userService: UserServiceService) {
  }

  ngOnInit(): void {
    const id = '65148ba39c1c1f4df19118a7'
    this.loadDetail(id)
  }

  loadDetail(id: string) {
    this._userService.getUser(id).subscribe({
      next: (res: any) => {

      }, error: () => {}
    })
  }
}
