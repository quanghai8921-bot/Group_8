package com.group8.backend.service;

import com.group8.backend.model.OptionTopping;
import java.util.List;

public interface ToppingService {
    List<OptionTopping> getToppingsByMerchant(String merchantId);
    OptionTopping getToppingById(String toppingId);
    OptionTopping createTopping(OptionTopping topping);
    OptionTopping updateTopping(String toppingId, OptionTopping topping);
    void deleteTopping(String toppingId);
}
