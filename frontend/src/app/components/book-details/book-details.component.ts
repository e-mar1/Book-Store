import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';

import { Book } from '../../models/book.model';
import { BookService } from '../../services/book.service';

@Component({
  selector: 'app-book-details',
  templateUrl: './book-details.component.html',
  styleUrls: ['./book-details.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule
  ]
})
export class BookDetailsComponent implements OnInit {
  book?: Book;
  isLoading = true;
  error = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private bookService: BookService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.loadBookDetails();
  }

  loadBookDetails(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.router.navigate(['/books']);
      return;
    }

    this.isLoading = true;
    this.bookService.getBookById(+id).subscribe({
      next: (book) => {
        this.book = book;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading book details', error);
        this.snackBar.open('Error loading book details. Please try again.', 'Close', {
          duration: 3000
        });
        this.isLoading = false;
        this.error = true;
      }
    });
  }

  deleteBook(): void {
    if (!this.book || !this.book.id) return;
    
    if (confirm('Are you sure you want to delete this book?')) {
      this.bookService.deleteBook(this.book.id).subscribe({
        next: () => {
          this.snackBar.open('Book deleted successfully', 'Close', {
            duration: 3000
          });
          this.router.navigate(['/books']);
        },
        error: (error) => {
          console.error('Error deleting book', error);
          this.snackBar.open('Error deleting book. Please try again.', 'Close', {
            duration: 3000
          });
        }
      });
    }
  }
}