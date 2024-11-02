import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SpinnerService {

  isLoadingBs = new BehaviorSubject<boolean>(false);
  isLoading$ = this.isLoadingBs.asObservable();

  show(): void {
    this.isLoadingBs.next(true);
  }

  hide(): void {
    this.isLoadingBs.next(false);
  }
}
