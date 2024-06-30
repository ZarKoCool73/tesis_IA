import {AfterViewInit, Component, HostListener, Input, OnInit} from '@angular/core';
import {HttpErrorResponse} from '@angular/common/http';
import {Router} from "@angular/router";
import {UserServiceService} from "../../services/user-service.service";
import Swal from "sweetalert2";
import {User} from 'src/app/models/user';
import {EncryptionService} from "../../services/encryption-service.service";
import {EntityService} from "../../services/entity.service";

@Component({
  selector: 'app-camera',
  templateUrl: './camera.component.html',
  styleUrls: ['./camera.component.scss']
})
export class CameraComponent implements OnInit, AfterViewInit {

  @Input() dataCollection: any[] = []

  ngAfterViewInit(): void {
  }

  ngOnInit(): void {
  }

  constructor() {
  }
}
