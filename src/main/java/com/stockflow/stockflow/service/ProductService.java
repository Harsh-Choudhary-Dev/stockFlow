package com.stockflow.stockflow.service;

import com.stockflow.stockflow.models.Product;
import com.stockflow.stockflow.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public Optional<Product> getProductById(Long id) {
        return productRepository.findById(id);
    }

    public Product saveProduct(Product product) {
        System.out.println(product);
        return productRepository.save(product);
    }

    public void deleteProduct(Long id) {
        productRepository.deleteById(id);
    }

    public List<Product> getProductsWithLowStock() {
        return productRepository.findProductsWithLowStock();
    }


    public List<Object[]> getRecentProducts() {
        return productRepository.findRecentProducts();
    }
}
