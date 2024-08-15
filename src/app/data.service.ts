import { DestroyRef, Injectable, inject } from '@angular/core';
import { Observable, catchError, map, of, throwError } from 'rxjs';
const data: string = 'Hello, Angular!';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  constructor() {}

  // Create an Observable that emits a single value
  getData(): Observable<string> {
    return of(data); // 'of' creates an observable from a value
  }

  getTransformedData(): Observable<string> {
    return of(data).pipe(
      map((data) => data.toUpperCase()) // Transform the data to uppercase
    );
  }

  getDataWithErrorHandling(): Observable<string> {
    return new Observable<string>((observer) => {
      observer.error('Simulated error occurred'); // Emit an error
    }).pipe(
      catchError((error) => {
        console.error('Error occurred:', error);
        return throwError(() => {
          return error;
        });
      })
    );
  }
}
