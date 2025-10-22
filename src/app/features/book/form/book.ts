import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BookService, Book } from '../../../core/services/book.service';

@Component({
  standalone: true,
  selector: 'app-book',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './book.html',
  styleUrl: './book.css'
})
export class BookComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private bookSvc = inject(BookService);

  currentYear = new Date().getFullYear();
  loadingList = false;
  books: Book[] = [];

  form = this.fb.group({
    isbn: ['', [Validators.required, Validators.minLength(10)]],
    title: ['', Validators.required],
    author: ['', Validators.required],
    category: [''],
    publicationYear: [this.currentYear, [Validators.required, Validators.min(1450), Validators.max(this.currentYear)]],
    totalCopies: [1, [Validators.required, Validators.min(1)]],
    isActive: [true, Validators.required]
  });

  ngOnInit(): void {
    this.loadBooks();
  }

  loadBooks(): void {
    this.loadingList = true;
    this.bookSvc.getAll().subscribe({
      next: (data) => { this.books = data; this.loadingList = false; },
      error: () => { this.loadingList = false; alert('No se pudo cargar la lista de libros'); }
    });
  }

  get f() { return this.form.controls; }

  submit() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }

    const v = this.form.value;
    const payload = {
      isbn: (v.isbn ?? '').toString().trim(),
      title: (v.title ?? '').toString().trim(),
      author: (v.author ?? '').toString().trim(),
      category: (v.category ?? '').toString().trim(),
      publicationYear: Number(v.publicationYear ?? this.currentYear),
      totalCopies: Number(v.totalCopies ?? 1),
      isActive: Boolean(v.isActive)
    };

    this.bookSvc.create(payload as Omit<Book, 'id'>).subscribe({
      next: () => {
        alert('📚 Libro creado con éxito');
        this.form.reset({ publicationYear: this.currentYear, totalCopies: 1, isActive: true });
        this.loadBooks(); // refresca la tabla
      },
      error: () => alert('❌ No se pudo crear el libro. ¿Está corriendo JSON Server en :3000?')
    });
  }
}
