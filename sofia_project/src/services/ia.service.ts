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

  loadModel(signType: string): Observable<any> {
    const url = `${this.apiUrl}/load_model?signType=${signType}`;
    return this._http.get(url);
  }

  processImage(imageData: string, expressions: string): Observable<any> {
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    const body = {
      imageData: imageData,
      Expressions: expressions
    };
    const url = `${this.apiUrl}/process_image`;
    return this._http.post<any>(this.apiUrl, body, {headers: headers});
  }
}
