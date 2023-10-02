import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {CommonServices} from "../app/CommonServices";

@Injectable({
  providedIn: 'root'
})
export class UserServiceService {

  private baseUrl = ''
  constructor(private _http: HttpClient, private _common: CommonServices) {
    this.baseUrl = this._common.BASE_URL + '/users'
  }

  getUser(id: string) {
    const headers = {params: {}}
    return this._http.get(`${this.baseUrl}/${id}`, headers)
  }

  
}
