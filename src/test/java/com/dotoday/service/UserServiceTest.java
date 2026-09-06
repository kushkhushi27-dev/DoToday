package com.dotoday.service;

import com.dotoday.dto.UserRegistrationDto;
import com.dotoday.entity.Role;
import com.dotoday.entity.User;
import com.dotoday.exception.BadRequestException;
import com.dotoday.repository.RoleRepository;
import com.dotoday.repository.UserRepository;
import com.dotoday.service.impl.UserServiceImpl;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private RoleRepository roleRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UserServiceImpl userService;

    @Test
    @DisplayName("Should successfully register a new user with BCrypt password")
    void testRegisterUserSuccess() {
        UserRegistrationDto dto = new UserRegistrationDto();
        dto.setFullName("Alice Brown");
        dto.setUsername("alice");
        dto.setEmail("alice@example.com");
        dto.setPassword("Secret@123");
        dto.setConfirmPassword("Secret@123");

        when(userRepository.existsByUsername("alice")).thenReturn(false);
        when(userRepository.existsByEmail("alice@example.com")).thenReturn(false);
        when(passwordEncoder.encode("Secret@123")).thenReturn("$2a$10$encodedHash");
        when(roleRepository.findByName("ROLE_USER")).thenReturn(Optional.of(new Role("ROLE_USER")));
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        User user = userService.registerUser(dto);

        assertNotNull(user);
        assertEquals("alice", user.getUsername());
        assertEquals("alice@example.com", user.getEmail());
        assertEquals("$2a$10$encodedHash", user.getPassword());
        assertTrue(user.hasRole("ROLE_USER"));
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    @DisplayName("Should throw BadRequestException when passwords mismatch")
    void testRegisterUserPasswordMismatch() {
        UserRegistrationDto dto = new UserRegistrationDto();
        dto.setFullName("Alice Brown");
        dto.setUsername("alice");
        dto.setEmail("alice@example.com");
        dto.setPassword("Secret@123");
        dto.setConfirmPassword("Different@123");

        assertThrows(BadRequestException.class, () -> userService.registerUser(dto));
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    @DisplayName("Should throw BadRequestException when username already taken")
    void testRegisterUserDuplicateUsername() {
        UserRegistrationDto dto = new UserRegistrationDto();
        dto.setFullName("Alice Brown");
        dto.setUsername("existing_user");
        dto.setEmail("alice@example.com");
        dto.setPassword("Secret@123");
        dto.setConfirmPassword("Secret@123");

        when(userRepository.existsByUsername("existing_user")).thenReturn(true);

        assertThrows(BadRequestException.class, () -> userService.registerUser(dto));
        verify(userRepository, never()).save(any(User.class));
    }
}
