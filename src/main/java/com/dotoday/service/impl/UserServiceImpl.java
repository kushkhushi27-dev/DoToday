package com.dotoday.service.impl;

import com.dotoday.dto.UserRegistrationDto;
import com.dotoday.entity.Role;
import com.dotoday.entity.User;
import com.dotoday.exception.BadRequestException;
import com.dotoday.exception.ResourceNotFoundException;
import com.dotoday.repository.RoleRepository;
import com.dotoday.repository.UserRepository;
import com.dotoday.service.UserService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    public UserServiceImpl(UserRepository userRepository, RoleRepository roleRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public User registerUser(UserRegistrationDto dto) {
        if (!dto.isPasswordMatching()) {
            throw new BadRequestException("Passwords do not match");
        }
        if (userRepository.existsByUsername(dto.getUsername())) {
            throw new BadRequestException("Username is already taken");
        }
        if (userRepository.existsByEmail(dto.getEmail())) {
            throw new BadRequestException("Email is already registered");
        }

        User user = new User();
        user.setFullName(dto.getFullName().trim());
        user.setUsername(dto.getUsername().trim().toLowerCase());
        user.setEmail(dto.getEmail().trim().toLowerCase());
        user.setPassword(passwordEncoder.encode(dto.getPassword()));
        user.setEnabled(true);

        Role userRole = roleRepository.findByName("ROLE_USER")
                .orElseGet(() -> roleRepository.save(new Role("ROLE_USER")));
        user.addRole(userRole);

        return userRepository.save(user);
    }

    @Override
    @Transactional(readOnly = true)
    public User findById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<User> findByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    @Override
    @Transactional(readOnly = true)
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public List<User> searchUsers(String query) {
        if (query == null || query.isBlank()) {
            return userRepository.findAll();
        }
        return userRepository.searchUsers(query.trim());
    }

    @Override
    public User updateProfile(Long userId, String fullName, String bio) {
        User user = findById(userId);
        if (fullName != null && !fullName.isBlank()) {
            user.setFullName(fullName.trim());
        }
        if (bio != null) {
            user.setBio(bio.trim());
        }
        return userRepository.save(user);
    }
}
