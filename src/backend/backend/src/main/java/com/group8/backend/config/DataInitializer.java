package com.group8.backend.config;

import com.group8.backend.model.*;
import com.group8.backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.HashSet;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private MerchantRepository merchantRepository;

    @Autowired
    private MenuCategoryRepository menuCategoryRepository;

    @Autowired
    private FoodItemRepository foodItemRepository;

    @Override
    public void run(String... args) throws Exception {
        // Check if data already exists
        if (userRepository.count() > 0) {
            System.out.println("📊 Database already has data. Skipping initialization.");
            return;
        }

        System.out.println("\n====================================");
        System.out.println("🔄 Initializing sample data...");
        System.out.println("====================================\n");

        // 1. Create User - Customer
        User customer = new User();
        customer.setUserId("CUST001");
        customer.setFullName("John Doe");
        customer.setBirthDate(java.sql.Date.valueOf(LocalDate.of(1990, 5, 15)));
        customer.setPhoneNumber("0912345678");
        customer.setEmail("john@example.com");
        customer.setPasswords("password123");
        customer.setAddressDelivery("123 Main Street, District 1");
        customer.setShopeeCoins(0);
        customer.setRoles(new HashSet<>());
        userRepository.save(customer);
        System.out.println("✅ Created customer user: CUST001 (john@example.com)");

        // 2. Create User - Merchant
        User merchantUser = new User();
        merchantUser.setUserId("MERCH001");
        merchantUser.setFullName("Pizza Shop Owner");
        merchantUser.setBirthDate(java.sql.Date.valueOf(LocalDate.of(1985, 3, 20)));
        merchantUser.setPhoneNumber("0987654321");
        merchantUser.setEmail("merchant@pizzashop.com");
        merchantUser.setPasswords("merchant123");
        merchantUser.setAddressDelivery("456 Pizza Street, District 3");
        merchantUser.setShopeeCoins(0);
        merchantUser.setRoles(new HashSet<>());
        userRepository.save(merchantUser);
        System.out.println("✅ Created merchant user: MERCH001 (merchant@pizzashop.com)");

        // 3. Create Merchant
        Merchant merchant = new Merchant();
        merchant.setMerchantId("PIZZA001");
        merchant.setUser(merchantUser);
        merchant.setStoreName("Delicious Pizza");
        merchant.setStoreAddress("456 Pizza Street, District 3");
        merchant.setOpenTime(LocalTime.of(10, 0));
        merchant.setCloseTime(LocalTime.of(23, 0));
        merchant.setActiveStatus((byte) 1);
        merchant.setShopType("Pizza");
        merchant.setRating((byte) 5);
        merchant.setMenuCategories(new HashSet<>());
        merchant.setOptionToppings(new HashSet<>());
        merchant.setCarts(new HashSet<>());
        merchant.setOrders(new HashSet<>());
        merchantRepository.save(merchant);
        System.out.println("✅ Created merchant store: PIZZA001 (Delicious Pizza)");

        // 4. Create Menu Category
        MenuCategory category = new MenuCategory();
        category.setCategoryId("CAT001");
        category.setMerchant(merchant);
        category.setNameCategory("Pizzas");
        category.setFoodItems(new HashSet<>());
        menuCategoryRepository.save(category);
        System.out.println("✅ Created menu category: CAT001 (Pizzas)");

        // 5. Create Food Items
        // Food 1
        FoodItem food1 = new FoodItem();
        food1.setFoodId("FOOD001");
        food1.setMenuCategory(category);
        food1.setFoodName("Margherita Pizza");
        food1.setOriginalPrice(new BigDecimal("150000"));
        food1.setSalePrice(new BigDecimal("120000"));
        food1.setFoodImage("https://example.com/margherita.jpg");
        food1.setDescriptions("Classic tomato, mozzarella and basil pizza");
        food1.setStatusFood("Available");
        food1.setOptionToppings(new HashSet<>());
        food1.setCartItems(new HashSet<>());
        food1.setOrderDetails(new HashSet<>());
        foodItemRepository.save(food1);
        System.out.println("✅ Created food item: FOOD001 (Margherita Pizza)");

        // Food 2
        FoodItem food2 = new FoodItem();
        food2.setFoodId("FOOD002");
        food2.setMenuCategory(category);
        food2.setFoodName("Pepperoni Pizza");
        food2.setOriginalPrice(new BigDecimal("180000"));
        food2.setSalePrice(new BigDecimal("150000"));
        food2.setFoodImage("https://example.com/pepperoni.jpg");
        food2.setDescriptions("Delicious pepperoni with extra cheese");
        food2.setStatusFood("Available");
        food2.setOptionToppings(new HashSet<>());
        food2.setCartItems(new HashSet<>());
        food2.setOrderDetails(new HashSet<>());
        foodItemRepository.save(food2);
        System.out.println("✅ Created food item: FOOD002 (Pepperoni Pizza)");

        // Food 3
        FoodItem food3 = new FoodItem();
        food3.setFoodId("FOOD003");
        food3.setMenuCategory(category);
        food3.setFoodName("Vegetarian Pizza");
        food3.setOriginalPrice(new BigDecimal("140000"));
        food3.setSalePrice(new BigDecimal("110000"));
        food3.setFoodImage("https://example.com/vegetarian.jpg");
        food3.setDescriptions("Fresh vegetables and herbs on thin crust");
        food3.setStatusFood("Available");
        food3.setOptionToppings(new HashSet<>());
        food3.setCartItems(new HashSet<>());
        food3.setOrderDetails(new HashSet<>());
        foodItemRepository.save(food3);
        System.out.println("✅ Created food item: FOOD003 (Vegetarian Pizza)");

        System.out.println("\n====================================");
        System.out.println("✨ Sample data initialization completed!");
        System.out.println("====================================");
        System.out.println("\n📋 Summary of initialized data:");
        System.out.println("  • 1 Customer user: CUST001");
        System.out.println("  • 1 Merchant user: MERCH001");
        System.out.println("  • 1 Merchant store: PIZZA001");
        System.out.println("  • 1 Menu category: CAT001");
        System.out.println("  • 3 Food items (Available): FOOD001, FOOD002, FOOD003");
        System.out.println("====================================\n");
    }
}
