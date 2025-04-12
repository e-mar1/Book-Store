import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Book } from '../models/book.model';

@Injectable({
  providedIn: 'root'
})
export class BookService {
  private apiUrl = 'http://localhost:8080/api/books';

  constructor(private http: HttpClient) { }

  // Get all books
  getAllBooks(): Observable<Book[]> {
    return this.http.get<Book[]>(this.apiUrl);
  }

  // Get book by id
  getBookById(id: number): Observable<Book> {
    return this.http.get<Book>(`${this.apiUrl}/${id}`);
  }

  // Create a new book
  createBook(book: Book): Observable<Book> {
    return this.http.post<Book>(this.apiUrl, book);
  }

  // Update an existing book
  updateBook(id: number, book: Book): Observable<Book> {
    return this.http.put<Book>(`${this.apiUrl}/${id}`, book);
  }

  // Delete a book
  deleteBook(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Search books by title
  searchBooksByTitle(query: string): Observable<Book[]> {
    return this.http.get<Book[]>(`${this.apiUrl}/search/title?query=${query}`);
  }

  // Search books by author
  searchBooksByAuthor(query: string): Observable<Book[]> {
    return this.http.get<Book[]>(`${this.apiUrl}/search/author?query=${query}`);
  }

  // Search books by price range
  searchBooksByPriceRange(min: number, max: number): Observable<Book[]> {
    return this.http.get<Book[]>(`${this.apiUrl}/search/price?min=${min}&max=${max}`);
  }
}