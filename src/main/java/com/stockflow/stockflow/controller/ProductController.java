package com.stockflow.stockflow.controller;

import com.stockflow.stockflow.models.Product;
import com.stockflow.stockflow.service.ProductService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "http://127.0.0.1:5501") // Allow frontend requests
public class ProductController {

    @Autowired
    private ProductService productService;

    @GetMapping
    public List<Product> getAllProducts() {
        return productService.getAllProducts();
    }

    @GetMapping("/{id}")
    public Optional<Product> getProductById(@PathVariable Long id) {
        System.out.println(id);
        Optional<Product> product = productService.getProductById(id);
        return product;
    }

    @PostMapping
    public Product createProduct(@RequestBody Product product) {
        return productService.saveProduct(product);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/recents")
    public ResponseEntity<List<Map<String, Object>>> getOrdersWithDetails() {
        List<Object[]> result = productService.getRecentProducts();
        List<Map<String, Object>> response = result.stream().map(record -> {
            Map<String, Object> map = new HashMap<>();
            map.put("name", record[0]);
            map.put("added_date", record[1]);
            return map;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }
}
