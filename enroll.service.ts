import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { Orderer } from './orderer';

@Injectable({
  providedIn: 'root'
})
export class EnrollService {
  _url = 'http://localhost:3000/enroll';

  constructor(private _http:HttpClient) { }

  enroll(orderer:Orderer){
    return this._http.post<any>(this._url, orderer);
    
    
  }

}