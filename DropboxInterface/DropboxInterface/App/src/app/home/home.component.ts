import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { DropboxService } from '../service/dropbox.service';
import { DomSanitizer } from '@angular/platform-browser';
import { Component, OnInit, ViewChild, Pipe, PipeTransform } from '@angular/core';
import { MatTableDataSource, MatSort } from '@angular/material';
import { DataSource } from '@angular/cdk/table';

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

export interface Element {
  position: number,
  name: string,
  weight: number,
  symbol: string
}

const ELEMENT_DATA: PeriodicElement[] = [
  { position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H' },
  { position: 2, name: 'Helium', weight: 4.0026, symbol: 'He' },
  { position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li' },
  { position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be' },
  { position: 5, name: 'Boron', weight: 10.811, symbol: 'B' },
  { position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C' },
  { position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N' },
  { position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O' },
  { position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F' },
  { position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne' },
];

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

  dataSource;
  displayedColumns = [];
  @ViewChild(MatSort) sort: MatSort;

  /**
   * Pre-defined columns list for user table
   */
  columnNames = [{
    id: "position",
    value: "No."

  }, {
    id: "name",
    value: "Name"
  },
  {
    id: "weight",
    value: "Weight"
  },
  {
    id: "symbol",
    value: "Symbol"
  }];

  dropboxFrm: FormGroup;

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

    this.displayedColumns = this.columnNames.map(x => x.id);
    this.createTable();

    this.dropboxFrm.valueChanges.subscribe((data) => {

    });


  }

  createTable() {
    let tableArr: Element[] = [{ position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H' },
    { position: 2, name: 'Helium', weight: 4.0026, symbol: 'He' },
    { position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li' },
    { position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be' },
    { position: 5, name: 'Boron', weight: 10.811, symbol: 'B' },
    { position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C' }
    ];
    this.dataSource = new MatTableDataSource(tableArr);
    this.dataSource.sort = this.sort;
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


  iframeUrl: any = "www.google.com";
  dropboxLogin() {
    var self = this;
    this.http.get('https://localhost:44358/api/Dropbox/GetDropboxLoginUrl')
      .subscribe(
        data => {

          //window.location.href = data.toString();
          this.iframeUrl = 'www.google.com'.toString();
        },
        error => {
          console.log("Error", error);
        }
      );

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
