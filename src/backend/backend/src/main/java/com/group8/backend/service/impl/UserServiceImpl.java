package com.group8.backend.service.impl;

import com.group8.backend.dto.UserLoginDTO;
import com.group8.backend.dto.UserRegistrationDTO;
import com.group8.backend.dto.UserResponseDTO;
import com.group8.backend.model.Role;
import com.group8.backend.model.User;
import com.group8.backend.repository.RoleRepository;
import com.group8.backend.repository.UserRepository;
import com.group8.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.text.SimpleDateFormat;
import java.util.HashSet;
import java.util.Optional;
import java.util.Set;

@Service
@Transactional
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @Override
    public UserResponseDTO register(UserRegistrationDTO dto) {
        // Check if email already exists
        Optional<User> existingUser = userRepository.findByEmail(dto.getEmail());
        if (existingUser.isPresent()) {
            throw new RuntimeException("Email already registered");
        }

        // Check if phone already exists
        Optional<User> phoneExists = userRepository.findByPhoneNumber(dto.getPhoneNumber());
        if (phoneExists.isPresent()) {
            throw new RuntimeException("Phone number already registered");
        }

        User user = new User();
        // userId will be generated automatically via @PrePersist
        user.setFullName(dto.getFullName());
        user.setEmail(dto.getEmail());
        user.setPhoneNumber(dto.getPhoneNumber());
        user.setPassword(passwordEncoder.encode(dto.getPassword()));
        user.setAddressDelivery(dto.getAddressDelivery());
        user.setShopeeCoins(0L);

        try {
            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
            user.setBirthDate(sdf.parse(dto.getBirthDate()));
        } catch (Exception e) {
            throw new RuntimeException("Invalid birth date format. Use yyyy-MM-dd");
        }

        // Set default role: RO00001 (Người dùng)
        Role userRole = roleRepository.findById("RO00001")
                .orElseThrow(() -> new RuntimeException("Default User Role (RO00001) not found in DB"));
        Set<Role> roles = new HashSet<>();
        roles.add(userRole);
        user.setRoles(roles);

        User savedUser = userRepository.save(user);
        return convertToResponseDTO(savedUser);
    }

    @Override
    public UserResponseDTO login(UserLoginDTO dto) {
        // Try to find user by email first
        Optional<User> userOpt = userRepository.findByEmail(dto.getEmail());

        // If not found by email, try phone number using the same field
        if (userOpt.isEmpty()) {
            userOpt = userRepository.findByPhoneNumber(dto.getEmail());
        }

        if (userOpt.isEmpty()) {
            throw new RuntimeException("User not found with provided email or phone number");
        }

        User user = userOpt.get();
        String storedPassword = user.getPassword() != null ? user.getPassword().trim() : "";
        String inputPassword = dto.getPassword() != null ? dto.getPassword().trim() : "";
        
        boolean matches = false;
        try {
            matches = passwordEncoder.matches(inputPassword, storedPassword);
        } catch (Exception e) {
            // Ignore bcrypt errors if it's plain text
        }
        
        // Fallback for plain-text passwords
        if (!matches && inputPassword.equals(storedPassword)) {
            matches = true;
        }

        if (!matches) {
            System.out.println("DEBUG: Login failed for " + dto.getEmail());
            System.out.println("DEBUG: Stored length: " + storedPassword.length());
            System.out.println("DEBUG: Input length: " + inputPassword.length());
            throw new RuntimeException("Invalid password");
        }

        return convertToResponseDTO(user);
    }

    @Override
    public UserResponseDTO getUserById(String userId) {
        Optional<User> user = userRepository.findById(userId);
        if (user.isEmpty()) {
            throw new RuntimeException("User not found");
        }
        return convertToResponseDTO(user.get());
    }

    @Override
    public UserResponseDTO updateUser(String userId, UserRegistrationDTO dto) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) {
            throw new RuntimeException("User not found");
        }

        User user = userOpt.get();
        user.setFullName(dto.getFullName());
        user.setAddressDelivery(dto.getAddressDelivery());
        user.setPhoneNumber(dto.getPhoneNumber());

        try {
            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
            user.setBirthDate(sdf.parse(dto.getBirthDate()));
        } catch (Exception e) {
            throw new RuntimeException("Invalid birth date format. Use yyyy-MM-dd");
        }

        User updatedUser = userRepository.save(user);
        return convertToResponseDTO(updatedUser);
    }

    @Override
    public java.util.List<UserResponseDTO> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::convertToResponseDTO)
                .collect(java.util.stream.Collectors.toList());
    }

    private UserResponseDTO convertToResponseDTO(User user) {
        UserResponseDTO dto = new UserResponseDTO();
        dto.setUserId(user.getUserId());
        dto.setFullName(user.getFullName());
        dto.setEmail(user.getEmail());
        dto.setPhoneNumber(user.getPhoneNumber());
        dto.setAddressDelivery(user.getAddressDelivery());
        dto.setShopeeCoins(user.getShopeeCoins() != null ? user.getShopeeCoins().intValue() : 0);
        if (user.getRoles() != null) {
            dto.setRoles(user.getRoles().stream()
                .map(role -> role.getRoleName())
                .collect(java.util.stream.Collectors.toList()));
        }
        return dto;
    }
}
