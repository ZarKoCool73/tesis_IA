import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class LearningServiceService {
  private apiUrl = 'https://services-ia.onrender.com/alpha';
  private apiVerbos = 'https://services-ia.onrender.com/betta';
  private ventanaEmergenteAbiertaSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient) {
  }

  solicitarPermisosYAbrirVentanaEmergente(): void {
    // Verificar si el navegador es compatible con getUserMedia
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      // Solicitar permisos para acceder a la cámara
      navigator.mediaDevices.getUserMedia({ video: true })
        .then(() => {
          // Los permisos fueron otorgados, ahora abrir la ventana emergente
          this.abrirVentanaEmergente();
        })
        .catch((error) => {
          // Los permisos fueron denegados o ocurrió un error
          console.error('Error al acceder a la cámara:', error);
        });
    } else {
      // El navegador no es compatible con getUserMedia
      console.error('getUserMedia no es compatible con este navegador.');
    }
  }
  abrirVentanaEmergente(): void {
    const width = 635;
    const height = 480;
    const left = (window.innerWidth - width) / 2;
    const top = (window.innerHeight - height) / 2;

    const popup = window.open(this.apiUrl, '_blank', `width=${width},height=${height},left=${left},top=${top}`);

    if (popup) {
      const interval = setInterval(() => {
        if (popup.closed) {
          clearInterval(interval);
          this.ventanaEmergenteAbiertaSubject.next(false);
        }
      }, 1000);

      window.addEventListener('message', (event) => {
        if (event.origin === this.apiUrl) {
          if (event.data === 'loaded') {
            this.ventanaEmergenteAbiertaSubject.next(true);
          } else if (event.data === 'closed') {
            clearInterval(interval);
            this.ventanaEmergenteAbiertaSubject.next(false);
          }
        }
      });

      popup.onload = () => {
        popup.postMessage('loaded', this.apiUrl);
      };

      popup.onbeforeunload = () => {
        popup.postMessage('closed', this.apiUrl);
      };
    } else {
      console.error('No se pudo abrir la ventana emergente. Asegúrate de que los bloqueadores de ventanas emergentes estén desactivados.');
    }
  }

  abrirVentanaVerbos(): void {
    const width = 635;
    const height = 480;
    const left = (window.innerWidth - width) / 2;
    const top = (window.innerHeight - height) / 2;

    const popup = window.open(this.apiVerbos, '_blank', `width=${width},height=${height},left=${left},top=${top}`);

    if (popup) {
      const interval = setInterval(() => {
        if (popup.closed) {
          clearInterval(interval);
          this.ventanaEmergenteAbiertaSubject.next(false);
        }
      }, 1000);

      window.addEventListener('message', (event) => {
        if (event.origin === this.apiVerbos) {
          if (event.data === 'loaded') {
            this.ventanaEmergenteAbiertaSubject.next(true);
          } else if (event.data === 'closed') {
            clearInterval(interval);
            this.ventanaEmergenteAbiertaSubject.next(false);
          }
        }
      });

      popup.onload = () => {
        popup.postMessage('loaded', this.apiVerbos);
      };

      popup.onbeforeunload = () => {
        popup.postMessage('closed', this.apiVerbos);
      };
    } else {
      console.error('No se pudo abrir la ventana emergente. Asegúrate de que los bloqueadores de ventanas emergentes estén desactivados.');
    }
  }

  detenerServicioDeVideo(): void {
    this.http.get('https://services-ia.onrender.com/api/stop_video').subscribe(response => {
      console.log(response); // Esto imprimirá "Servicio de video detenido."
    });
  }

  isVentanaEmergenteAbierta(): Observable<boolean> {
    return this.ventanaEmergenteAbiertaSubject.asObservable();
  }
}
