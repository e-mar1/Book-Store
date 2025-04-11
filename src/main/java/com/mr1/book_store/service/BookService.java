package com.mr1.book_store.service;

import com.mr1.book_store.model.Book;
import com.mr1.book_store.repository.BookRepository;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class BookService {

    private final BookRepository bookRepository;

    public BookService(BookRepository bookRepository) {
        this.bookRepository = bookRepository;
    }

    /**
     * Get all books
     * @return List of all books
     */
    public List<Book> getAllBooks() {
        return bookRepository.findAll();
    }

    /**
     * Get a book by ID
     * @param id Book ID
     * @return Book if found, otherwise empty
     */
    public Optional<Book> getBookById(Long id) {
        return bookRepository.findById(id);
    }

    /**
     * Save a new book or update an existing one
     * @param book Book to save
     * @return Saved book with generated ID
     */
    public Book saveBook(Book book) {
        return bookRepository.save(book);
    }

    /**
     * Delete a book by ID
     * @param id Book ID to delete
     */
    public void deleteBook(Long id) {
        bookRepository.deleteById(id);
    }

    /**
     * Check if a book exists by ID
     * @param id Book ID
     * @return true if book exists, false otherwise
     */
    public boolean existsById(Long id) {
        return bookRepository.existsById(id);
    }

    /**
     * Find books by title (case-insensitive partial match)
     * @param title Title to search for
     * @return List of books matching the title
     */
    public List<Book> findBooksByTitle(String title) {
        return bookRepository.findByTitleContainingIgnoreCase(title);
    }

    /**
     * Find books by author (case-insensitive partial match)
     * @param author Author to search for
     * @return List of books matching the author
     */
    public List<Book> findBooksByAuthor(String author) {
        return bookRepository.findByAuthorContainingIgnoreCase(author);
    }

    /**
     * Find books by price range
     * @param minPrice Minimum price
     * @param maxPrice Maximum price
     * @return List of books within the price range
     */
    public List<Book> findBooksByPriceRange(Double minPrice, Double maxPrice) {
        return bookRepository.findByPriceBetween(minPrice, maxPrice);
    }
}