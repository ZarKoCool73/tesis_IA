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
    this.modalInit()
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
        },
        complete: () => {
          console.log('termino de cargar')
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

  modalInit() {
    Swal.fire({
      title: '<strong>Instrucciones para Capturar Seña</strong>',
      width:'40rem',
      html: `
      <style>
        ul {
          padding-left: 20px; /* Ajusta el padding del listado para mantener el texto alineado */
        }
        li {
          text-align: left; /* Alinea los elementos de la lista al inicio */
        }
      </style>
      <div style="text-align: left;"> <!-- Alinea el texto general al inicio -->
        <p>Para capturar la seña correctamente, por favor sigue estos pasos:</p>
        <ul>
          <li>Asegúrate de estar en un lugar bien iluminado.</li>
          <li>Posiciona tu mano frente a la cámara de manera clara y visible.</li>
          <li>Evita fondos que distraigan.</li>
          <li>Concede permisos de cámara si es necesario.</li>
        </ul>
        <p>Cuando estés listo, haz clic en "Continuar" para activar la cámara.</p>
      </div>
    `,
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#11e38a',
      cancelButtonColor: '#ff3600',
      confirmButtonText: 'Continuar',
      cancelButtonText: 'Cancelar',
      allowOutsideClick: false
    }).then((result) => {
      if (result.isConfirmed) {
        this.setupWebRTC();
      }
      if (result.isDenied || result.isDismissed) {
        this.return()
      }
    });
  }
}
