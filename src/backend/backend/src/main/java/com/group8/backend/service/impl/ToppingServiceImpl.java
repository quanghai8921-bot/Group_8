package com.group8.backend.service.impl;

import com.group8.backend.model.OptionTopping;
import com.group8.backend.repository.OptionToppingRepository;
import com.group8.backend.service.ToppingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ToppingServiceImpl implements ToppingService {

    @Autowired
    private OptionToppingRepository toppingRepository;

    @Override
    public List<OptionTopping> getToppingsByMerchant(String merchantId) {
        return toppingRepository.findByMerchant_MerchantId(merchantId);
    }

    @Override
    public OptionTopping getToppingById(String toppingId) {
        return toppingRepository.findById(toppingId)
                .orElseThrow(() -> new RuntimeException("Topping not found"));
    }

    @Override
    @Transactional
    public OptionTopping createTopping(OptionTopping topping) {
        if (topping.getToppingId() == null) {
            topping.setToppingId(com.group8.backend.config.IDGenerator.generateID());
        }
        return toppingRepository.save(topping);
    }

    @Override
    @Transactional
    public OptionTopping updateTopping(String toppingId, OptionTopping topping) {
        OptionTopping existing = getToppingById(toppingId);
        existing.setToppingName(topping.getToppingName());
        existing.setPrice(topping.getPrice());
        return toppingRepository.save(existing);
    }

    @Override
    @Transactional
    public void deleteTopping(String toppingId) {
        toppingRepository.deleteById(toppingId);
    }
}
