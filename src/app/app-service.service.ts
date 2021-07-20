import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AppServiceService {

  constructor(
    private http: HttpClient,
  ) { }

  async getItems() {

    let headers = new HttpHeaders();
    headers.append('Content-Type','application/json');
    return this.http.get(environment.apiUrl + '/demo/shop', { headers: headers })
  }

  async getFilteredItems(searchString) {
    let headers = new HttpHeaders();
    let params = new HttpParams();
    params = params.set('searchString', searchString)
    headers.append('Content-Type','application/json');
    return this.http.get(environment.apiUrl + '/demo/shop/search', { headers: headers, params: params })
  }

  async getCartItems(username) {
    let headers = new HttpHeaders();
    let body = new HttpParams();
    body = body.set('username', username);
    body = body.set('Authorization', environment.token)
    headers.append('Content-Type','application/json');
    return this.http.post(environment.apiUrl + '/demo/getItemsFromCart', body, { headers: headers, responseType: "json" })
  }

  async getOrders(username) {
    let headers = new HttpHeaders();
    let body = new HttpParams();
    body = body.set('username', username);
    body = body.set('Authorization', environment.token)
    headers.append('Content-Type','application/json');
    return this.http.post(environment.apiUrl + '/demo/getOrders', body, { headers: headers, responseType: "json" })
  }

  async buyItem(id, username) {
    let headers = new HttpHeaders();
    let body = new HttpParams();
    body = body.set('itemId', id);
    body = body.set('username', username);
    body = body.set('Authorization', environment.token)
    headers.append('Content-Type','application/json');
    return this.http.post(environment.apiUrl + '/demo/buyItem', body, { headers: headers, params: body, observe: "response", responseType: "text" })
  }

  async addItemToCart(id, username) {
    let headers = new HttpHeaders();
    let body = new HttpParams();
    body = body.set('itemId', id);
    body = body.set('username', username);
    body = body.set('Authorization', environment.token)
    headers.append('Content-Type','application/json');
    return this.http.post(environment.apiUrl + '/demo/addItemToCart', body, { headers: headers, params: body, observe: "response", responseType: "text" })
  }

  async deleteItemFromCart(id) {
    let headers = new HttpHeaders();
    let body = new HttpParams();
    body = body.set('itemId', id);
    body = body.set('Authorization', environment.token)
    headers.append('Content-Type','application/json');
    return this.http.post(environment.apiUrl + '/demo/deleteItemFromCart', body, { headers: headers, params: body, observe: "response", responseType: "text" })
  }

  async tryLogin(payload) {
    let headers = new HttpHeaders();
    headers.append('Content-Type','application/json');
    return this.http.post(environment.apiUrl + '/login', payload, { headers: headers, observe: "response", responseType: "blob" })
  }

  getItemsForDisplay() {
    environment.itemsAsKeyValue = []
    for (let key in environment.items) {
      let value = environment.items[key];
      environment.itemsAsKeyValue.push(value)
    }
  }

  getFilteredItemsForDisplay() {
    environment.filteredItemsAsKeyValue = []
    for (let key in environment.filteredItems) {
      let value = environment.filteredItems[key];
      environment.filteredItemsAsKeyValue.push(value)
    }
  }

  }
