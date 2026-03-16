package com.group8.backend.controller;

import com.group8.backend.dto.UserLoginDTO;
import com.group8.backend.dto.UserRegistrationDTO;
import com.group8.backend.dto.UserResponseDTO;
import com.group8.backend.service.UserService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {

    private static final Logger log = LoggerFactory.getLogger(UserController.class);

    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public ResponseEntity<Map<String, Object>> register(@Valid @RequestBody UserRegistrationDTO dto) {
        Map<String, Object> response = new HashMap<>();
        try {
            UserResponseDTO user = userService.register(dto);
            response.put("success", true);
            response.put("message", "Registration successful");
            response.put("data", user);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            log.error("Register error", e);
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@Valid @RequestBody UserLoginDTO dto) {
        Map<String, Object> response = new HashMap<>();
        try {
            UserResponseDTO user = userService.login(dto);
            response.put("success", true);
            response.put("message", "Login successful");
            response.put("data", user);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Login error", e);
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    @GetMapping("/{userId}")
    public ResponseEntity<Map<String, Object>> getUserById(@PathVariable String userId) {
        UserResponseDTO user = userService.getUserById(userId);
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("data", user);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{userId}")
    public ResponseEntity<Map<String, Object>> updateUser(@PathVariable String userId,
                                                           @Valid @RequestBody UserRegistrationDTO dto) {
        UserResponseDTO user = userService.updateUser(userId, dto);
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "User updated successfully");
        response.put("data", user);
        return ResponseEntity.ok(response);
    }
}
