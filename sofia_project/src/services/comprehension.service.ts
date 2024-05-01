import {Injectable} from '@angular/core';
import {CommonServices} from "../app/CommonServices";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class ComprehensionService {

  private baseUrl = ''

  constructor(
    private _common: CommonServices,
    private _http: HttpClient,
  ) {
    this.baseUrl = this._common.BASE_URL + 'comprehension/'
  }

  addComprehension(idUser: string | null, idResource: string | null, stateResource: string | null) {
    const body = {
      id_User: idUser,
      id_Resource: idResource,
      stateResource: stateResource,
    };
    return this._http.post(`${this.baseUrl}create-comprehension`, body);
  }

  getListComprehension() {
    const headers = {params: {}}
    return this._http.get(`${this.baseUrl}resources-comprehension`, headers)
  }

  getComprehensionsByIdUser(idUser: string) {
    return this._http.get<any>(`${this.baseUrl}list-comprehension-user/${idUser}`);
  }
}
