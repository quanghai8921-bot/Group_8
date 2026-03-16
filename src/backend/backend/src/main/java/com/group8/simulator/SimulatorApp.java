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
 *
 * This is a standalone Java main class; run it separately from the backend server.
 */
public class SimulatorApp {

    private static final String BASE_URL = "http://localhost:4040/api";
    private static final ObjectMapper MAPPER = new ObjectMapper();
    private static final RestTemplate REST = new RestTemplate();

    // Sample accounts / drivers – adjust to match data in your DB
    private static final String SAMPLE_USER_EMAIL = "user1@example.com";
    private static final String SAMPLE_USER_PASSWORD = "123456";
    private static final List<String> SAMPLE_DRIVER_IDS = Arrays.asList("DRV0001", "DRV0002", "DRV0003");

    public static void main(String[] args) throws Exception {
        System.out.println("=== ShopeeFood Simulator started ===");

        ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(2);

        // Driver simulator: update location every 5 seconds
        scheduler.scheduleAtFixedRate(
                SimulatorApp::runDriverLocationTick,
                0,
                5,
                TimeUnit.SECONDS
        );

        // Order simulator: simple stress test after short delay
        scheduler.schedule(
                () -> {
                    try {
                        runOrderStressTest(20);
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                },
                3,
                TimeUnit.SECONDS
        );

        // Keep main thread alive
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

    // Rough bounding box around Quy Nhơn
    private static double[] randomCoordinateAroundQuyNhon() {
        double baseLat = 13.7768;
        double baseLng = 109.2237;
        double latOffset = (Math.random() - 0.5) * 0.02;  // ~2km
        double lngOffset = (Math.random() - 0.5) * 0.02;
        return new double[]{baseLat + latOffset, baseLng + lngOffset};
    }

    // ===================== ORDER SIMULATOR =====================

    public static void runOrderStressTest(int orderCount) throws Exception {
        System.out.println("[OrderSimulator] Starting stress test with " + orderCount + " orders...");

        for (int i = 1; i <= orderCount; i++) {
            try {
                String token = loginAndGetToken();
                if (token == null) {
                    System.out.println("[OrderSimulator] Login failed, skipping order " + i);
                    continue;
                }

                // 1) Get foods
                List<Map<String, Object>> foods = fetchFoods(token);
                if (foods.isEmpty()) {
                    System.out.println("[OrderSimulator] No foods available, skipping order " + i);
                    continue;
                }

                Map<String, Object> food = foods.get(new Random().nextInt(foods.size()));
                String foodId = (String) food.get("foodId");
                String merchantId = (String) food.get("merchantId");

                // 2) Add to cart
                String cartId = addToCartAndGetCartId(token, foodId, merchantId);
                if (cartId == null) {
                    System.out.println("[OrderSimulator] Failed to add to cart, skipping order " + i);
                    continue;
                }

                // 3) Checkout
                String orderId = checkoutCart(token, cartId, merchantId);
                if (orderId != null) {
                    System.out.printf("[OrderSimulator] Order %d created successfully with ID %s%n", i, orderId);
                } else {
                    System.out.printf("[OrderSimulator] Order %d failed at checkout%n", i);
                }
            } catch (Exception e) {
                System.out.println("[OrderSimulator] Error during order " + i + ": " + e.getMessage());
            }
        }

        System.out.println("[OrderSimulator] Stress test finished.");
    }

    // ---- Login ----

    private static String loginAndGetToken() throws Exception {
        Map<String, Object> body = new HashMap<>();
        body.put("email", SAMPLE_USER_EMAIL);
        body.put("password", SAMPLE_USER_PASSWORD);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);

        ResponseEntity<String> resp = REST.postForEntity(
                BASE_URL + "/users/login",
                entity,
                String.class
        );

        if (!resp.getStatusCode().is2xxSuccessful()) {
            System.out.println("[OrderSimulator] Login failed: HTTP " + resp.getStatusCodeValue());
            return null;
        }

        JsonNode root = MAPPER.readTree(resp.getBody());
        if (!root.path("success").asBoolean(false)) {
            System.out.println("[OrderSimulator] Login failed: " + root.path("message").asText());
            return null;
        }

        JsonNode data = root.path("data");
        String userId = data.path("userId").asText(null);
        String token = data.path("token").asText(null); // nếu backend sau này có JWT

        System.out.println("[OrderSimulator] Login OK, userId=" + userId);
        return token; // có thể null nếu backend chưa trả JWT – vẫn dùng được vì các API hiện không bắt buộc Auth
    }

    // ---- Fetch foods ----

    private static List<Map<String, Object>> fetchFoods(String token) throws Exception {
        HttpHeaders headers = new HttpHeaders();
        headers.setAccept(Collections.singletonList(MediaType.APPLICATION_JSON));
        if (token != null) {
            headers.setBearerAuth(token);
        }
        HttpEntity<Void> entity = new HttpEntity<>(headers);

        ResponseEntity<String> resp = REST.exchange(
                BASE_URL + "/foods",
                HttpMethod.GET,
                entity,
                String.class
        );

        if (!resp.getStatusCode().is2xxSuccessful()) {
            System.out.println("[OrderSimulator] Fetch foods failed: HTTP " + resp.getStatusCodeValue());
            return Collections.emptyList();
        }

        JsonNode root = MAPPER.readTree(resp.getBody());
        JsonNode data = root.path("data");
        if (!data.isArray()) {
            return Collections.emptyList();
        }

        return MAPPER.convertValue(data, new TypeReference<List<Map<String, Object>>>() {});
    }

    // ---- Add to cart ----

    private static String addToCartAndGetCartId(String token, String foodId, String merchantId) throws Exception {
        // In this simple simulator we re-use the login email as an existing user; you can map it to userId if needed.
        // For now, assume backend can infer userId or you can hard-code a known userId.
        String userId = "USR0001"; // TODO: adjust to an existing user in DB

        Map<String, Object> body = new HashMap<>();
        body.put("userId", userId);
        body.put("merchantId", merchantId);
        body.put("foodId", foodId);
        body.put("quantity", 1);
        body.put("note", "Simulator order");
        body.put("toppingIds", Collections.emptyList());

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        if (token != null) {
            headers.setBearerAuth(token);
        }
        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);

        ResponseEntity<String> resp = REST.postForEntity(
                BASE_URL + "/carts/add",
                entity,
                String.class
        );

        if (!resp.getStatusCode().is2xxSuccessful()) {
            System.out.println("[OrderSimulator] Add to cart failed: HTTP " + resp.getStatusCodeValue());
            return null;
        }

        JsonNode root = MAPPER.readTree(resp.getBody());
        JsonNode data = root.path("data");
        String cartId = data.path("cartId").asText(null);
        System.out.println("[OrderSimulator] Added to cart, cartId=" + cartId +
                ", foodId=" + foodId + ", merchantId=" + merchantId);
        return cartId;
    }

    // ---- Checkout ----

    private static String checkoutCart(String token, String cartId, String merchantId) throws Exception {
        // In this simple simulator we re-use the same userId as in addToCart.
        String userId = "USR0001"; // TODO: adjust to existing user

        Map<String, Object> body = new HashMap<>();
        body.put("userId", userId);
        body.put("cartId", cartId);
        body.put("voucherId", null);
        body.put("shopeeCoinsUsed", Boolean.FALSE);
        body.put("deliveryAddress", "Simulator Address, Quy Nhon");
        body.put("paymentMethod", "COD");

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        if (token != null) {
            headers.setBearerAuth(token);
        }
        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);

        ResponseEntity<String> resp = REST.postForEntity(
                BASE_URL + "/orders/checkout",
                entity,
                String.class
        );

        if (!resp.getStatusCode().is2xxSuccessful()) {
            System.out.println("[OrderSimulator] Checkout failed: HTTP " + resp.getStatusCodeValue());
            return null;
        }

        JsonNode root = MAPPER.readTree(resp.getBody());
        JsonNode data = root.path("data");
        String orderId = data.path("orderId").asText(null);
        System.out.println("[OrderSimulator] Checkout success, orderId=" + orderId);
        return orderId;
    }
}

