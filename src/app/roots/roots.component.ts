import { Component, OnInit } from '@angular/core';
import { DirectoriesService } from '@picthor/directory/directory.service';
import { Directory } from '@picthor/directory/directory';
import { Observable, Subject } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormHelper } from '@picthor/shared/form/FormHelper';
import { startWith, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-roots',
  templateUrl: './roots.component.html',
})
export class RootsComponent implements OnInit {
  roots$?: Observable<Directory[]>;
  rootFormModal = false;

  rootForm: FormGroup;
  processing = false;
  refresh$: Subject<any>;

  constructor(protected directoriesService: DirectoriesService, private formBuilder: FormBuilder) {
    this.rootForm = this.formBuilder.group({
      name: ['', Validators.required],
      path: ['', Validators.required],
    });
    this.refresh$ = new Subject<any>();
  }

  ngOnInit(): void {
    this.roots$ = this.refresh$.pipe(
      startWith(0),
      switchMap(() => {
        return this.directoriesService.getRoots();
      })
    );
  }

  addRootForm() {
    this.rootFormModal = true;
  }

  addRootSubmit() {
    if (!this.rootForm.valid) {
      this.rootForm.markAllAsTouched();
      this.rootForm.updateValueAndValidity();
      return;
    }
    this.directoriesService.addRoot(this.rootForm.value).subscribe(
      (res) => {
        this.processing = false;
        this.rootFormModal = false;
        this.refresh$.next();
      },
      (response) => {
        this.processing = false;
        FormHelper.bindErrorsToForm(response.error.errors, this.rootForm);
        this.rootForm.markAllAsTouched();
      }
    );
  }
}
