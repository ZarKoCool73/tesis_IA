import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output, Renderer2,
  ViewChild
} from '@angular/core';
import {IaService} from "../../services/ia.service";
import Swal from "sweetalert2";
import {HttpErrorResponse} from "@angular/common/http";
import {types} from "sass";
import Error = types.Error;

@Component({
  selector: 'app-camera',
  templateUrl: './camera.component.html',
  styleUrls: ['./camera.component.scss']
})
export class CameraComponent implements OnInit {

  @Input() dataCollection: any[] = []
  @Input() typeLetter: any[] = []
  @Input() expression!: any
  @Output() isView = new EventEmitter<boolean>()

  @ViewChild('localVideo', {static: false}) localVideo!: ElementRef<HTMLVideoElement>;
  @ViewChild('canvas', {static: false}) canvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('counter', {static: false}) counter!: ElementRef<HTMLDivElement>;

  result: string = '';
  title = '';

  ngOnInit(): void {
    this.modalInit()
  }

  constructor(
    private readonly iaService: IaService,
    private readonly renderer: Renderer2
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

  startCountdown() {
    let countdown = 5;
    this.renderer.setStyle(this.counter.nativeElement, 'display', 'block');
    this.counter.nativeElement.innerText = countdown.toString();
    const interval = setInterval(() => {
      countdown--;
      this.counter.nativeElement.innerText = countdown.toString();
      if (countdown === 0) {
        clearInterval(interval);
        this.renderer.setStyle(this.counter.nativeElement, 'display', 'none');
        this.captureAndProcessImage();
      }
    }, 1000);
  }


  captureAndProcessImage() {
    const video = this.localVideo.nativeElement;
    const canvas = this.canvas.nativeElement;
    const context = canvas.getContext('2d')!;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    const imgData = canvas.toDataURL('image/jpeg');
    const sign = this.typeLetter[0].name;
    Swal.showLoading()
    switch (this.expression) {
      case 'Abecedario':
        this.calculateAbc(imgData, sign)
        break
      case 'Números':
        this.calculateNumbers(imgData, sign)
        break
      case 'Verbos':
        this.calculateVerbs(imgData, sign)
        break
    }
  }

  return() {
    window.location.reload()
    this.isView.emit(false)
  }

  calculateNumbers(imgData: any, sign: any) {
    this.iaService.processNumbers(imgData)
      .subscribe({
        next: (data: any) => {
          Swal.close()
          const accuracyPercentage = data.accuracy ? `${data.accuracy.toFixed(2)}%` : '';
          if (data.accuracy < 95 || data.hand_sign != sign) {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              html: '<strong>Seña no detectada</strong><br>' +
                'Precisión: <strong>0</strong><br>' +
                'Seña: <strong>' + sign + '</strong>',
              confirmButtonColor: '#ff3600',
            }).then((result) => {

            })
            return;
          }
          Swal.fire({
            title: '<strong>¡Resultado de seña!</strong>',
            html: 'Precisión: <strong>' + accuracyPercentage + '</strong> ' +
              'Seña: <strong>' + data.hand_sign + '</strong>',
            icon: 'success',
            showCancelButton: false,
            confirmButtonColor: '#11e38a',
            confirmButtonText: 'Cerrar',
            allowOutsideClick: false // Evita que el modal se cierre haciendo clic fuera de él
          }).then((result) => {
            if (result.isConfirmed) {
              this.return()
            }
          })
        },
        error: (error: HttpErrorResponse) => {
          Swal.close()
          if (error.status === 500) {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Error interno de servidor',
              confirmButtonColor: '#ff3600',
            }).then((result) => {
              if (result.isConfirmed) {
                this.return()
              }
            })
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              html: '<strong>Seña no detectada</strong><br>' +
                'Precisión: <strong>0</strong><br>' +
                'Seña: <strong>' + sign + '</strong>',
              confirmButtonColor: '#ff3600',
            }).then((result) => {
              /*if (result.isConfirmed) {
                this.return()
              }*/
            })
          }
        }
      })
  }

  calculateAbc(imgData: any, sign: any) {
    this.iaService.processLetters(imgData)
      .subscribe({
        next: (data: any) => {
          Swal.close()
          if (data.accuracy < 95 || data.hand_sign != sign) {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              html: '<strong>Seña no detectada</strong><br>' +
                'Precisión: <strong>0</strong><br>' +
                'Seña: <strong>' + sign + '</strong>',
              confirmButtonColor: '#ff3600',
            }).then((result) => {

            })
            return;
          }
          const accuracyPercentage = data.accuracy ? `${data.accuracy.toFixed(2)}%` : '';
          Swal.fire({
            title: '<strong>¡Resultado de seña!</strong>',
            html: 'Precisión: <strong>' + accuracyPercentage + '</strong> ' +
              'Seña: <strong>' + data.hand_sign + '</strong>',
            icon: 'success',
            showCancelButton: false,
            confirmButtonColor: '#11e38a',
            confirmButtonText: 'Cerrar',
            allowOutsideClick: false // Evita que el modal se cierre haciendo clic fuera de él
          }).then((result) => {
            if (result.isConfirmed) {
              this.return()
            }
          })
        },
        error: (error: HttpErrorResponse) => {
          Swal.close()
          if (error.status === 500) {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Error interno de servidor',
              confirmButtonColor: '#ff3600',
            }).then((result) => {
              if (result.isConfirmed) {
                this.return()
              }
            })
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              html: '<strong>Seña no detectada</strong><br>' +
                'Precisión: <strong>0</strong><br>' +
                'Seña: <strong>' + sign + '</strong>',
              confirmButtonColor: '#ff3600',
            }).then((result) => {
              /*if (result.isConfirmed) {
                this.return()
              }*/
            })
          }
        }
      })
  }

  calculateVerbs(imgData: any, sign: any) {
    this.iaService.processVerbs(imgData)
      .subscribe({
        next: (data: any) => {
          Swal.close()
          if (data.accuracy < 95 || data.hand_sign != sign) {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              html: '<strong>Seña no detectada</strong><br>' +
                'Precisión: <strong>0</strong><br>' +
                'Seña: <strong>' + sign + '</strong>',
              confirmButtonColor: '#ff3600',
            }).then((result) => {

            })
            return;
          }
          const accuracyPercentage = data.accuracy
          Swal.fire({
            title: '<strong>¡Resultado de seña!</strong>',
            html: 'Precisión: <strong>' + accuracyPercentage + '</strong> ' +
              'Seña: <strong>' + data.hand_sign + '</strong>',
            icon: 'success',
            showCancelButton: false,
            confirmButtonColor: '#11e38a',
            confirmButtonText: 'Cerrar',
            allowOutsideClick: false // Evita que el modal se cierre haciendo clic fuera de él
          }).then((result) => {
            if (result.isConfirmed) {
              this.return()
            }
          })
        },
        error: (error: HttpErrorResponse) => {
          Swal.close()
          if (error.status === 500) {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Error interno de servidor',
              confirmButtonColor: '#ff3600',
            }).then((result) => {
              if (result.isConfirmed) {
                this.return()
              }
            })
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              html: '<strong>Seña no detectada</strong><br>' +
                'Precisión: <strong>0</strong><br>' +
                'Seña: <strong>' + sign + '</strong>',
              confirmButtonColor: '#ff3600',
            }).then((result) => {

            })
          }
        }
      })
  }

  modalInit() {
    switch (this.expression) {
      case 'Abecedario':
        this.modalABC()
        break;
      case 'Números':
        this.modalNumbers()
        break;
      case 'Verbos':
        this.modalVerbs()
        break
    }
  }

  modalABC() {
    Swal.fire({
      title: '<strong>Instrucciones para Capturar Letra</strong>',
      width: '40rem',
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
        <p>Para capturar la letra correctamente, por favor sigue estos pasos:</p>
        <ul>
          <li>Evita fondos que distraigan.</li>
          <li>Asegúrate de estar en un lugar bien iluminado.</li>
          <li>Posiciona tu mano frente a la cámara de manera clara y visible.</li>
          <li>Para mayor precisión utilizar la mano derecha</li>
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
  modalNumbers() {
    Swal.fire({
      title: '<strong>Instrucciones para Capturar Número</strong>',
      width: '40rem',
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
        <p>Para capturar el número correctamente, por favor sigue estos pasos:</p>
        <ul>
          <li>Asegúrate de estar en un lugar bien iluminado.</li>
          <li>Posiciona tu mano frente a la cámara de manera clara y visible.</li>
          <li>Evita fondos que distraigan.</li>
          <li>Para mayor precisión utilizar la mano izquierda</li>
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
  modalVerbs() {
    Swal.fire({
      title: '<strong>Instrucciones para Capturar Verbo</strong>',
      width: '40rem',
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
        <p>Para capturar el verbo correctamente, por favor sigue estos pasos:</p>
        <ul>
          <li>Evita fondos que distraigan.</li>
          <li>Asegúrate de estar en un lugar bien iluminado.</li>
          <li>Concede permisos de cámara si es necesario.</li>
          <li>Mantenga una distancia prudente para una mejor experiencia.</li>
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
