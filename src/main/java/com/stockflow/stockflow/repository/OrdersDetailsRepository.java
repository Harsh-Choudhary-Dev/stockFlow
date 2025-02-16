package com.stockflow.stockflow.repository;

import com.stockflow.stockflow.models.OrderDetails;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrdersDetailsRepository extends JpaRepository<OrderDetails, String> {

    @Query(value = "SELECT o.order_id, oi.product_id, p.name AS product_name, oi.quantity, oi.price, p.category_id, " +
            "c.name AS category_name, o.order_date, o.status, cu.first_name AS customer_first_name " +
            "FROM orders o " +
            "JOIN order_items oi ON o.order_id = oi.order_id " +
            "JOIN products p ON oi.product_id = p.product_id " +
            "JOIN categories c ON p.category_id = c.category_id " +
            "JOIN customers cu ON o.customer_id = cu.customer_id",
            nativeQuery = true)
    List<OrderDetails> fetchAllOrdersWithCustomerDetails();
}
