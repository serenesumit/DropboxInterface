import { Injectable } from '@angular/core';

@Injectable()
export class LocalStorageServiceService {

  constructor() { }

  SaveTokenToSession(aU: string) {
    localStorage.setItem('token', aU);
  }

  RemoveTokenFromSession() {
    localStorage.removeItem('token');
  }

  getTokenFromSession() {
    return localStorage.getItem('token');
  }

  SavePathToSession(aU: string) {
    localStorage.setItem('path', aU);
  }

  RemovePathFromSession() {
    localStorage.removeItem('path');
  }

  getPathFromSession() {
   return localStorage.getItem('path');
  }

}
