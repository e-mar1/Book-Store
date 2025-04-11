package com.mr1.book_store.controller;

import com.mr1.book_store.model.Book;
import com.mr1.book_store.service.BookService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/books")
@CrossOrigin(origins = "http://localhost:4200") // For Angular frontend
public class BookController {

    private final BookService bookService;

    public BookController(BookService bookService) {
        this.bookService = bookService;
    }

    /**
     * Get all books
     * GET /api/books
     * @return List of all books
     */
    @GetMapping
    public ResponseEntity<List<Book>> getAllBooks() {
        List<Book> books = bookService.getAllBooks();
        return new ResponseEntity<>(books, HttpStatus.OK);
    }

    /**
     * Get a book by ID
     * GET /api/books/{id}
     * @param id Book ID
     * @return Book if found, 404 Not Found otherwise
     */
    @GetMapping("/{id}")
    public ResponseEntity<Book> getBookById(@PathVariable Long id) {
        Optional<Book> book = bookService.getBookById(id);
        return book.map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                   .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    /**
     * Create a new book
     * POST /api/books
     * @param book Book data in request body
     * @return Created book with generated ID
     */
    @PostMapping
    public ResponseEntity<Book> createBook(@Valid @RequestBody Book book) {
        // Ensure a new book is created, not an update
        book.setId(null);
        Book savedBook = bookService.saveBook(book);
        return new ResponseEntity<>(savedBook, HttpStatus.CREATED);
    }

    /**
     * Update an existing book
     * PUT /api/books/{id}
     * @param id Book ID to update
     * @param book Updated book data
     * @return Updated book or 404 Not Found
     */
    @PutMapping("/{id}")
    public ResponseEntity<Book> updateBook(@PathVariable Long id, @Valid @RequestBody Book book) {
        if (!bookService.existsById(id)) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        
        book.setId(id);
        Book updatedBook = bookService.saveBook(book);
        return new ResponseEntity<>(updatedBook, HttpStatus.OK);
    }

    /**
     * Delete a book by ID
     * DELETE /api/books/{id}
     * @param id Book ID to delete
     * @return 204 No Content on success, 404 Not Found if book doesn't exist
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBook(@PathVariable Long id) {
        if (!bookService.existsById(id)) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        
        bookService.deleteBook(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    /**
     * Search books by title
     * GET /api/books/search/title?query=yourTitle
     * @param query Title search term
     * @return List of matching books
     */
    @GetMapping("/search/title")
    public ResponseEntity<List<Book>> searchBooksByTitle(@RequestParam String query) {
        List<Book> books = bookService.findBooksByTitle(query);
        return new ResponseEntity<>(books, HttpStatus.OK);
    }

    /**
     * Search books by author
     * GET /api/books/search/author?query=yourAuthor
     * @param query Author search term
     * @return List of matching books
     */
    @GetMapping("/search/author")
    public ResponseEntity<List<Book>> searchBooksByAuthor(@RequestParam String query) {
        List<Book> books = bookService.findBooksByAuthor(query);
        return new ResponseEntity<>(books, HttpStatus.OK);
    }

    /**
     * Search books by price range
     * GET /api/books/search/price?min=10&max=50
     * @param min Minimum price
     * @param max Maximum price
     * @return List of books within price range
     */
    @GetMapping("/search/price")
    public ResponseEntity<List<Book>> searchBooksByPriceRange(
            @RequestParam(required = false, defaultValue = "0") Double min,
            @RequestParam(required = false, defaultValue = "1000000") Double max) {
        List<Book> books = bookService.findBooksByPriceRange(min, max);
        return new ResponseEntity<>(books, HttpStatus.OK);
    }
}