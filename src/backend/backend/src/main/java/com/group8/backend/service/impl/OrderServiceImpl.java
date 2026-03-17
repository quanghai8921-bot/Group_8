package com.group8.backend.service.impl;

import com.group8.backend.dto.OrderRequestDTO;
import com.group8.backend.dto.OrderResponseDTO;
import com.group8.backend.dto.CheckoutRequestDTO;
import com.group8.backend.dto.CheckoutResponseDTO;
import com.group8.backend.model.*;
import com.group8.backend.repository.*;
import com.group8.backend.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class OrderServiceImpl implements OrderService {

    @Autowired
    private OrderRepository orderRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private MerchantRepository merchantRepository;
    @Autowired
    private DriverRepository driverRepository;
    @Autowired
    private VoucherRepository voucherRepository;
    @Autowired
    private CartRepository cartRepository;
    @Autowired
    private CartItemRepository cartItemRepository;
    @Autowired
    private OrderDetailRepository orderDetailRepository;
    @Autowired
    private CartItemToppingRepository cartItemToppingRepository;
    @Autowired
    private PaymentRepository paymentRepository;
    @Autowired
    private OrderDetailToppingRepository orderDetailToppingRepository;

    @Override
    public OrderResponseDTO createOrder(OrderRequestDTO dto) {
        User user = userRepository.findById(dto.getUserId()).orElseThrow(() -> new RuntimeException("User not found"));
        Merchant merchant = merchantRepository.findById(dto.getMerchantId()).orElseThrow(() -> new RuntimeException("Merchant not found"));

        Order order = new Order();
        order.setUser(user);
        order.setMerchant(merchant);
        order.setOrderTime(LocalDateTime.now());
        order.setFoodAmount(dto.getFoodAmount());
        order.setShippingFee(dto.getShippingFee());
        
        order.setFoodDiscount(dto.getDiscountAmount() != null ? dto.getDiscountAmount() : 0L);
        order.setShipDiscount(0L);
        
        order.setOrderStatus(1); 
        order.setDeliveryAddress(dto.getDeliveryAddress());

        if (dto.getDriverId() != null) {
            driverRepository.findById(dto.getDriverId()).ifPresent(order::setDriver);
        }
        if (dto.getVoucherId() != null) {
            if (orderRepository.existsByUser_UserIdAndVoucher_VoucherId(user.getUserId(), dto.getVoucherId())) {
                throw new RuntimeException("Mỗi người dùng chỉ được sử dụng mã giảm giá này một lần");
            }
            voucherRepository.findById(dto.getVoucherId()).ifPresent(v -> {
                order.setVoucher(v);
                // Decrement usage if active
                if (v.getIsActive() && v.getMaxUsage() > 0) {
                    v.setMaxUsage(v.getMaxUsage() - 1);
                    if (v.getMaxUsage() == 0) {
                        v.setIsActive(false);
                    }
                    voucherRepository.save(v);
                }
            });
        }

        Order savedOrder = orderRepository.save(order);
        return convertToResponseDTO(savedOrder);
    }

    @Override
    @Transactional
    public OrderResponseDTO createOrderFromCart(com.group8.backend.dto.PlaceOrderDTO dto) {
        User user = userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        Merchant merchant = merchantRepository.findById(dto.getMerchantId())
                .orElseThrow(() -> new RuntimeException("Merchant not found"));
        Cart cart = cartRepository.findByUser_UserIdAndMerchant_MerchantId(dto.getUserId(), dto.getMerchantId())
                .orElseThrow(() -> new RuntimeException("Cart not found"));

        List<CartItem> cartItems = cartItemRepository.findByCart_CartId(cart.getCartId());
        if (cartItems == null || cartItems.isEmpty()) {
            throw new RuntimeException("Cart is empty");
        }

        long foodAmount = cart.getSubtotalPrice();

        Voucher appliedVoucher = null;
        if (dto.getVoucherCode() != null && !dto.getVoucherCode().isBlank()) {
            appliedVoucher = voucherRepository.findByVoucherCode(dto.getVoucherCode())
                    .orElseThrow(() -> new RuntimeException("Voucher not found"));
            
            if (orderRepository.existsByUser_UserIdAndVoucher_VoucherId(user.getUserId(), appliedVoucher.getVoucherId())) {
                throw new RuntimeException("Mỗi người dùng chỉ được sử dụng mã giảm giá này một lần");
            }
        }
        long discountFromVoucher = appliedVoucher != null ? appliedVoucher.getDiscountValue() : 0L;
        long shippingFee = dto.getShippingFee().longValue();

        Order order = new Order();
        order.setUser(user);
        order.setMerchant(merchant);
        order.setOrderTime(LocalDateTime.now());
        order.setFoodAmount(foodAmount);
        order.setShippingFee(shippingFee);
        order.setOrderStatus(1); // 1: Chờ xác nhận
        order.setDeliveryAddress(dto.getDeliveryAddress());
        order.setContactPhone(dto.getContactPhone());
        order.setCustomerNote(dto.getCustomerNote());

        if (Boolean.TRUE.equals(dto.getShopeeXuUsed()) && user.getShopeeCoins() > 0) {
            long maxRedeemable = 15000L; // Match frontend mock for now
            long coinsToUse = Math.min(Math.min(user.getShopeeCoins(), foodAmount), maxRedeemable);
            order.setFoodDiscount(discountFromVoucher + coinsToUse);
            user.setShopeeCoins(user.getShopeeCoins() - coinsToUse);
            userRepository.save(user);
        } else {
            order.setFoodDiscount(discountFromVoucher);
        }

        if (appliedVoucher != null) {
            order.setVoucher(appliedVoucher);
            // Decrement usage
            if (appliedVoucher.getIsActive() && appliedVoucher.getMaxUsage() > 0) {
                appliedVoucher.setMaxUsage(appliedVoucher.getMaxUsage() - 1);
                if (appliedVoucher.getMaxUsage() == 0) {
                    appliedVoucher.setIsActive(false);
                }
                voucherRepository.save(appliedVoucher);
            }
        }

        Order savedOrder = orderRepository.save(order);

        for (CartItem ci : cartItems) {
            OrderDetail od = new OrderDetail();
            od.setOrder(savedOrder);
            od.setFoodItem(ci.getFoodItem());
            od.setQuantity(ci.getQuantity());
            long unitPrice = ci.getFoodItem().getSalePrice() != null
                    ? ci.getFoodItem().getSalePrice()
                    : ci.getFoodItem().getOriginalPrice();
            od.setUnitPrice(unitPrice);

            OrderDetail savedDetail = orderDetailRepository.save(od);

            if (ci.getCartItemToppings() != null) {
                for (CartItemTopping ct : ci.getCartItemToppings()) {
                    OrderDetailTopping odt = new OrderDetailTopping();
                    odt.setOrderDetail(savedDetail);
                    odt.setOptionTopping(ct.getOptionTopping());
                    odt.setPrice(ct.getOptionTopping().getPrice());
                    orderDetailToppingRepository.save(odt);
                }
            }
        }

        long finalAmount = foodAmount + shippingFee - discountFromVoucher;

        String pm = dto.getPaymentMethod();
        String pmDisplay = "COD";
        if (pm != null && pm.equalsIgnoreCase("bank")) pmDisplay = "BANK";

        Payment payment = new Payment();
        payment.setOrder(savedOrder);
        payment.setAmount(finalAmount);
        payment.setPaymentMethod(pmDisplay);
        payment.setPaymentDate(LocalDateTime.now());
        payment.setStatus(pm != null && pm.equalsIgnoreCase("bank") ? "success" : "pending");
        paymentRepository.save(payment);

        for (CartItem ci : cartItems) {
            cartItemRepository.delete(ci);
        }
        cartRepository.delete(cart);

        return convertToResponseDTO(savedOrder);
    }

    @Override
    @Transactional
    public CheckoutResponseDTO checkout(CheckoutRequestDTO dto) {
        User user = userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        Cart cart = cartRepository.findById(dto.getCartId())
                .orElseThrow(() -> new RuntimeException("Cart not found"));

        List<CartItem> cartItems = cartItemRepository.findByCart_CartId(dto.getCartId());
        if (cartItems == null || cartItems.isEmpty()) {
            throw new RuntimeException("Cart is empty");
        }

        long totalAmount = cart.getSubtotalPrice();

        Voucher voucher = dto.getVoucherId() != null
                ? voucherRepository.findById(dto.getVoucherId()).orElse(null)
                : null;
        
        if (voucher != null && orderRepository.existsByUser_UserIdAndVoucher_VoucherId(user.getUserId(), voucher.getVoucherId())) {
            throw new RuntimeException("Mỗi người dùng chỉ được sử dụng mã giảm giá này một lần");
        }

        long foodDiscount = voucher != null ? voucher.getDiscountValue() : 0L;

        if (Boolean.TRUE.equals(dto.getShopeeCoinsUsed()) && user.getShopeeCoins() > 0) {
            long coinsToUse = Math.min(user.getShopeeCoins(), totalAmount);
            foodDiscount += coinsToUse;
            user.setShopeeCoins(user.getShopeeCoins() - coinsToUse);
            userRepository.save(user);
        }

        long shippingFee = 30000L;

        Order order = new Order();
        order.setUser(user);
        order.setMerchant(cart.getMerchant());
        order.setFoodAmount(totalAmount);
        order.setShippingFee(shippingFee);
        order.setFoodDiscount(foodDiscount);
        order.setShipDiscount(0L);
        order.setOrderStatus(1);
        order.setDeliveryAddress(dto.getDeliveryAddress());

        if (voucher != null) {
            order.setVoucher(voucher);
            // Decrement usage
            if (voucher.getIsActive() && voucher.getMaxUsage() > 0) {
                voucher.setMaxUsage(voucher.getMaxUsage() - 1);
                if (voucher.getMaxUsage() == 0) {
                    voucher.setIsActive(false);
                }
                voucherRepository.save(voucher);
            }
        }

        Order savedOrder = orderRepository.save(order);

        for (CartItem ci : cartItems) {
            OrderDetail od = new OrderDetail();
            od.setOrder(savedOrder);
            od.setFoodItem(ci.getFoodItem());
            od.setQuantity(ci.getQuantity());
            long unitPrice = ci.getFoodItem().getSalePrice() != null
                    ? ci.getFoodItem().getSalePrice()
                    : ci.getFoodItem().getOriginalPrice();
            od.setUnitPrice(unitPrice);

            OrderDetail savedDetail = orderDetailRepository.save(od);

            if (ci.getCartItemToppings() != null) {
                for (CartItemTopping ct : ci.getCartItemToppings()) {
                    OrderDetailTopping odt = new OrderDetailTopping();
                    odt.setOrderDetail(savedDetail);
                    odt.setOptionTopping(ct.getOptionTopping());
                    odt.setPrice(ct.getOptionTopping().getPrice());
                    orderDetailToppingRepository.save(odt);
                }
            }
        }

        long finalAmt = totalAmount + shippingFee - foodDiscount;

        String pm = dto.getPaymentMethod();
        String pmDisplay = "COD";
        if (pm != null && pm.equalsIgnoreCase("bank")) pmDisplay = "BANK";

        Payment payment = new Payment();
        payment.setOrder(savedOrder);
        payment.setAmount(finalAmt);
        payment.setPaymentMethod(pmDisplay);
        payment.setPaymentDate(LocalDateTime.now());
        payment.setStatus(pm != null && pm.equalsIgnoreCase("bank") ? "success" : "pending");
        Payment savedPayment = paymentRepository.save(payment);

        for (CartItem ci : cartItems) {
            cartItemRepository.delete(ci);
        }
        cartRepository.delete(cart);

        CheckoutResponseDTO response = new CheckoutResponseDTO();
        response.setOrderId(savedOrder.getOrderId());
        response.setTotalAmount(totalAmount);
        response.setDiscountAmount(foodDiscount);
        response.setFinalAmount(finalAmt);
        response.setPaymentId(savedPayment.getPaymentId());
        response.setStatus("Success");

        return response;
    }

    @Override
    public OrderResponseDTO getOrderById(String orderId) {
        Order order = orderRepository.findById(orderId).orElseThrow(() -> new RuntimeException("Order not found"));
        return convertToResponseDTO(order);
    }

    @Override
    public List<OrderResponseDTO> getOrdersByUser(String userId) {
        return orderRepository.findByUser_UserId(userId).stream().map(this::convertToResponseDTO).collect(Collectors.toList());
    }

    @Override
    public List<OrderResponseDTO> getOrdersByMerchant(String merchantId) {
        return orderRepository.findByMerchant_MerchantId(merchantId).stream().map(this::convertToResponseDTO).collect(Collectors.toList());
    }

    @Override
    public List<OrderResponseDTO> getAllOrders() {
        return orderRepository.findAll().stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public OrderResponseDTO updateOrderStatus(String orderId, Integer status) {
        Order order = orderRepository.findById(orderId).orElseThrow(() -> new RuntimeException("Order not found"));
        
        // If status changes to 3 (Delivering), assign an online driver if not already assigned
        if (status == 3 && order.getDriver() == null) {
            driverRepository.findFirstByIsOnlineTrue().ifPresent(order::setDriver);
        }
        
        // If status changes to 0 (Cancelled), update payment status
        if (status == 0 && order.getPayment() != null) {
            order.getPayment().setStatus("cancelled");
            paymentRepository.save(order.getPayment());
        }
        
        order.setOrderStatus(status);
        return convertToResponseDTO(orderRepository.save(order));
    }

    private OrderResponseDTO convertToResponseDTO(Order order) {
        OrderResponseDTO dto = new OrderResponseDTO();
        dto.setOrderId(order.getOrderId());
        dto.setUserId(order.getUser().getUserId());
        dto.setMerchantId(order.getMerchant().getMerchantId());
        dto.setOrderTime(order.getOrderTime());
        dto.setFoodAmount(order.getFoodAmount());
        dto.setShippingFee(order.getShippingFee());
        
        long foodDisc = order.getFoodDiscount() != null ? order.getFoodDiscount() : 0L;
        long shipDisc = order.getShipDiscount() != null ? order.getShipDiscount() : 0L;
        dto.setDiscountAmount(foodDisc + shipDisc);
        
        long finalAmount = order.getFoodAmount() + order.getShippingFee() - (foodDisc + shipDisc);
        dto.setFinalAmount(finalAmount);
        dto.setOrderStatus(order.getOrderStatus());
        dto.setDeliveryAddress(order.getDeliveryAddress());
        dto.setContactPhone(order.getContactPhone());
        dto.setCustomerNote(order.getCustomerNote());

        // New fields
        if (order.getUser() != null) {
            dto.setCustomerName(order.getUser().getFullName());
            dto.setCustomerEmail(order.getUser().getEmail());
        }
        if (order.getMerchant() != null) {
            dto.setStoreName(order.getMerchant().getStoreName());
        }

        if (order.getDriver() != null) {
            Driver d = order.getDriver();
            dto.setDriverName(d.getUser() != null ? d.getUser().getFullName() : "Tài xế");
            dto.setDriverPhone(d.getUser() != null ? d.getUser().getPhoneNumber() : "Đang cập nhật");
            dto.setLicensePlate(d.getLicensePlate());
            dto.setVehicleType(d.getVehicleType());
        }

        if (order.getPayment() != null) {
            dto.setPaymentMethod(order.getPayment().getPaymentMethod());
        }

        return dto;
    }
}