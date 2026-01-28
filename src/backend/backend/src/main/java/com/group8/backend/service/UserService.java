package com.group8.backend.service;

import com.group8.backend.dto.UserLoginDTO;
import com.group8.backend.dto.UserRegistrationDTO;
import com.group8.backend.dto.UserResponseDTO;

public interface UserService {
    UserResponseDTO register(UserRegistrationDTO dto);
    UserResponseDTO login(UserLoginDTO dto);
    UserResponseDTO getUserById(String userId);
    UserResponseDTO updateUser(String userId, UserRegistrationDTO dto);
}
