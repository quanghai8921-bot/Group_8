package com.group8.backend.controller;

import com.group8.backend.model.OptionTopping;
import com.group8.backend.service.ToppingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/toppings")
@CrossOrigin(origins = "*")
public class ToppingController {

    @Autowired
    private ToppingService toppingService;

    @GetMapping("/merchant/{merchantId}")
    public ResponseEntity<Map<String, Object>> getByMerchant(@PathVariable String merchantId) {
        List<OptionTopping> list = toppingService.getToppingsByMerchant(merchantId);
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("data", list);
        return ResponseEntity.ok(response);
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> create(@RequestBody OptionTopping topping) {
        OptionTopping created = toppingService.createTopping(topping);
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("data", created);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Map<String, Object>> update(@PathVariable String id, @RequestBody OptionTopping topping) {
        OptionTopping updated = toppingService.updateTopping(id, topping);
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("data", updated);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> delete(@PathVariable String id) {
        toppingService.deleteTopping(id);
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Topping deleted");
        return ResponseEntity.ok(response);
    }
}
