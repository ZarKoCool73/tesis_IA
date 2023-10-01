import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LearningServiceService {
  private apiUrl = 'http://localhost:5000/api/video'; // Reemplaza con la URL de tu API de Flask
  private ventanaEmergenteAbiertaSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient) {
  }

  /* METODO PARA QUE MUESTRE LA VENTANA EMERGENTE */
  abrirVentanaEmergente(): void {
    const width = 635;
    const height = 480;

    const left = (window.innerWidth - width) / 2;
    const top = (window.innerHeight - height) / 2;

    const popup = window.open(this.apiUrl, '_blank', `width=${width},height=${height},left=${left},top=${top}`);

    console.log(popup)
    // Agrega un event listener para escuchar mensajes de la ventana emergente
    window.addEventListener('message', (event) => {
      // Verifica si el mensaje proviene de la ventana emergente
      if (event.source === popup) {
        // Verifica si el mensaje indica que la ventana emergente se ha cerrado
        if (event.data === 'ventanaCerrada') {
          // Realiza acciones adicionales aquí si es necesario
          console.log('La ventana emergente se ha cerrado.');
        }
      }
    });
  }

  /* MÉTODO PARA VERIFICAR EL ESTADO DE LA VENTANA EMERGENTE */
  isVentanaEmergenteAbierta(): Observable<boolean> {
    return this.ventanaEmergenteAbiertaSubject.asObservable();
  }

}
