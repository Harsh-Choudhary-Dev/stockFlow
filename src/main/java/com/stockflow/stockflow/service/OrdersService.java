package com.stockflow.stockflow.service;


import com.stockflow.stockflow.models.OrderDetails;
import com.stockflow.stockflow.models.Orders;
import com.stockflow.stockflow.models.Product;
import com.stockflow.stockflow.repository.OrdersDetailsRepository;
import com.stockflow.stockflow.repository.OrdersRepository;
import com.stockflow.stockflow.repository.ProductRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class OrdersService {

    @Autowired
    private OrdersRepository ordersRepository;

    @Autowired
    private OrdersDetailsRepository orderDetailsRepository;

    @Autowired
    private ProductRepository productRepository;


    public List<Orders> fetchRecentOrders() {
        return ordersRepository.findRecentCompletedOrders();
    }


    public List<Object[]> getTop7Categories() {
        return ordersRepository.findTop7ProductsWithCategoryAndTotalAmount();
    }

    public List<Orders>fetchRecentsSales(){
        return ordersRepository.findRecentCompletedOrders();
    }

    public void deleteSale(Long orderId) {
        if (ordersRepository.existsById(orderId)) {
            ordersRepository.deleteById(orderId);
        } else {
            throw new EntityNotFoundException("Sale with Order ID " + orderId + " not found.");
        }
    }

    public List<Orders> getAllOrders() {
        return ordersRepository.findAll();
    }

    public Map<String, Object> getAllStats() {
        Map<String, Object> stats = new HashMap<>();

        // Get total order count
        Long totalOrderCount = ordersRepository.getTotalOrderCount();
        stats.put("totalOrderCount", totalOrderCount);

        // Get products with low stock
        List<Product> lowStockProducts = productRepository.findProductsWithLowStock();
        stats.put("lowStockProducts", lowStockProducts);

        // Get total amount for completed orders
        Double totalAmountForCompletedOrders = ordersRepository.getTotalAmountForCompletedOrders();
        stats.put("totalAmountForCompletedOrders", totalAmountForCompletedOrders);

        return stats;
    }
}
