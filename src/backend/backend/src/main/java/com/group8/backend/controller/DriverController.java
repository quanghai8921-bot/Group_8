package com.group8.backend.controller;

import com.group8.backend.dto.DriverLocationDTO;
import com.group8.backend.service.DriverService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/drivers")
@CrossOrigin(origins = "*")
public class DriverController {

    @Autowired
    private DriverService driverService;

    @PostMapping("/accept")
    public ResponseEntity<Map<String,Object>> acceptOrder(@RequestParam String driverId, @RequestParam String orderId) {
        driverService.acceptOrder(driverId, orderId);
        Map<String,Object> resp = new HashMap<>();
        resp.put("success", true);
        resp.put("message", "Order accepted");
        return ResponseEntity.ok(resp);
    }

    @PostMapping("/status")
    public ResponseEntity<Map<String,Object>> updateStatus(@RequestParam String driverId, @RequestParam String orderId, @RequestParam byte status) {
        driverService.updateOrderStatus(driverId, orderId, status);
        Map<String,Object> resp = new HashMap<>();
        resp.put("success", true);
        resp.put("message", "Order status updated");
        return ResponseEntity.ok(resp);
    }

    @PostMapping("/location")
    public ResponseEntity<Map<String,Object>> updateLocation(@Valid @RequestBody DriverLocationDTO dto) {
        driverService.updateLocation(dto);
        Map<String,Object> resp = new HashMap<>();
        resp.put("success", true);
        resp.put("message", "Location updated");
        return ResponseEntity.ok(resp);
    }
}
