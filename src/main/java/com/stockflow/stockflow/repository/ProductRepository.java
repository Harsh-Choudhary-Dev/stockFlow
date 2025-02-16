package com.stockflow.stockflow.repository;

import com.stockflow.stockflow.models.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    @Query(value = "SELECT * FROM products WHERE stock_quantity < low_stock_threshold", nativeQuery = true)
    List<Product> findProductsWithLowStock();

    @Query(value = "SELECT p.name, p.added_date FROM products p ORDER BY p.added_date DESC limit 7", nativeQuery = true)
    List<Object[]> findRecentProducts();
}
