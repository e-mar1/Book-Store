import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';

import { Book } from '../../models/book.model';
import { BookService } from '../../services/book.service';

@Component({
  selector: 'app-book-form',
  templateUrl: './book-form.component.html',
  styleUrls: ['./book-form.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatProgressSpinnerModule
  ]
})
export class BookFormComponent implements OnInit {
  bookForm!: FormGroup;
  isEditMode = false;
  bookId?: number;
  isLoading = false;
  submitInProgress = false;

  constructor(
    private fb: FormBuilder,
    private bookService: BookService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.initForm();
    
    // Check if we're in edit mode
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.isEditMode = true;
        this.bookId = +id;
        this.loadBookData(this.bookId);
      }
    });
  }

  initForm(): void {
    this.bookForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(100)]],
      author: ['', [Validators.required, Validators.maxLength(100)]],
      price: ['', [Validators.required, Validators.min(0.01)]],
      description: ['', Validators.maxLength(500)]
    });
  }

  loadBookData(id: number): void {
    this.isLoading = true;
    this.bookService.getBookById(id).subscribe({
      next: (book) => {
        this.bookForm.patchValue({
          title: book.title,
          author: book.author,
          price: book.price,
          description: book.description
        });
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading book', error);
        this.snackBar.open('Error loading book data. Please try again.', 'Close', {
          duration: 3000
        });
        this.isLoading = false;
        this.router.navigate(['/books']);
      }
    });
  }

  onSubmit(): void {
    if (this.bookForm.invalid) {
      return;
    }

    this.submitInProgress = true;
    const bookData: Book = this.bookForm.value;

    if (this.isEditMode && this.bookId) {
      this.bookService.updateBook(this.bookId, bookData).subscribe({
        next: () => {
          this.snackBar.open('Book updated successfully', 'Close', {
            duration: 3000
          });
          this.submitInProgress = false;
          this.router.navigate(['/books']);
        },
        error: (error) => {
          console.error('Error updating book', error);
          this.snackBar.open('Error updating book. Please try again.', 'Close', {
            duration: 3000
          });
          this.submitInProgress = false;
        }
      });
    } else {
      this.bookService.createBook(bookData).subscribe({
        next: () => {
          this.snackBar.open('Book created successfully', 'Close', {
            duration: 3000
          });
          this.submitInProgress = false;
          this.router.navigate(['/books']);
        },
        error: (error) => {
          console.error('Error creating book', error);
          this.snackBar.open('Error creating book. Please try again.', 'Close', {
            duration: 3000
          });
          this.submitInProgress = false;
        }
      });
    }
  }

  get title() { return this.bookForm.get('title'); }
  get author() { return this.bookForm.get('author'); }
  get price() { return this.bookForm.get('price'); }
  get description() { return this.bookForm.get('description'); }
}