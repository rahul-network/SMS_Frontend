import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { switchMap, map, tap, debounceTime } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AutocompleteService {
  public loading$ = new BehaviorSubject<boolean>(false);
  constructor(private http: HttpClient) {}
  private actionSubject = new BehaviorSubject<string>('');
  readonly action$ = this.actionSubject.asObservable();
  public setAction(input: string): void {
    this.actionSubject.next(input);
  }
  readonly autocomplete$: Observable<PatientModel[]> = this.action$.pipe(
    // Taps the emitted value from action stream
    tap((data: string) => this.loading$.next(true)),
    // Wait for 250 ms to allow the user to finish typing
    debounceTime(250),
    // switchMap fires REST based on above input
    switchMap(input => ((!!input && input.trim().length > 1) ? this.http.get<PatientModel[]>(`http://localhost:65172/api/Clinic/QAC/Patient?PageNumber=1&&PageSize=2&&SearchTerm=${input}`) : of([]))
    .pipe(
        map((data: any) =>{
            this.loading$.next(false);
            return data.items

        }),
      // Taps the final emitted value from inner observable
        //tap((data: any) =>)
    )),
  );
  // Cleanup.
  ngOnDestroy() {
    this.loading$.unsubscribe();
  }
}

interface PatientModel {
    firstName: string;
    lastName: string;
    id: number,
    dateOfBirth: Date
}