import { AbstractControl, AsyncValidatorFn, ValidationErrors, ValidatorFn } from '@angular/forms';
import { BookService } from '../../core/services/book.service';
import { map, of, switchMap, timer } from 'rxjs';

// VALIDADOR DE ISBN DIGITOS

export function isbnValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const raw = (control.value ?? '').toString().trim();
    if (!raw) return null;

    const s = raw.replace(/[-\s]/g, ''); //saca fuera guiones y espacios
    const len = s.length;

    // ISBN 10 digitos
    if (len === 10 && /^\d{9}(\d|X)$/i.test(s)) { //funcion que verifica cantidad de digitos
      let sum = 0;
      for (let i = 0; i < 9; i++) sum += (i + 1) * parseInt(s[i], 10);
      const check = s[9].toUpperCase() === 'X' ? 10 : parseInt(s[9], 10);
      sum += 10 * check;
      if (sum % 11 === 0) return null;
    }

    // ISBN 13 digitos
    if (len === 13 && /^\d{13}$/.test(s)) { //funcion que verifica cantidad de digitos
      let sum = 0;
      for (let i = 0; i < 12; i++) {
        const n = parseInt(s[i], 10);
        sum += i % 2 === 0 ? n : 3 * n;
      }
      const check = (10 - (sum % 10)) % 10;
      if (check === parseInt(s[12], 10)) return null;
    }

    return { isbnInvalid: true };
  };
}

// VALIDADOR AÑO
export function yearRangeValidator(minYear = 1): ValidatorFn { //año minimo 1
  return (control: AbstractControl): ValidationErrors | null => {
    const y = Number(control.value);
    if (!Number.isFinite(y)) return { yearInvalid: true };
    const max = new Date().getFullYear();
    if (y < minYear || y > max) return { yearOutOfRange: { min: minYear, max } };
    return null;
  };
}

// VALIDADOR ISBN ÚNICO
export function isbnUniqueValidator(bookSvc: BookService): AsyncValidatorFn {
  return (control: AbstractControl) => {
    const raw = (control.value ?? '').toString().trim();
    if (!raw) return of(null);
    const s = raw.replace(/[-\s]/g, ''); //saca guiones y espacios
    return timer(300).pipe(
      switchMap(() => bookSvc.getByIsbn(s)),
      map(list => (list.length ? ({ isbnTaken: true }) : null))
    );
  };
}
