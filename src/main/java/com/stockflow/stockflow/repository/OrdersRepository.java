package com.stockflow.stockflow.repository;

import com.stockflow.stockflow.models.OrderDetails;
import com.stockflow.stockflow.models.Orders;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrdersRepository extends JpaRepository<Orders, Long> {
    @Query(value = "SELECT * FROM orders WHERE status = 'completed'", nativeQuery = true)

    List<Orders> findCompletedOrders();

    @Query(value = "SELECT o.product_id, c.name AS category_name, SUM(o.total_amount) AS total_amount " +
            "FROM orders o " +
            "JOIN products p ON o.product_id = p.product_id " +
            "JOIN categories c ON p.category_id = c.category_id " +
            "GROUP BY o.product_id, c.name " +
            "ORDER BY total_amount DESC " +
            "LIMIT 7", nativeQuery = true)
    List<Object[]> findTop7ProductsWithCategoryAndTotalAmount();

    @Query(value = "SELECT * FROM orders WHERE status = 'completed' ORDER BY order_date DESC LIMIT 7", nativeQuery = true)
    List<Orders> findRecentCompletedOrders();

    @Query(value = "SELECT SUM(total_amount) FROM orders WHERE status = 'completed'", nativeQuery = true)
    Double getTotalAmountForCompletedOrders();


    @Query(value = "SELECT COUNT(*) FROM orders", nativeQuery = true)
    Long getTotalOrderCount();

}
