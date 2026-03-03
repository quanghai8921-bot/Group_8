package com.group8.backend.service.impl;

import com.group8.backend.dto.*;
import com.group8.backend.model.*;
import com.group8.backend.repository.*;
import com.group8.backend.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class CartServiceImpl implements CartService {

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private CartItemRepository cartItemRepository;

    @Autowired
    private CartItemToppingRepository cartItemToppingRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private MerchantRepository merchantRepository;

    @Autowired
    private FoodItemRepository foodItemRepository;

    @Autowired
    private OptionToppingRepository optionToppingRepository;

    @Override
    @Transactional
    public CartResponseDTO addToCart(AddCartItemDTO dto) {
        // Validate entities
        User user = userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        Merchant merchant = merchantRepository.findById(dto.getMerchantId())
                .orElseThrow(() -> new RuntimeException("Merchant not found"));
        FoodItem food = foodItemRepository.findById(dto.getFoodId())
                .orElseThrow(() -> new RuntimeException("Food item not found"));

        if ("OUT_OF_STOCK".equalsIgnoreCase(food.getStatusFood())) {
            throw new RuntimeException("Food item is out of stock");
        }

        // Get or create cart
        Cart cart = cartRepository.findByUser_UserIdAndMerchant_MerchantId(dto.getUserId(), dto.getMerchantId())
                .orElseGet(() -> {
                    Cart c = new Cart();
                    c.setCartId(generateId("CRT"));
                    c.setUser(user);
                    c.setMerchant(merchant);
                    c.setCreateAt(LocalDateTime.now());
                    c.setSubtotalPrice(BigDecimal.ZERO);
                    return cartRepository.save(c);
                });

        // Normalize toppings list
        List<String> toppingIds = dto.getToppingIds() == null ? Collections.emptyList() : dto.getToppingIds();
        Set<String> toppingSet = new HashSet<>(toppingIds);

        // Look for existing CartItem with same food and same toppings set
        List<CartItem> cartItems = cartItemRepository.findByCart_CartId(cart.getCartId());
        Optional<CartItem> matching = cartItems.stream()
                .filter(ci -> ci.getFoodItem().getFoodId().equals(food.getFoodId()))
                .filter(ci -> {
                    Set<String> existingToppings = ci.getCartItemToppings() == null ? Collections.emptySet() :
                            ci.getCartItemToppings().stream().map(t -> t.getOptionTopping().getToppingId()).collect(Collectors.toSet());
                    return existingToppings.equals(toppingSet);
                })
                .findFirst();

        CartItem targetItem;
        if (matching.isPresent()) {
            targetItem = matching.get();
            targetItem.setQuantity(targetItem.getQuantity() + dto.getQuantity());
            cartItemRepository.save(targetItem);
        } else {
            targetItem = new CartItem();
            targetItem.setCartItemId(generateId("CI"));
            targetItem.setCart(cart);
            targetItem.setFoodItem(food);
            targetItem.setQuantity(dto.getQuantity());
            targetItem.setNote(dto.getNote());
            targetItem = cartItemRepository.save(targetItem);

            // Save toppings
            for (String tId : toppingSet) {
                OptionTopping topping = optionToppingRepository.findById(tId)
                        .orElseThrow(() -> new RuntimeException("Topping not found: " + tId));
                CartItemTopping ct = new CartItemTopping();
                ct.setCartToppingId(generateId("CT"));
                ct.setCartItem(targetItem);
                ct.setOptionTopping(topping);
                cartItemToppingRepository.save(ct);
            }
        }

        // Recalculate subtotal
        recalcCartSubtotal(cart);
        cartRepository.save(cart);

        return convertToDTO(cart);
    }

    @Override
    public CartResponseDTO getCart(String userId, String merchantId) {
        Cart cart = cartRepository.findByUser_UserIdAndMerchant_MerchantId(userId, merchantId)
                .orElseThrow(() -> new RuntimeException("Cart not found"));
        return convertToDTO(cart);
    }

    @Override
    @Transactional
    public void removeCartItem(String cartItemId) {
        CartItem item = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new RuntimeException("CartItem not found"));
        Cart cart = item.getCart();
        cartItemRepository.delete(item);
        recalcCartSubtotal(cart);
        cartRepository.save(cart);
    }

    @Override
    @Transactional
    public void clearCart(String cartId) {
        Cart cart = cartRepository.findById(cartId)
                .orElseThrow(() -> new RuntimeException("Cart not found"));
        cartItemRepository.findByCart_CartId(cartId).forEach(cartItemRepository::delete);
        cart.setSubtotalPrice(BigDecimal.ZERO);
        cartRepository.save(cart);
    }

    private void recalcCartSubtotal(Cart cart) {
        List<CartItem> items = cartItemRepository.findByCart_CartId(cart.getCartId());
        BigDecimal subtotal = BigDecimal.ZERO;
        for (CartItem ci : items) {
            BigDecimal base = ci.getFoodItem().getSalePrice() != null ? ci.getFoodItem().getSalePrice() : ci.getFoodItem().getOriginalPrice();
            BigDecimal toppingSum = BigDecimal.ZERO;
            if (ci.getCartItemToppings() != null) {
                for (CartItemTopping ct : ci.getCartItemToppings()) {
                    if (ct.getOptionTopping() != null && ct.getOptionTopping().getSurcharge() != null)
                        toppingSum = toppingSum.add(ct.getOptionTopping().getSurcharge());
                }
            }
            BigDecimal itemTotal = base.add(toppingSum).multiply(BigDecimal.valueOf(ci.getQuantity()));
            subtotal = subtotal.add(itemTotal);
        }
        cart.setSubtotalPrice(subtotal);
    }

    private CartResponseDTO convertToDTO(Cart cart) {
        CartResponseDTO dto = new CartResponseDTO();
        dto.setCartId(cart.getCartId());
        dto.setUserId(cart.getUser().getUserId());
        dto.setMerchantId(cart.getMerchant().getMerchantId());
        dto.setSubtotalPrice(cart.getSubtotalPrice());

        List<CartItemDTO> items = cartItemRepository.findByCart_CartId(cart.getCartId()).stream().map(ci -> {
            CartItemDTO ciDto = new CartItemDTO();
            ciDto.setCartItemId(ci.getCartItemId());
            ciDto.setFoodId(ci.getFoodItem().getFoodId());
            ciDto.setFoodName(ci.getFoodItem().getFoodName());
            ciDto.setQuantity(ci.getQuantity());
            ciDto.setNote(ci.getNote());
            BigDecimal base = ci.getFoodItem().getSalePrice() != null ? ci.getFoodItem().getSalePrice() : ci.getFoodItem().getOriginalPrice();
            ciDto.setUnitPrice(base);
            BigDecimal toppingSum = BigDecimal.ZERO;
            List<CartItemToppingDTO> tDtos = new ArrayList<>();
            if (ci.getCartItemToppings() != null) {
                for (CartItemTopping ct : ci.getCartItemToppings()) {
                    CartItemToppingDTO tDto = new CartItemToppingDTO();
                    tDto.setToppingId(ct.getOptionTopping().getToppingId());
                    tDto.setNameOption(ct.getOptionTopping().getNameOption());
                    tDto.setSurcharge(ct.getOptionTopping().getSurcharge());
                    tDtos.add(tDto);
                    if (ct.getOptionTopping().getSurcharge() != null)
                        toppingSum = toppingSum.add(ct.getOptionTopping().getSurcharge());
                }
            }
            ciDto.setToppings(tDtos);
            BigDecimal total = base.add(toppingSum).multiply(BigDecimal.valueOf(ci.getQuantity()));
            ciDto.setTotalPrice(total);
            return ciDto;
        }).collect(Collectors.toList());
        dto.setItems(items);
        return dto;
    }

    private String generateId(String prefix) {
        return prefix + UUID.randomUUID().toString().substring(0,8).toUpperCase();
    }
}
