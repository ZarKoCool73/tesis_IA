import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class LearningServiceService {
  private apiUrl = 'http://localhost:5000/api/video';
  private ventanaEmergenteAbiertaSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient) {
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

  detenerServicioDeVideo(): void {
    this.http.get('http://localhost:5000/api/stop_video').subscribe(response => {
      console.log(response); // Esto imprimirá "Servicio de video detenido."
    });
  }

  isVentanaEmergenteAbierta(): Observable<boolean> {
    return this.ventanaEmergenteAbiertaSubject.asObservable();
  }
}
