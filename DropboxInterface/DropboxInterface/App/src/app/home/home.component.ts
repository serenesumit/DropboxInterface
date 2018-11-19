import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { DropboxService } from '../service/dropbox.service';
import { DomSanitizer } from '@angular/platform-browser';
import { Component, OnInit, ViewChild, Pipe, PipeTransform } from '@angular/core';
import { MatTableDataSource, MatSort } from '@angular/material';
import { DataSource } from '@angular/cdk/table';

import { DropboxFolderModel } from '../model/dropbox-model';
import { debug } from 'util';

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

export interface Element {
  folderName: string
}

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {


  @ViewChild(MatSort) sort: MatSort;


  dropboxFolderModel: DropboxFolderModel = null;
  dropboxFrm: FormGroup;
  isFolderTableHidden: boolean = false;
  IsAuthenticate: boolean = false;
  backPath: string = '';
  formErrors = {
    'Path': '',
    'File': '',

  };

  // This object contains all the validation messages for this form
  validationMessages = {
    'Path': {
      'Path': 'Path is required.',
    },
    'File': {
      'required': 'File is required.',
    }
  };

  constructor(private fb: FormBuilder, private http: HttpClient,
    private dropboxService: DropboxService) {
    this.dropboxFrm = this.fb.group({
      Id: [''],
      Path: ['', Validators.required],
      Files: [[], Validators.required]

    });
  }

  ngOnInit() {
    this.dropboxService.getToken().subscribe(data => {
      if (data != null && typeof data !== "undefined") {
        this.IsAuthenticate = true;
      }
    });
    this.getFolder('');
    if (this.dropboxFolderModel == null || typeof this.dropboxFolderModel === "undefined") {
      this.isFolderTableHidden = true;
    }

    this.dropboxFrm.valueChanges.subscribe((data) => {

    });


  }


  isFieldValid(field: string): boolean {
    return (
      !this.dropboxFrm.get(field).valid && this.dropboxFrm.get(field).touched
    );
  }

  displayFieldCss(field: string): any {
    return {
      'is-invalid': this.isFieldValid(field)
    };
  }

  validateAllFormFields(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      }
    });
  }

  onFileChange(event): void {
    if (event.target.files && event.target.files.length > 0) {
      this.dropboxFrm.patchValue({
        Files: <Array<File>>event.target.files
      });
    }
  }


  dropboxLogin() {
    this.dropboxService.getDropboxLoginUrl().subscribe(data => {
       window.location.href = data.toString();
    });
  }

  getBackFolders(path) {
   
    if (path != null && path !== '' && typeof path !== "undefined") {
      var arr = path.split('/');
      var newPath = '';
      if (arr != null && typeof arr !== "undefined" && arr !== '') {
        for (let i = 1; i < arr.length-1; i++) {
          newPath = newPath + "/" + arr[i];
        }

        this.getFolder(newPath);
      }
    }
  }

  getFolder(path) {
    this.dropboxFrm.patchValue({
      Path: path
    });
    this.backPath = path;
    this.dropboxService.getDropboxFolders(path).subscribe(dropboxFolderModel => {
      this.dropboxFolderModel = dropboxFolderModel;
      if (dropboxFolderModel != null && typeof dropboxFolderModel !== "undefined") {
        console.log(dropboxFolderModel);

        if (dropboxFolderModel.token != null && typeof dropboxFolderModel.token !== "undefined") {
          this.IsAuthenticate = true;
        }

      }
    });
  }

  onSubmit(): void {
    console.log('Form Submitted!', this.dropboxFrm.value);

    if (this.dropboxFrm.valid) {
      console.log('Form Submitted!', this.dropboxFrm.value);
      this.dropboxService.saveDropboxData(this.dropboxFrm.value).subscribe(
        response => {
          alert('Submitted Successfully.');
          this.resetForm();
          console.log('response', response);
        },
        error => {
          console.log('error', error);
        }
      );

    } else {
      alert("Invalid");
      this.validateAllFormFields(this.dropboxFrm);
    }
  }

  resetForm() {
    this.dropboxFrm.get('Files').setValidators([Validators.required]);
    this.dropboxFrm.get('Files').updateValueAndValidity();
    this.dropboxFrm.reset();
  }

}
