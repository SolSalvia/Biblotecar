import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BookService, Book } from '../../../core/services/book.service';
import { isbnValidator, yearRangeValidator, isbnUniqueValidator } from '../../../shared/validators/book.validator';

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

  loadingList = false;
  books: Book[] = [];

 currentYear = new Date().getFullYear();

  form = this.fb.group({
  isbn: ['', {  
    validators: [Validators.required, isbnValidator()],
    asyncValidators: [isbnUniqueValidator(this.bookSvc)],
    updateOn: 'blur'       // los errores se disparan al salir del input
  }],
  title: ['', Validators.required],
  author: ['', Validators.required],
  category: [''],
  publicationYear: [
    this.currentYear,
    [Validators.required, yearRangeValidator(1450)]
  ],
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
  if (this.form.invalid || this.form.pending) {
    this.form.markAllAsTouched();
    return;
  }

    const v = this.form.value;
    const payload = {
    isbn: (v.isbn ?? '').toString().trim().replace(/[-\s]/g, ''),  // limpio ISBN
    title: (v.title ?? '').toString().trim(),
    author: (v.author ?? '').toString().trim(),
    category: (v.category ?? '').toString().trim(),
    publicationYear: Number(v.publicationYear),
    totalCopies: Number(v.totalCopies),
    isActive: Boolean(v.isActive)
  } as Omit<Book,'id'>;

    this.bookSvc.create(payload).subscribe({
    next: () => {
      alert('📚 Libro creado con éxito');
      // refrescá la tabla si tenés loadBooks()
      this.loadBooks?.();
      // resetea el form a valores por defecto
      this.form.reset({
        publicationYear: this.currentYear,
        totalCopies: 1,
        isActive: true
      });
    },
    error: () => alert('❌ No se pudo crear el libro. ¿Está corriendo JSON Server en :3000?')
  });
}
}
