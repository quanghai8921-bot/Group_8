package com.group8.backend.config;

import com.group8.backend.model.*;
import com.group8.backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

// import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.HashSet;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private MerchantRepository merchantRepository;

    @Autowired
    private MenuCategoryRepository menuCategoryRepository;

    @Autowired
    private FoodItemRepository foodItemRepository;

    @Override
    public void run(String... args) throws Exception {
        // Check for users
        if (userRepository.count() == 0) {
            seedUserData();
        }

        // Check for categories (Independent of users)
        long catCount = menuCategoryRepository.count();
        System.out.println("📊 Initializer: Found " + catCount + " categories in DB.");
        if (catCount == 0) {
            seedCategoryData();
        } else {
            System.out.println("ℹ️ Skipping category seeding as " + catCount + " already exist.");
        }

        System.out.println("\n====================================");
        System.out.println("✨ Data initialization check completed!");
        System.out.println("====================================\n");
    }

    private void seedCategoryData() {
        System.out.println("🌱 Seeding default categories...");
        String[] catNames = {"Đồ ăn", "Thức uống", "Bánh kem", "Tráng miệng", "Đồ chay", "Pizza/Burger", "Món lẩu", "Sushi", "Mì", "Phở", "Bún", "Cơm hộp"};
        for (int i = 0; i < catNames.length; i++) {
            MenuCategory cat = new MenuCategory();
            cat.setCategoryId("CAT" + String.format("%03d", i + 1));
            cat.setCategoryName(catNames[i]);
            menuCategoryRepository.save(cat);
        }
        System.out.println("✅ Seeded " + catNames.length + " categories.");
    }

    private void seedUserData() {
        System.out.println("🔄 Initializing sample user/merchant data...");

        // 1. Create User - Customer
        User customer = new User();
        customer.setUserId("CUST001");
        customer.setFullName("John Doe");
        customer.setBirthDate(java.sql.Date.valueOf(LocalDate.of(1990, 5, 15)));
        customer.setPhoneNumber("0912345678");
        customer.setEmail("john@example.com");
        customer.setPassword("password123");
        customer.setAddressDelivery("123 Main Street, District 1");
        customer.setShopeeCoins(0L);
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
        merchantUser.setPassword("merchant123");
        merchantUser.setAddressDelivery("456 Pizza Street, District 3");
        merchantUser.setShopeeCoins(0L);
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
        merchant.setActiveStatus(true);
        merchant.setShopType("Pizza");
        merchant.setRating((byte) 5);
        merchant.setOptionToppings(new HashSet<>());
        merchant.setCarts(new HashSet<>());
        merchant.setOrders(new HashSet<>());
        merchantRepository.save(merchant);
        System.out.println("✅ Created merchant store: PIZZA001 (Delicious Pizza)");

        // 4. Create Menu Category
        MenuCategory category = new MenuCategory();
        category.setCategoryId("CAT001");
        category.setCategoryName("Pizzas");
        category.setFoodItems(new HashSet<>());
        menuCategoryRepository.save(category);
        System.out.println("✅ Created menu category: CAT001 (Pizzas)");

        // 5. Create Food Items
        // Food 1
        FoodItem food1 = new FoodItem();
        food1.setFoodId("FOOD001");
        food1.setMenuCategory(category);
        food1.setMerchant(merchant);
        food1.setFoodName("Margherita Pizza");
        food1.setOriginalPrice(150000L);
        food1.setSalePrice(120000L);
        food1.setFoodImage("https://example.com/margherita.jpg");
        food1.setDescriptions("Classic tomato, mozzarella and basil pizza");
        food1.setFoodStatus(1);
        food1.setOptionToppings(new HashSet<>());
        food1.setCartItems(new HashSet<>());
        food1.setOrderDetails(new HashSet<>());
        foodItemRepository.save(food1);
        System.out.println("✅ Created food item: FOOD001 (Margherita Pizza)");

        // Food 2
        FoodItem food2 = new FoodItem();
        food2.setFoodId("FOOD002");
        food2.setMenuCategory(category);
        food2.setMerchant(merchant);
        food2.setFoodName("Pepperoni Pizza");
        food2.setOriginalPrice(180000L);
        food2.setSalePrice(150000L);
        food2.setFoodImage("https://example.com/pepperoni.jpg");
        food2.setDescriptions("Delicious pepperoni with extra cheese");
        food2.setFoodStatus(1);
        food2.setOptionToppings(new HashSet<>());
        food2.setCartItems(new HashSet<>());
        food2.setOrderDetails(new HashSet<>());
        foodItemRepository.save(food2);
        System.out.println("✅ Created food item: FOOD002 (Pepperoni Pizza)");

        // Food 3
        FoodItem food3 = new FoodItem();
        food3.setFoodId("FOOD003");
        food3.setMenuCategory(category);
        food3.setMerchant(merchant);
        food3.setFoodName("Vegetarian Pizza");
        food3.setOriginalPrice(140000L);
        food3.setSalePrice(110000L);
        food3.setFoodImage("https://example.com/vegetarian.jpg");
        food3.setDescriptions("Fresh vegetables and herbs on thin crust");
        food3.setFoodStatus(1);
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
