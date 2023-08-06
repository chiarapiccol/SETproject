import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tech, techCharGroup } from '../models/tech';
import { mat, matChar } from '../models/mat';
import { commonCountries, matCountries } from '../models/country';

@Injectable({
  providedIn: 'root'
})
export class BackendService {
  
  constructor(private http: HttpClient) { }

  fetchpiePlot(toFetchCountries: commonCountries[], toFetchColor: string[], toFetchSize: string[], toFetchX: string[], toFetchY: string[],  toFetchTech: tech[], toFetchMat: mat[]): Observable<any[]> {
    const url = "http://localhost:5000/bubblePlot"
    const requestData = {countr: toFetchCountries, mats:toFetchMat, techs: toFetchTech, col: toFetchColor, size: toFetchSize, x:toFetchX, y: toFetchY}
    return this.http.post<any[]>(url, requestData, {
        headers: {
          "Content-Type": "application/json"
        }
      })
   }

   // differences raus, total suppl raus, 

   fetchpieChart(toFetchColor: string[], toFetchTech: tech[], toFetchMat: mat[]): Observable<any[]> {
    const url = "http://localhost:5000/pieChart"
    const requestData = {mats:toFetchMat, techs: toFetchTech, cols: toFetchColor}
    return this.http.post<any[]>(url, requestData, {
        headers: {
          "Content-Type": "application/json"
        }
      })
   }

   fetchHeatMap(toFetchMat: mat[], toFetchEIP: any[], toFetchCountries: matCountries[]): Observable<any[]> {
    const url = "http://localhost:5000/heatMap"
    const requestData = {mats: toFetchMat, eip: toFetchEIP, countr: toFetchCountries}
    return this.http.post<any[]>(url, requestData, {
        headers: {
          "Content-Type": "application/json"
        }
      })
   }

   fetchSpiderDiagr(toFetchTech: tech[], toFetchMat: mat[]): Observable<any[]> {
    const url = "http://localhost:5000/spider"
    const requestData = {techs: toFetchTech, mats: toFetchMat}
    return this.http.post<any[]>(url, requestData, {
        headers: {
          "Content-Type": "application/json"
        }
      })
   }






}


