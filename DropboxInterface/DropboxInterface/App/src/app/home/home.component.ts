import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { DropboxService } from '../service/dropbox.service';
import { debug } from 'util';

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
    this.http.get('https://localhost:44358/api/Dropbox/GetDropboxLoginUrl')
      .subscribe(
        data => {

          window.location.href = data.toString();
        },
        error => {
          console.log("Error", error);
        }
      );

  }




  onSubmit(): void {
    console.log('Form Submitted!', this.dropboxFrm.value);

    if (this.dropboxFrm.valid) {
      alert("submitted");
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
