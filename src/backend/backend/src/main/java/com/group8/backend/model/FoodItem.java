package com.group8.backend.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.NotFound;
import org.hibernate.annotations.NotFoundAction;
import java.util.Set;

@Entity
@Table(name = "FoodItems")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class FoodItem {
    @Id
    @Column(name = "FoodId", length = 10)
    private String foodId;

    // SỬA: Thêm NotFoundAction.IGNORE để tránh lỗi 500 khi CategoryID không tồn tại
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "CategoryId", nullable = true) // Để true để linh hoạt dữ liệu
    @NotFound(action = NotFoundAction.IGNORE) 
    private MenuCategory menuCategory;

    // SỬA: Tương tự cho Merchant để app chạy bền bỉ hơn
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "MerchantId", nullable = true)
    @NotFound(action = NotFoundAction.IGNORE)
    private Merchant merchant;

    @Column(name = "FoodName", length = 50, nullable = false)
    private String foodName;

    @Column(name = "OriginalPrice")
    private Long originalPrice;

    @Column(name = "SalePrice")
    private Long salePrice;

    @Column(name = "FoodImage", length = 255)
    private String foodImage;

    @Column(name = "Descriptions", length = 255)
    private String descriptions;

    @Column(name = "FoodStatus", nullable = false)
    private Boolean foodStatus = true;

    // // Thêm cột tồn kho để phục vụ Simulator trừ kho (như đã trao đổi ở bước trước)
    // @Column(name = "StockQuantity")
    // private Integer stockQuantity = 100;

    // Relationships
    @ManyToMany
    @JoinTable(
        name = "Food_Topping_Mapping",
        joinColumns = @JoinColumn(name = "FoodId"),
        inverseJoinColumns = @JoinColumn(name = "ToppingId")
    )
    private Set<OptionTopping> optionToppings;

    @OneToMany(mappedBy = "foodItem", cascade = CascadeType.ALL)
    private Set<CartItem> cartItems;

    @OneToMany(mappedBy = "foodItem", cascade = CascadeType.ALL)
    private Set<OrderDetail> orderDetails;
}