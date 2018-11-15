
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { DropboxModel } from '../model/dropbox-model';

const dropboxUrl = 'https://localhost:44358/api/Dropbox/SaveFile';

@Injectable()
export class DropboxService {

  constructor(private http: HttpClient) { }

  saveDropboxData(data: {
    Path: string;
    Files: File[];
  }) {
    const formData: FormData = new FormData();
    formData.append('path', data.Path);
  
    for (let i = 0; i < data.Files.length; i++) {
      formData.append('Files', data.Files[i], data.Files[i]['name']);
    }
    
    console.log('form data variable :   ' + formData.toString());

    return this.http.post(`${dropboxUrl}`, formData);
  }

}
