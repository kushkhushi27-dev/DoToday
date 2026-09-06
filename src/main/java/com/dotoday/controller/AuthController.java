package com.dotoday.controller;

import com.dotoday.dto.UserRegistrationDto;
import com.dotoday.exception.BadRequestException;
import com.dotoday.security.SecurityUtils;
import com.dotoday.service.UserService;
import jakarta.validation.Valid;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

@Controller
public class AuthController {

    private final UserService userService;

    public AuthController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/login")
    public String showLoginPage(@RequestParam(value = "error", required = false) String error,
                                @RequestParam(value = "logout", required = false) String logout,
                                @RequestParam(value = "registered", required = false) String registered,
                                Model model) {
        if (SecurityUtils.isAuthenticated()) {
            return "redirect:/dashboard";
        }
        if (error != null) {
            model.addAttribute("errorMessage", "Invalid username/email or password.");
        }
        if (logout != null) {
            model.addAttribute("successMessage", "You have been logged out successfully.");
        }
        if (registered != null) {
            model.addAttribute("successMessage", "Registration successful! Please log in with your credentials.");
        }
        return "auth/login";
    }

    @GetMapping("/register")
    public String showRegistrationPage(Model model) {
        if (SecurityUtils.isAuthenticated()) {
            return "redirect:/dashboard";
        }
        if (!model.containsAttribute("user")) {
            model.addAttribute("user", new UserRegistrationDto());
        }
        return "auth/register";
    }

    @PostMapping("/register")
    public String registerUser(@Valid @ModelAttribute("user") UserRegistrationDto userDto,
                               BindingResult bindingResult,
                               Model model,
                               RedirectAttributes redirectAttributes) {
        if (bindingResult.hasErrors()) {
            return "auth/register";
        }

        try {
            userService.registerUser(userDto);
            redirectAttributes.addFlashAttribute("successMessage", "Account created successfully! You can now log in.");
            return "redirect:/login?registered=true";
        } catch (BadRequestException ex) {
            model.addAttribute("errorMessage", ex.getMessage());
            return "auth/register";
        }
    }
}
