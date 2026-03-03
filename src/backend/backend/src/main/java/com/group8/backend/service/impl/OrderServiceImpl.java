package com.group8.backend.service.impl;

import com.group8.backend.dto.OrderRequestDTO;
import com.group8.backend.dto.OrderResponseDTO;
import com.group8.backend.model.*;
import com.group8.backend.repository.*;
import com.group8.backend.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
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
    private OrderDetailToppingRepository orderDetailToppingRepository;

    @Override
    public OrderResponseDTO createOrder(OrderRequestDTO dto) {
        // Existing behavior preserved (manual order creation)
        Optional<User> user = userRepository.findById(dto.getUserId());
        if (user.isEmpty()) {
            throw new RuntimeException("User not found");
        }

        Optional<Merchant> merchant = merchantRepository.findById(dto.getMerchantId());
        if (merchant.isEmpty()) {
            throw new RuntimeException("Merchant not found");
        }

        Order order = new Order();
        order.setOrderId(generateId());
        order.setUser(user.get());
        order.setMerchant(merchant.get());
        order.setOrderTime(LocalDateTime.now());
        order.setFoodAmount(dto.getFoodAmount());
        order.setShippingFee(dto.getShippingFee());
        order.setDiscountAmount(dto.getDiscountAmount() != null ? dto.getDiscountAmount() : BigDecimal.ZERO);
        order.setStatus((byte) 1);
        order.setDeliveryAddress(dto.getDeliveryAddress());

        if (dto.getDriverId() != null) {
            Optional<Driver> driver = driverRepository.findById(dto.getDriverId());
            driver.ifPresent(order::setDriver);
        }

        if (dto.getVoucherId() != null) {
            Optional<Voucher> voucher = voucherRepository.findById(dto.getVoucherId());
            voucher.ifPresent(order::setVoucher);
        }

        Order savedOrder = orderRepository.save(order);
        return convertToResponseDTO(savedOrder);
    }

    @Override
    @org.springframework.transaction.annotation.Transactional
    public OrderResponseDTO createOrderFromCart(com.group8.backend.dto.PlaceOrderDTO dto) {
        // Validate User & Merchant
        User user = userRepository.findById(dto.getUserId()).orElseThrow(() -> new RuntimeException("User not found"));
        Merchant merchant = merchantRepository.findById(dto.getMerchantId()).orElseThrow(() -> new RuntimeException("Merchant not found"));

        Cart cart = cartRepository.findByUser_UserIdAndMerchant_MerchantId(dto.getUserId(), dto.getMerchantId())
                .orElseThrow(() -> new RuntimeException("Cart not found"));

        if (cart.getSubtotalPrice() == null || cart.getSubtotalPrice().compareTo(java.math.BigDecimal.ZERO) <= 0) {
            throw new RuntimeException("Cart is empty");
        }

        // Validate Voucher if provided
        Voucher appliedVoucher = null;
        if (dto.getVoucherCode() != null && !dto.getVoucherCode().isBlank()) {
            Voucher v = voucherRepository.findByVoucherCode(dto.getVoucherCode())
                    .orElseThrow(() -> new RuntimeException("Voucher not found"));
            if (v.getEndDate() != null && v.getEndDate().isBefore(LocalDateTime.now())) {
                throw new RuntimeException("Voucher has expired");
            }
            if (v.getMinOrderValue() != null && cart.getSubtotalPrice().compareTo(v.getMinOrderValue()) < 0) {
                throw new RuntimeException("Cart total does not meet voucher minimum");
            }
            appliedVoucher = v;
        }

        // Create Order
        Order order = new Order();
        order.setOrderId(generateId());
        order.setUser(user);
        order.setMerchant(merchant);
        order.setOrderTime(LocalDateTime.now());
        order.setFoodAmount(cart.getSubtotalPrice());
        order.setShippingFee(dto.getShippingFee());
        order.setDiscountAmount(appliedVoucher != null ? appliedVoucher.getDiscountValue() : java.math.BigDecimal.ZERO);
        order.setStatus((byte) 1);
        order.setDeliveryAddress(dto.getDeliveryAddress());
        if (dto.getDriverId() != null) {
            driverRepository.findById(dto.getDriverId()).ifPresent(order::setDriver);
        }
        if (appliedVoucher != null) order.setVoucher(appliedVoucher);

        Order savedOrder = orderRepository.save(order);

        // Transfer CartItems -> OrderDetail
        List<CartItem> cartItems = cartItemRepository.findByCart_CartId(cart.getCartId());
        for (CartItem ci : cartItems) {
            OrderDetail od = new OrderDetail();
            od.setOrderDetailId(generateId());
            od.setOrder(savedOrder);
            od.setFoodItem(ci.getFoodItem());
            od.setFoodName(ci.getFoodItem().getFoodName());
            od.setQuantity(ci.getQuantity());
            java.math.BigDecimal unitPrice = ci.getFoodItem().getSalePrice() != null ? ci.getFoodItem().getSalePrice() : ci.getFoodItem().getOriginalPrice();
            od.setUnitPrice(unitPrice);
            orderDetailRepository.save(od);

            // Toppings -> OrderDetailTopping
            if (ci.getCartItemToppings() != null) {
                for (CartItemTopping ct : ci.getCartItemToppings()) {
                    OrderDetailTopping odt = new OrderDetailTopping();
                    odt.setOdToppingId(generateId());
                    odt.setOrderDetail(od);
                    odt.setOptionTopping(ct.getOptionTopping());
                    if (ct.getOptionTopping() != null) {
                        odt.setToppingName(ct.getOptionTopping().getNameOption());
                        odt.setToppingPrice(ct.getOptionTopping().getSurcharge());
                    }
                    orderDetailToppingRepository.save(odt);
                }
            }
        }

        // Clear Cart
        cartItemRepository.findByCart_CartId(cart.getCartId()).forEach(cartItemRepository::delete);
        cartRepository.delete(cart);

        return convertToResponseDTO(savedOrder);
    }

    @Override
    public OrderResponseDTO getOrderById(String orderId) {
        Optional<Order> order = orderRepository.findById(orderId);
        if (order.isEmpty()) {
            throw new RuntimeException("Order not found");
        }
        return convertToResponseDTO(order.get());
    }

    @Override
    public List<OrderResponseDTO> getOrdersByUser(String userId) {
        return orderRepository.findByUser_UserId(userId)
                .stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<OrderResponseDTO> getOrdersByMerchant(String merchantId) {
        return orderRepository.findByMerchant_MerchantId(merchantId)
                .stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }

    private OrderResponseDTO convertToResponseDTO(Order order) {
        OrderResponseDTO dto = new OrderResponseDTO();
        dto.setOrderId(order.getOrderId());
        dto.setUserId(order.getUser().getUserId());
        dto.setMerchantId(order.getMerchant().getMerchantId());
        dto.setOrderTime(order.getOrderTime());
        dto.setFoodAmount(order.getFoodAmount());
        dto.setShippingFee(order.getShippingFee());
        dto.setDiscountAmount(order.getDiscountAmount());
        // Final_Amount = Food_Amount + Shipping_Fee - Discount_Amount
        BigDecimal finalAmount = order.getFoodAmount()
                .add(order.getShippingFee())
                .subtract(order.getDiscountAmount());
        dto.setFinalAmount(finalAmount);
        dto.setStatus(order.getStatus());
        dto.setDeliveryAddress(order.getDeliveryAddress());
        return dto;
    }

    private String generateId() {
        return "ORD" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }
}
