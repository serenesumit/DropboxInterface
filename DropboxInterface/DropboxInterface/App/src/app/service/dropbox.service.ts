import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { DropboxFolderModel } from '../model/dropbox-model';
import { environment } from '../../environments/environment';

//const fileUrl = 'https://localhost:44358/api/Files';
//const dropboxUrl = 'https://localhost:44358/api/Dropbox';

const baseUrl = environment.baseUrl;

const fileUrl = baseUrl + 'Files';
const dropboxUrl = baseUrl + 'Dropbox';

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

    return this.http.post(`${fileUrl}`, formData);
  }

  getDropboxFolders(path): Observable<DropboxFolderModel> {

    const formData: FormData = new FormData();
    formData.append('Path', path);

    return this.http.post<DropboxFolderModel>(`${dropboxUrl}/GetDropboxFolders`, formData);
   
  }


  getDropboxLoginUrl() {
    return this.http.get<string>(`${dropboxUrl}` + '/GetDropboxLoginUrl');
  }

  getToken(): Observable<string> {
    return this.http.get<string>(`${dropboxUrl}` + '/CheckSession');

  }



}
