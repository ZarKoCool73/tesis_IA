import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class IaService {
  private apiUrl = 'https://services-ia.onrender.com/process_image';
  constructor(
    private readonly _http: HttpClient,
  ) { }

  processImage(imageData: string, expressions: string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = {
      imageData: imageData,
      Expressions: expressions
    };
    return this._http.post<any>(this.apiUrl, body, { headers: headers });
  }
}
