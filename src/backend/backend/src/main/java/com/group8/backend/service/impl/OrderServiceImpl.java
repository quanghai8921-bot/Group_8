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
// import java.util.Optional;
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
        order.setOrderId(generateId());
        order.setUser(user);
        order.setMerchant(merchant);
        order.setOrderTime(LocalDateTime.now());
        order.setFoodAmount(dto.getFoodAmount());
        order.setShippingFee(dto.getShippingFee());
        
        // Sửa lỗi: dùng foodDiscount thay cho discountAmount
        order.setFoodDiscount(dto.getDiscountAmount() != null ? dto.getDiscountAmount() : 0L);
        order.setShipDiscount(0L);
        
        // Sửa lỗi: dùng orderStatus (Boolean) thay cho status (byte)
        order.setOrderStatus(true); 
        order.setDeliveryAddress(dto.getDeliveryAddress());

        if (dto.getDriverId() != null) {
            driverRepository.findById(dto.getDriverId()).ifPresent(order::setDriver);
        }
        if (dto.getVoucherId() != null) {
            voucherRepository.findById(dto.getVoucherId()).ifPresent(order::setVoucher);
        }

        Order savedOrder = orderRepository.save(order);
        return convertToResponseDTO(savedOrder);
    }

    @Override
    @Transactional
    public OrderResponseDTO createOrderFromCart(com.group8.backend.dto.PlaceOrderDTO dto) {
        User user = userRepository.findById(dto.getUserId()).orElseThrow(() -> new RuntimeException("User not found"));
        Merchant merchant = merchantRepository.findById(dto.getMerchantId()).orElseThrow(() -> new RuntimeException("Merchant not found"));
        Cart cart = cartRepository.findByUser_UserIdAndMerchant_MerchantId(dto.getUserId(), dto.getMerchantId())
                .orElseThrow(() -> new RuntimeException("Cart not found"));

        if (cart.getSubtotalPrice() == null || cart.getSubtotalPrice() <= 0L) {
            throw new RuntimeException("Cart is empty");
        }

        Voucher appliedVoucher = null;
        if (dto.getVoucherCode() != null && !dto.getVoucherCode().isBlank()) {
            Voucher v = voucherRepository.findByVoucherCode(dto.getVoucherCode()).orElseThrow(() -> new RuntimeException("Voucher not found"));
            appliedVoucher = v;
        }

        Order order = new Order();
        order.setOrderId(generateId());
        order.setUser(user);
        order.setMerchant(merchant);
        order.setOrderTime(LocalDateTime.now());
        order.setFoodAmount(cart.getSubtotalPrice());
        order.setShippingFee(dto.getShippingFee().longValue());
        
        // Cập nhật chiết khấu
        order.setFoodDiscount(appliedVoucher != null ? appliedVoucher.getDiscountValue() : 0L);
        order.setShipDiscount(0L);
        order.setOrderStatus(true);
        order.setDeliveryAddress(dto.getDeliveryAddress());

        Order savedOrder = orderRepository.save(order);

        // Chuyển CartItems sang OrderDetail
        List<CartItem> cartItems = cartItemRepository.findByCart_CartId(cart.getCartId());
        for (CartItem ci : cartItems) {
            OrderDetail od = new OrderDetail();
            od.setOrderDetailId(generateId());
            od.setOrder(savedOrder);
            od.setFoodItem(ci.getFoodItem());
            od.setFoodName(ci.getFoodItem().getFoodName());
            od.setQuantity(ci.getQuantity());
            long unitPrice = ci.getFoodItem().getSalePrice() != null ? ci.getFoodItem().getSalePrice() : ci.getFoodItem().getOriginalPrice();
            od.setUnitPrice(unitPrice);
            orderDetailRepository.save(od);
        }

        cartRepository.delete(cart);
        return convertToResponseDTO(savedOrder);
    }

    @Override
    @Transactional
    public CheckoutResponseDTO checkout(CheckoutRequestDTO dto) {
        User user = userRepository.findById(dto.getUserId()).orElseThrow(() -> new RuntimeException("User not found"));
        Cart cart = cartRepository.findById(dto.getCartId()).orElseThrow(() -> new RuntimeException("Cart not found"));

        List<CartItem> cartItems = cartItemRepository.findByCart_CartId(dto.getCartId());
        long totalAmount = cart.getSubtotalPrice();

        Voucher voucher = dto.getVoucherId() != null ? voucherRepository.findById(dto.getVoucherId()).orElse(null) : null;
        long foodDiscount = voucher != null ? voucher.getDiscountValue() : 0L;

        // Xử lý Shopee Coins
        if (dto.getShopeeCoinsUsed() && user.getShopeeCoins() > 0) {
            long coinsToUse = Math.min(user.getShopeeCoins(), totalAmount);
            foodDiscount += coinsToUse;
            user.setShopeeCoins(user.getShopeeCoins() - coinsToUse);
            userRepository.save(user);
        }

        Order order = new Order();
        order.setUser(user);
        order.setMerchant(cart.getMerchant());
        order.setOrderTime(LocalDateTime.now());
        order.setFoodAmount(totalAmount);
        order.setShippingFee(30000L);
        order.setFoodDiscount(foodDiscount);
        order.setShipDiscount(0L);
        order.setOrderStatus(true);
        order.setDeliveryAddress(dto.getDeliveryAddress());

        Order savedOrder = orderRepository.save(order);

        // Tính Final Amount thủ công để trả về DTO
        long finalAmt = order.getFoodAmount() + order.getShippingFee() - order.getFoodDiscount();

        Payment payment = new Payment();
        payment.setOrder(savedOrder);
        payment.setAmount(finalAmt);
        payment.setPaymentMethod(dto.getPaymentMethod());
        payment.setPaymentDate(LocalDateTime.now());
        // Giả sử bảng Payment vẫn dùng cột Status kiểu String
        // payment.setStatus("Success"); 
        paymentRepository.save(payment);

        cartRepository.delete(cart);

        CheckoutResponseDTO response = new CheckoutResponseDTO();
        response.setOrderId(savedOrder.getOrderId());
        response.setTotalAmount(totalAmount);
        response.setDiscountAmount(foodDiscount);
        response.setFinalAmount(finalAmt);
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

    private OrderResponseDTO convertToResponseDTO(Order order) {
        OrderResponseDTO dto = new OrderResponseDTO();
        dto.setOrderId(order.getOrderId());
        dto.setUserId(order.getUser().getUserId());
        dto.setMerchantId(order.getMerchant().getMerchantId());
        dto.setOrderTime(order.getOrderTime());
        dto.setFoodAmount(order.getFoodAmount());
        dto.setShippingFee(order.getShippingFee());
        
        // Dùng getter mới
        long foodDisc = order.getFoodDiscount() != null ? order.getFoodDiscount() : 0L;
        long shipDisc = order.getShipDiscount() != null ? order.getShipDiscount() : 0L;
        dto.setDiscountAmount(foodDisc + shipDisc);
        
        long finalAmount = order.getFoodAmount() + order.getShippingFee() - (foodDisc + shipDisc);
        dto.setFinalAmount(finalAmount);
        dto.setOrderStatus(order.getOrderStatus());
        dto.setDeliveryAddress(order.getDeliveryAddress());
        return dto;
    }

    private String generateId() {
        return "ORD" + UUID.randomUUID().toString().substring(0, 6).toUpperCase();
    }
}