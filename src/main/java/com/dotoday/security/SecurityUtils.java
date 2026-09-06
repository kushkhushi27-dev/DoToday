package com.dotoday.security;

import com.dotoday.entity.User;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.Optional;

public final class SecurityUtils {

    private SecurityUtils() {
    }

    public static Optional<CustomUserDetails> getCurrentUserDetails() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() || authentication instanceof AnonymousAuthenticationToken) {
            return Optional.empty();
        }
        Object principal = authentication.getPrincipal();
        if (principal instanceof CustomUserDetails customUserDetails) {
            return Optional.of(customUserDetails);
        }
        return Optional.empty();
    }

    public static Optional<User> getCurrentUser() {
        return getCurrentUserDetails().map(CustomUserDetails::getUser);
    }

    public static Long getCurrentUserId() {
        return getCurrentUserDetails().map(CustomUserDetails::getId).orElse(null);
    }

    public static boolean isAuthenticated() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return authentication != null && authentication.isAuthenticated() && !(authentication instanceof AnonymousAuthenticationToken);
    }

    public static boolean hasRole(String role) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null) return false;
        String roleWithPrefix = role.startsWith("ROLE_") ? role : "ROLE_" + role;
        return authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals(roleWithPrefix));
    }
}
