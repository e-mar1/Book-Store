package com.mr1.book_store.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.mr1.book_store.model.Book;

import java.util.List;

@Repository
public interface BookRepository extends JpaRepository<Book, Long> {
    
    List<Book> findByTitleContainingIgnoreCase(String title);
    List<Book> findByAuthorContainingIgnoreCase(String author);
    List<Book> findByPriceLessThanEqual(Double maxPrice); 
    List<Book> findByPriceGreaterThanEqual(Double minPrice);
    List<Book> findByPriceBetween(Double minPrice, Double maxPrice);
}