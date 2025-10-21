import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BookService } from '../../../core/services/book.service';  //los ../ son la cantidad de niveles a subir

@Component({
  standalone: true,
  selector: 'app-book',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './book.html',
  styleUrl: './book.css'
})
export class BookComponent {
  private fb = inject(FormBuilder);

  private router = inject(Router);
  private bookSvc = inject(BookService); // 👈 esta línea

  form = this.fb.group({
    isbn: ['', [Validators.required, Validators.minLength(10)]],
    title: ['', Validators.required],
    author: ['', Validators.required],
    category: [''],
    publicationYear: [new Date().getFullYear(), [Validators.required, Validators.min(1450), Validators.max(new Date().getFullYear())]],
    totalCopies: [1, [Validators.required, Validators.min(1)]],
    isActive: [true, Validators.required]
  });

  submit() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }

    const v = this.form.value;
    const payload = {
      isbn: v.isbn!,
      title: v.title!,
      author: v.author!,
      category: v.category!,
      publicationYear: v.publicationYear!,
      totalCopies: v.totalCopies!,
      isActive: v.isActive!
    };

    this.bookSvc.create(payload).subscribe({
      next: () => alert('📚 Libro creado con éxito'),
      error: () => alert('❌ Error al crear el libro.')
    });
  }
}
