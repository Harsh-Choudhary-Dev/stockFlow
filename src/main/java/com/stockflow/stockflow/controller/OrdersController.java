package com.stockflow.stockflow.controller;


import com.stockflow.stockflow.models.OrderDetails;
import com.stockflow.stockflow.models.Orders;
import com.stockflow.stockflow.service.OrdersService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/orders")
public class OrdersController {

    @Autowired
    private OrdersService ordersService;


    @GetMapping
    public List<Orders> fetchAllOrders() {
        return ordersService.getAllOrders();
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteSale(@PathVariable Long id) {
        try {
            ordersService.deleteSale(id);
            return ResponseEntity.ok("Sale deleted successfully.");
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @GetMapping("/recent-sales")
    public List<Orders> getRecentCompletedOrders() {
        return ordersService.fetchRecentsSales();
    }

    @GetMapping("/top-categories")
    public List<Map<String, Object>> getTopProducts() {
        List<Object[]> results = ordersService.getTop7Categories();

        return results.stream().map(result -> {
            return Map.of(
                    "product_id", result[0],
                    "category_name", result[1],
                    "total_amount", result[2]
            );
        }).collect(Collectors.toList());
    }

    @GetMapping("/all-stats")
    public Map<String, Object> getOverallStatistics() {
        return ordersService.getAllStats();
    }


    }
