package com.dotoday.service;

import com.dotoday.dto.UserRegistrationDto;
import com.dotoday.entity.User;

import java.util.List;
import java.util.Optional;

public interface UserService {
    User registerUser(UserRegistrationDto registrationDto);
    User findById(Long id);
    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);
    List<User> getAllUsers();
    List<User> searchUsers(String query);
    User updateProfile(Long userId, String fullName, String bio);
}
