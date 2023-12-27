import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {CommonServices} from "../app/CommonServices";

@Injectable({
  providedIn: 'root'
})
export class EntityService {

  private baseUrl = ''

  constructor(private _http: HttpClient, private _common: CommonServices) {
    this.baseUrl = this._common.BASE_URL + ''
  }

  getListEntity() {
    const headers = {params: {}}
    return this._http.get(`${this.baseUrl}entity-list`, headers)
  }
}
