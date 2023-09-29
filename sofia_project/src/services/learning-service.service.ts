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
        const popup = window.open(this.apiUrl, '_blank', 'width=800,height=600');
        if (!popup) {
            console.error('No se pudo abrir la ventana emergente. Asegúrate de que los bloqueadores de ventanas emergentes estén desactivados.');
        } else {
            console.log('pópu', popup)
            this.ventanaEmergenteAbiertaSubject.next(true);
            popup.onload = () => {
                // Resto del código
                popup.onclose = () => {
                    this.ventanaEmergenteAbiertaSubject.next(false);
                };
            };
        }
    }

    /* SERVICIO PARA LA OBTENCIÓN DEL API DE FLASK */
    obtenerFlujoVideo(): Observable<ArrayBuffer> {
        return this.http.get(this.apiUrl, {responseType: 'arraybuffer'});
    }

    /* MÉTODO PARA VERIFICAR EL ESTADO DE LA VENTANA EMERGENTE */
    isVentanaEmergenteAbierta(): Observable<boolean> {
        return this.ventanaEmergenteAbiertaSubject.asObservable();
    }

}
