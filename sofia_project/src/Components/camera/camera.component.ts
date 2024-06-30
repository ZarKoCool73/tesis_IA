import {AfterViewInit, Component, ElementRef, HostListener, Input, OnInit, ViewChild} from '@angular/core';
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
  @ViewChild('videoElement') videoElement!: ElementRef<HTMLVideoElement>;

  ngAfterViewInit(): void {
  }

  ngOnInit(): void {
    this.startCamera()
  }

  constructor() {
  }

  startCamera() {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({video: true})
        .then(stream => {
          this.videoElement.nativeElement.srcObject = stream;
          this.videoElement.nativeElement.play();
        })
        .catch(err => {
          console.error("Error accessing the camera: ", err);
        });
    } else {
      alert("Sorry, your browser does not support the camera access.");
    }
  }

  stopCamera() {
    let stream = this.videoElement.nativeElement.srcObject;
    if (stream) {
      if ("getTracks" in stream) {
        let tracks = stream.getTracks();
        tracks.forEach((track: any) => track.stop());
        this.videoElement.nativeElement.srcObject = null;
      }
    }
  }
}
