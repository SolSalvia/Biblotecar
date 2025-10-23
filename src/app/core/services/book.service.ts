
// utiliza http para usar get, post, delete, patch
// y se conecta con el json-server

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Modelo del libro
export interface Book {
  id: number;
  isbn: string;           // único
  title: string;
  author: string;
  category: string;
  publicationYear: number;
  totalCopies: number;    // ≥ 1
  isActive: boolean;
}

@Injectable({ providedIn: 'root' })
export class BookService {
  private base = 'http://localhost:3000/books'; // colección en json-server

  constructor(private http: HttpClient) {}

  getAll(): Observable<Book[]> {
    return this.http.get<Book[]>(this.base);
  }

  // CREO UN LIBRO SIN ID LO ASIGNA JSON-SERVER
create(book: Omit<Book,'id'>) {
  return this.http.post<Book>('http://localhost:3000/books', book);
}

  update(id: number, patch: Partial<Book>): Observable<Book> {
    return this.http.patch<Book>(`${this.base}/${id}`, patch);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
  getByIsbn(isbn: string) {
  return this.http.get<Book[]>(`${this.base}?isbn=${encodeURIComponent(isbn)}`);
}
}
