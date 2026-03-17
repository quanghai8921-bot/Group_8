package com.group8.simulator;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.http.*;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.time.Duration;
import java.util.*;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

/**
 * Simple simulator project (Project B) that calls Project A (Backend on port 4040).
 * It contains:
 * - Driver simulator: periodically updates driver locations around Quy Nhơn.
 * - Order simulator: logs in, fetches food list, adds to cart, and performs checkout / stress test.
 */
public class SimulatorApp {

    private static final String BASE_URL = "http://localhost:4040/api";
    private static final ObjectMapper MAPPER = new ObjectMapper();
    private static final RestTemplate REST = new RestTemplate();

    // Sample accounts / drivers – ĐÃ CẬP NHẬT THEO DATA THẬT CỦA BẠN
    private static final String SAMPLE_USER_EMAIL = "Dung@gmail.com";
    private static final String SAMPLE_USER_PASSWORD = "231205"; 
    private static final List<String> SAMPLE_DRIVER_IDS = Arrays.asList("US10155", "US10156", "US10157", "US10158");

    public static void main(String[] args) throws Exception {
        System.out.println("=== ShopeeFood Simulator started ===");

        ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(2);

        // 1. Driver simulator: update location every 5 seconds
        scheduler.scheduleAtFixedRate(
                SimulatorApp::runDriverLocationTick,
                0,
                5,
                TimeUnit.SECONDS
        );

        // 2. Order simulator: simple stress test after 3 seconds
        scheduler.schedule(
                () -> {
                    try {
                        runOrderStressTest(20);
                    } catch (Exception e) {
                        System.err.println("[OrderSimulator] Stress test fatal error: " + e.getMessage());
                    }
                },
                3,
                TimeUnit.SECONDS
        );

        // Keep main thread alive for 10 minutes
        Thread.currentThread().join(Duration.ofMinutes(10).toMillis());
    }

    // ===================== DRIVER SIMULATOR =====================

    private static void runDriverLocationTick() {
        try {
            for (String driverId : SAMPLE_DRIVER_IDS) {
                double[] coord = randomCoordinateAroundQuyNhon();

                Map<String, Object> body = new HashMap<>();
                body.put("driverId", driverId);
                body.put("latitude", BigDecimal.valueOf(coord[0]));
                body.put("longitude", BigDecimal.valueOf(coord[1]));

                HttpHeaders headers = new HttpHeaders();
                headers.setContentType(MediaType.APPLICATION_JSON);
                HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);

                ResponseEntity<String> resp = REST.exchange(
                        BASE_URL + "/drivers/location",
                        HttpMethod.POST,
                        entity,
                        String.class
                );

                if (resp.getStatusCode().is2xxSuccessful()) {
                    System.out.printf(Locale.US,
                            "[DriverSimulator] Driver %s updated location to (%.6f, %.6f)%n",
                            driverId, coord[0], coord[1]);
                } else {
                    System.out.printf(Locale.US,
                            "[DriverSimulator] Failed to update driver %s: HTTP %d%n",
                            driverId, resp.getStatusCodeValue());
                }
            }
        } catch (Exception e) {
            System.out.println("[DriverSimulator] Error: " + e.getMessage());
        }
    }

    private static double[] randomCoordinateAroundQuyNhon() {
        double baseLat = 13.7768;
        double baseLng = 109.2237;
        double latOffset = (Math.random() - 0.5) * 0.02; 
        double lngOffset = (Math.random() - 0.5) * 0.02;
        return new double[]{baseLat + latOffset, baseLng + lngOffset};
    }

    // ===================== ORDER SIMULATOR =====================

    public static void runOrderStressTest(int orderCount) throws Exception {
        System.out.println("[OrderSimulator] Starting stress test with " + orderCount + " orders...");

        for (int i = 1; i <= orderCount; i++) {
            try {
                // Đăng nhập lấy thông tin (userId + token)
                LoginResult login = login();
                if (login == null || login.userId == null || login.userId.isEmpty()) {
                    System.out.println("[OrderSimulator] Login check failed, skipping order " + i);
                    continue;
                }

                // 1) Get foods
                List<Map<String, Object>> foods = fetchFoods(login.token);
                if (foods.isEmpty()) {
                    System.out.println("[OrderSimulator] No foods available, skipping order " + i);
                    continue;
                }

                Map<String, Object> food = foods.get(new Random().nextInt(foods.size()));
                String foodId = (String) food.get("foodId");
                String merchantId = (String) food.get("merchantId");

                // 2) Add to cart
                String cartId = addToCartAndGetCartId(login.userId, login.token, foodId, merchantId);
                if (cartId == null) {
                    System.out.println("[OrderSimulator] Failed to add to cart, skipping order " + i);
                    continue;
                }

                // 3) Checkout
                String orderId = checkoutCart(login.userId, login.token, cartId, merchantId);
                if (orderId != null) {
                    System.out.printf("[OrderSimulator] Order %d created successfully with ID %s%n", i, orderId);
                } else {
                    System.out.printf("[OrderSimulator] Order %d failed at checkout%n", i);
                }
                
                // Nghỉ một chút giữa các đơn cho đỡ nghẽn
                Thread.sleep(500);

            } catch (Exception e) {
                System.out.println("[OrderSimulator] Error during order " + i + ": " + e.getMessage());
            }
        }
        System.out.println("[OrderSimulator] Stress test finished.");
    }

    // ---- Login: trả về cả userId + token ----

    private static LoginResult login() throws Exception {
        Map<String, Object> body = new HashMap<>();
        body.put("email", SAMPLE_USER_EMAIL);
        body.put("password", SAMPLE_USER_PASSWORD);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);

        try {
            ResponseEntity<String> resp = REST.postForEntity(BASE_URL + "/users/login", entity, String.class);

            if (!resp.getStatusCode().is2xxSuccessful()) {
                System.out.println("[OrderSimulator] Login HTTP Error: " + resp.getStatusCodeValue());
                return null;
            }

            JsonNode root = MAPPER.readTree(resp.getBody());

            // Hỗ trợ cả trường hợp response bọc 'data' hoặc trả trực tiếp UserResponseDTO
            JsonNode dataNode = root.has("data") ? root.path("data") : root;
            String userId = dataNode.path("userId").asText(null);
            String token = dataNode.has("token") ? dataNode.path("token").asText(null) : null;

            if (userId != null && !userId.isEmpty()) {
                System.out.println("[OrderSimulator] Login OK, userId=" + userId);
                return new LoginResult(userId, token);
            }

            System.out.println("[OrderSimulator] Login response does not contain userId");
            return null;
        } catch (Exception e) {
            System.out.println("[OrderSimulator] Login Exception: " + e.getMessage());
            return null;
        }
    }

    // Nhỏ gọn lưu kết quả login (userId + token)
    private record LoginResult(String userId, String token) {}

    // ---- Fetch foods ----

    private static List<Map<String, Object>> fetchFoods(String token) throws Exception {
        HttpHeaders headers = new HttpHeaders();
        headers.setAccept(Collections.singletonList(MediaType.APPLICATION_JSON));
        if (token != null && !token.isEmpty()) {
            headers.setBearerAuth(token);
        }
        HttpEntity<Void> entity = new HttpEntity<>(headers);

        try {
            ResponseEntity<String> resp = REST.exchange(BASE_URL + "/foods", HttpMethod.GET, entity, String.class);
            JsonNode root = MAPPER.readTree(resp.getBody());
            JsonNode data = root.has("data") ? root.get("data") : root;

            if (data.isArray()) {
                return MAPPER.convertValue(data, new TypeReference<List<Map<String, Object>>>() {});
            }
        } catch (Exception e) {
            System.out.println("[OrderSimulator] Fetch foods failed: " + e.getMessage());
        }
        return Collections.emptyList();
    }

    // ---- Add to cart ----

    private static String addToCartAndGetCartId(String userId, String token, String foodId, String merchantId) throws Exception {
        Map<String, Object> body = new HashMap<>();
        body.put("userId", userId);
        body.put("merchantId", merchantId);
        body.put("foodId", foodId);
        body.put("quantity", 1);
        body.put("note", "Simulator stress test");
        body.put("toppingIds", Collections.emptyList());

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        if (token != null && !token.isEmpty()) {
            headers.setBearerAuth(token);
        }
        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);

        try {
            ResponseEntity<String> resp = REST.postForEntity(BASE_URL + "/carts/add", entity, String.class);
            JsonNode root = MAPPER.readTree(resp.getBody());
            JsonNode data = root.has("data") ? root.get("data") : root;
            
            String cartId = data.path("cartId").asText(null);
            if (cartId != null) {
                System.out.println("[OrderSimulator] Added to cart, cartId=" + cartId);
            }
            return cartId;
        } catch (Exception e) {
            System.out.println("[OrderSimulator] Add to cart error: " + e.getMessage());
            return null;
        }
    }

    // ---- Checkout ----

    private static String checkoutCart(String userId, String token, String cartId, String merchantId) throws Exception {
        Map<String, Object> body = new HashMap<>();
        body.put("userId", userId);
        body.put("cartId", cartId);
        body.put("voucherId", null);
        body.put("shopeeCoinsUsed", false);
        body.put("deliveryAddress", "Quy Nhon Simulator Street");
        body.put("paymentMethod", "COD");

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        if (token != null && !token.isEmpty()) {
            headers.setBearerAuth(token);
        }
        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);

        try {
            ResponseEntity<String> resp = REST.postForEntity(BASE_URL + "/orders/checkout", entity, String.class);
            JsonNode root = MAPPER.readTree(resp.getBody());
            JsonNode data = root.has("data") ? root.get("data") : root;
            
            return data.path("orderId").asText(null);
        } catch (Exception e) {
            System.out.println("[OrderSimulator] Checkout error: " + e.getMessage());
            return null;
        }
    }
}