import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import {IaService} from "../../services/ia.service";
import Swal from "sweetalert2";
import {HttpErrorResponse} from "@angular/common/http";

@Component({
  selector: 'app-camera',
  templateUrl: './camera.component.html',
  styleUrls: ['./camera.component.scss']
})
export class CameraComponent implements OnInit, AfterViewInit {

  @Input() dataCollection: any[] = []
  @Input() typeLetter: any[] = []
  @Output() isView = new EventEmitter<boolean>()
  @ViewChild('localVideo') localVideo!: ElementRef<HTMLVideoElement>;
  @ViewChild('canvas') canvas!: ElementRef<HTMLCanvasElement>;
  title = '';

  ngAfterViewInit(): void {
    this.setupWebRTC();
    this.updateTitle();
  }

  ngOnInit(): void {
    console.log('this.da', this.dataCollection);
    //this.startCamera()
    this.setupWebRTC();
  }

  constructor(
    private readonly iaService: IaService
  ) {
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
    if (window.location.href.includes('expression')) {
      this.title = 'Módulo de expresión';
    } else {
      this.title = 'Módulo de comprensión';
    }
  }

  setupWebRTC() {
    navigator.mediaDevices.getUserMedia({video: true, audio: false})
      .then(stream => {
        this.localVideo.nativeElement.srcObject = stream;
      })
      .catch(error => {
        console.error('Error en la configuración de WebRTC:', error);
      });
  }

  captureAndProcessImage() {
    const video = this.localVideo.nativeElement;
    const canvas = this.canvas.nativeElement;
    const context = canvas.getContext('2d')!;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    const imgData = canvas.toDataURL('image/jpeg');
    const expressions = this.typeLetter[0].name;
    Swal.showLoading()
    this.iaService.processImage(imgData, expressions)
      .subscribe({
        next: (data: any) => {
          Swal.close()
          const accuracyPercentage = data.accuracy ? `${data.accuracy.toFixed(2)}%` : '';
          Swal.fire({
            title: '<strong>¡Resultado de seña!</strong>',
            html: 'Precisión: <strong>' + accuracyPercentage + '</strong> ' +
              'Seña: <strong>' + expressions + '</strong>',
            icon: 'success',
            showCancelButton: false,
            confirmButtonColor: '#11e38a',
            confirmButtonText: 'Cerrar',
            allowOutsideClick: false // Evita que el modal se cierre haciendo clic fuera de él
          })
        },
        error: (error: HttpErrorResponse) => {
          Swal.close()
          if (error.status === 400) {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              html: '<strong>' + error.error['error'] + '</strong><br>' +
                'Precisión: <strong>' + error.error['accuracy'] + '</strong><br>' +
                'Seña: <strong>' + error.error['sign'] + '</strong>',
              confirmButtonColor: '#ff3600',
            });
          }
          if (error.status === 500) {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: error.error.message,
              confirmButtonColor: '#ff3600',
            });
          }
        }
      })
  }

  return() {
    this.isView.emit(false)
  }
}
