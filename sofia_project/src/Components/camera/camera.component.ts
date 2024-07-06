import {
  Component,
  ElementRef,
  EventEmitter,
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
export class CameraComponent implements OnInit {

  @Input() dataCollection: any[] = []
  @Input() typeLetter: any[] = []
  @Output() isView = new EventEmitter<boolean>()
  @ViewChild('localVideo') localVideo!: ElementRef<HTMLVideoElement>;
  @ViewChild('canvas') canvas!: ElementRef<HTMLCanvasElement>;

  title = '';

  ngOnInit(): void {
    this.loadModel(this.typeLetter[0].name)
    this.setupWebRTC();
  }

  constructor(
    private readonly iaService: IaService
  ) {
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

  loadModel(signType: string) {
    this.iaService.loadModel(signType).subscribe(
      {
        next: (response: any) => {
          console.log(response);
        },
        error: (error: any) => {
          console.error(error);
        }
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
    window.location.reload()
    this.isView.emit(false)
  }

}
