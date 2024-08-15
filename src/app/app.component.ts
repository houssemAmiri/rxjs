import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { DataService } from './data.service';
import { catchError, of, tap } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  data: string | undefined;
  transformedData: string | undefined;
  errorData: string | undefined;
  fallbackErrorData: string | undefined;

  private readonly destroyRef = inject(DestroyRef);

  constructor(private dataService: DataService) {}
  ngOnInit(): void {
    // getData observable
    const getData = this.dataService.getData().subscribe({
      next: (value) => {
        this.data = value;
        console.log('next getData: ', value);
      },
      error: (err) => {
        console.log('err getData', err);
      },
      complete: () => {
        console.log('complete getData');
      },
    });
    this.destroyRef.onDestroy(() => {
      console.log('getData unsubscribed');
      getData.unsubscribe();
    });

    // ***********************************************************************
    // getTransformedData Observable
    const getTransformedData = this.dataService.getTransformedData().subscribe({
      next: (value) => {
        this.transformedData = value;
        console.log('next getTransformedData: ', value);
      },
      error: (err) => {
        console.log('err getTransformedData', err);
      },
      complete: () => {
        console.log('complete getTransformedData');
      },
    });

    this.destroyRef.onDestroy(() => {
      console.log('getTransformedData unsubscribed');
      getTransformedData.unsubscribe();
    });

    // ***********************************************************************
    // getDataWithErrorHandling Observable
    const getDataWithErrorHandling = this.dataService
      .getDataWithErrorHandling()
      .pipe(
        tap({
          error: (error) => {
            this.errorData = error;
            console.log(`getDataWithErrorHandling Error Data`);
          },
        }),
        catchError((err) => {
          console.log(
            `Replacing the failed observable with a fallback message`
          );
          return of('Fallback Data');
        })
      )
      .subscribe({
        next: (value) => {
          console.log('next getDataWithErrorHandling: ', value);
          this.fallbackErrorData = value;
        },
        error(err) {
          console.log('err getDataWithErrorHandling', err);
        },
        complete: () => {
          console.log('complete getDataWithErrorHandling');
        },
      });

    this.destroyRef.onDestroy(() => {
      getDataWithErrorHandling.unsubscribe();
    });
  }
}
