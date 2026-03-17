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

       if (food.getFoodStatus() == null || food.getFoodStatus() != 1) {
    throw new RuntimeException("Food item is out of stock or discontinued");
}

        // Get or create cart
        Cart cart = cartRepository.findByUser_UserIdAndMerchant_MerchantId(dto.getUserId(), dto.getMerchantId())
                .orElseGet(() -> {
                    Cart c = new Cart();
                    c.setUser(user);
                    c.setMerchant(merchant);
                    c.setCreatedAt(LocalDateTime.now());
                    c.setSubtotalPrice(0L);
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
        return cartRepository.findByUser_UserIdAndMerchant_MerchantId(userId, merchantId)
                .map(this::convertToDTO)
                .orElse(null);
    }

    @Override
    public List<CartResponseDTO> getCartsByUser(String userId) {
        List<Cart> carts = cartRepository.findByUser_UserId(userId);
        return carts.stream().map(this::convertToDTO).collect(Collectors.toList());
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
        cart.setSubtotalPrice(0L);
        cartRepository.save(cart);
    }

    private void recalcCartSubtotal(Cart cart) {
        List<CartItem> items = cartItemRepository.findByCart_CartId(cart.getCartId());
        BigDecimal subtotal = BigDecimal.ZERO;
        for (CartItem ci : items) {
            BigDecimal base = ci.getFoodItem().getSalePrice() != null ? BigDecimal.valueOf(ci.getFoodItem().getSalePrice()) : BigDecimal.valueOf(ci.getFoodItem().getOriginalPrice());
            BigDecimal toppingSum = BigDecimal.ZERO;
            if (ci.getCartItemToppings() != null) {
                for (CartItemTopping ct : ci.getCartItemToppings()) {
                    if (ct.getOptionTopping() != null && ct.getOptionTopping().getPrice() != null)
                        toppingSum = toppingSum.add(BigDecimal.valueOf(ct.getOptionTopping().getPrice()));
                }
            }
            BigDecimal itemTotal = base.add(toppingSum).multiply(BigDecimal.valueOf(ci.getQuantity()));
            subtotal = subtotal.add(itemTotal);
        }
        cart.setSubtotalPrice(subtotal.longValue());
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
            ciDto.setFoodImage(ci.getFoodItem().getFoodImage());
            ciDto.setQuantity(ci.getQuantity());
            ciDto.setNote(ci.getNote());
            BigDecimal base = ci.getFoodItem().getSalePrice() != null ? BigDecimal.valueOf(ci.getFoodItem().getSalePrice()) : BigDecimal.valueOf(ci.getFoodItem().getOriginalPrice());
            ciDto.setUnitPrice(base.longValue());
            BigDecimal toppingSum = BigDecimal.ZERO;
            List<CartItemToppingDTO> tDtos = new ArrayList<>();
            if (ci.getCartItemToppings() != null) {
                for (CartItemTopping ct : ci.getCartItemToppings()) {
                    CartItemToppingDTO tDto = new CartItemToppingDTO();
                    tDto.setToppingId(ct.getOptionTopping().getToppingId());
                    tDto.setToppingName(ct.getOptionTopping().getToppingName());
                    tDto.setPrice(ct.getOptionTopping().getPrice());
                    tDtos.add(tDto);
                    if (ct.getOptionTopping().getPrice() != null)
                        toppingSum = toppingSum.add(BigDecimal.valueOf(ct.getOptionTopping().getPrice()));
                }
            }
            ciDto.setToppings(tDtos);
            BigDecimal total = base.add(toppingSum).multiply(BigDecimal.valueOf(ci.getQuantity()));
            ciDto.setTotalPrice(total.longValue());
            return ciDto;
        }).collect(Collectors.toList());
        dto.setItems(items);
        return dto;
    }
}
