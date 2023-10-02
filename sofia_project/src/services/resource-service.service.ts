import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {CommonServices} from "../app/CommonServices";

@Injectable({
  providedIn: 'root'
})
export class ResourceServiceService {

  private baseUrl = ''

  constructor(private _http: HttpClient, private _common: CommonServices) {
    this.baseUrl = this._common.BASE_URL + ''
  }

  getCategory(category: string) {
    const headers = {params: {}}
    return this._http.get(`${this.baseUrl}resources/${category}`, headers)
  }
}
