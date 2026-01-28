package com.group8.backend.service.impl;

import com.group8.backend.dto.UserLoginDTO;
import com.group8.backend.dto.UserRegistrationDTO;
import com.group8.backend.dto.UserResponseDTO;
import com.group8.backend.model.User;
import com.group8.backend.repository.UserRepository;
import com.group8.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Optional;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

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
        user.setUserId(dto.getUserId());
        user.setFullName(dto.getFullName());
        user.setEmail(dto.getEmail());
        user.setPhoneNumber(dto.getPhoneNumber());
        user.setPasswords(dto.getPasswords());
        user.setAddressDelivery(dto.getAddressDelivery());
        user.setShopeeCoins(0);

        try {
            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
            user.setBirthDate(sdf.parse(dto.getBirthDate()));
        } catch (Exception e) {
            throw new RuntimeException("Invalid birth date format. Use yyyy-MM-dd");
        }

        User savedUser = userRepository.save(user);
        return convertToResponseDTO(savedUser);
    }

    @Override
    public UserResponseDTO login(UserLoginDTO dto) {
        Optional<User> user = userRepository.findByEmail(dto.getEmail());
        if (user.isEmpty()) {
            throw new RuntimeException("User not found");
        }

        User foundUser = user.get();
        if (!foundUser.getPasswords().equals(dto.getPasswords())) {
            throw new RuntimeException("Invalid password");
        }

        return convertToResponseDTO(foundUser);
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

    private UserResponseDTO convertToResponseDTO(User user) {
        UserResponseDTO dto = new UserResponseDTO();
        dto.setUserId(user.getUserId());
        dto.setFullName(user.getFullName());
        dto.setEmail(user.getEmail());
        dto.setPhoneNumber(user.getPhoneNumber());
        dto.setAddressDelivery(user.getAddressDelivery());
        dto.setShopeeCoins(user.getShopeeCoins());
        return dto;
    }
}
