import {Injectable} from '@angular/core';
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

  getListComprehension() {
    const headers = {params: {}}
    return this._http.get(`${this.baseUrl}resources-comprehension`, headers)
  }

  getListExpression() {
    const headers = {params: {}}
    return this._http.get(`${this.baseUrl}resources-expression`, headers)
  }

  getListComunication() {
    const headers = {params: {}}
    return this._http.get(`${this.baseUrl}resources-comunication`, headers)
  }

  refreshState(id: string, state: string) {
    const body = {state};
    return this._http.put<any>(`${this.baseUrl}resources-state/${id}`, body);
  }

  addCommunication(idUser: string | null, idResource: string | null, stateResource: string | null) {
    const body = {
      id_User: idUser,
      id_Resource: idResource,
      stateResource: stateResource,
    };
    return this._http.post(`${this.baseUrl}create-communication`, body);
  }
  addExpression(idUser: string | null, idResource: string | null, stateResource: string | null) {
    const body = {
      id_User: idUser,
      id_Resource: idResource,
      stateResource: stateResource,
    };
    return this._http.post(`${this.baseUrl}create-expression`, body);
  }
  addComprehension(idUser: string | null, idResource: string | null, stateResource: string | null) {
    const body = {
      id_User: idUser,
      id_Resource: idResource,
      stateResource: stateResource,
    };
    return this._http.post(`${this.baseUrl}create-comprehension`, body);
  }
}
