package com.stockflow.stockflow.models;

import jakarta.persistence.*;
import java.time.LocalDateTime;


@Entity
@Table(name = "products")
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long product_id;

    @Column(nullable = false)
    private String name;

    private String description;

    public Double getBuying_price() {
        return buying_price;
    }

    public void setBuying_price(Double buying_price) {
        this.buying_price = buying_price;
    }

    public Double getSelling_price() {
        return selling_price;
    }

    public void setSelling_price(Double selling_price) {
        this.selling_price = selling_price;
    }

    private Double buying_price;
    private Double selling_price;


    public Long getProduct_id() {
        return product_id;
    }

    public void setProduct_id(Long product_id) {
        this.product_id = product_id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }


    public Category getCategory() {
        return category;
    }

    public void setCategory(Category category) {
        this.category = category;
    }

    public Integer getStock_quantity() {
        return stock_quantity;
    }

    public void setStock_quantity(Integer stock_quantity) {
        this.stock_quantity = stock_quantity;
    }

    public Integer getLow_stock_threshold() {
        return low_stock_threshold;
    }

    public void setLow_stock_threshold(Integer low_stock_threshold) {
        this.low_stock_threshold = low_stock_threshold;
    }

    public LocalDateTime getAddedDate() {
        return addedDate;
    }

    public void setAddedDate(LocalDateTime addedDate) {
        this.addedDate = addedDate;
    }

    @ManyToOne
    @JoinColumn(name = "category_id")
    private Category category;

    private Integer stock_quantity = 0;

    private Integer low_stock_threshold = 5;

    @Column(name = "added_date", updatable = false)
    private LocalDateTime addedDate = LocalDateTime.now();
}
