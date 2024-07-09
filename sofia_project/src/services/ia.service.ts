import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class IaService {
  private apiUrl = 'https://services-ia.onrender.com';

  constructor(
    private readonly _http: HttpClient,
  ) {
  }

  processImage(imageData: string): Observable<any> {
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    const body = {
      image: imageData,
    };
    const url = `${this.apiUrl}/predict`;
    return this._http.post<any>(url, body, {headers: headers});
  }
}
