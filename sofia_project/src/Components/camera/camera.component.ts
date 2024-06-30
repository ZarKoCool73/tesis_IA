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
  //@ViewChild('videoElement') videoElement!: ElementRef<HTMLVideoElement>;

  @ViewChild('localVideo') localVideo!: ElementRef<HTMLVideoElement>;
  @ViewChild('canvas') canvas!: ElementRef<HTMLCanvasElement>;

  title = '';
  resultTitle = '';
  resultContent = '';
  resultAccuracy = '';

  ngAfterViewInit(): void {
    this.setupWebRTC();
    this.updateTitle();
  }

  ngOnInit(): void {
    //this.startCamera()
  }

  constructor() {
  }

  /*startCamera() {
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
  }*/

  updateTitle() {
    if (window.location.href.includes('expressions')) {
      this.title = 'Módulo de expresión';
    } else {
      this.title = 'Módulo de comprensión';
    }
  }

  async setupWebRTC() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({video: true, audio: false});
      this.localVideo.nativeElement.srcObject = stream;
    } catch (error) {
      console.error('Error en la configuración de WebRTC:', error);
      Swal.fire('Error', 'No se pudo acceder a la cámara', 'error');
    }
  }

  captureAndProcessImage() {
    const canvas = this.canvas.nativeElement;
    const context = canvas.getContext('2d');
    canvas.width = this.localVideo.nativeElement.videoWidth;
    canvas.height = this.localVideo.nativeElement.videoHeight;
    // @ts-ignore
    context.drawImage(this.localVideo.nativeElement, 0, 0, canvas.width, canvas.height);

    const imgData = canvas.toDataURL('image/jpeg');
    const expressions = window.location.href.includes('expressions');

    fetch('http://services-ia.onrender.com/expressions?camera_id=8', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        imageData: imgData,
        Expressions: expressions
      })
    }).then(res => res.json().then(data => {
      if (!res.ok) {
        throw new Error(data.error || 'Network response was not ok');
      }
      return data;
    })).then(data => {
      const accuracyPercentage = data.accuracy ? `Precisión: ${data.accuracy.toFixed(2)}%` : '';
      if (data.accuracy > 60) {
        this.resultTitle = 'Interpretación del signo';
        this.resultContent = `${data.sign}`;
        this.resultAccuracy = accuracyPercentage;
      }
    }).catch(error => {
      console.log('error', error);
      this.resultTitle = 'Interpretación del signo';
      this.resultContent = '-';
      this.resultAccuracy = `${error.message}`;
    });
  }
}
