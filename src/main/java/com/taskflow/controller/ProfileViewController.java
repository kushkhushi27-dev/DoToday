package com.taskflow.controller;

import com.taskflow.entity.User;
import com.taskflow.security.SecurityUtils;
import com.taskflow.service.UserService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

@Controller
@RequestMapping("/profile")
public class ProfileViewController {

    private final UserService userService;

    public ProfileViewController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public String showProfile(Model model) {
        Long currentUserId = SecurityUtils.getCurrentUserId();
        User user = userService.findById(currentUserId);

        model.addAttribute("user", user);
        model.addAttribute("activeNav", "profile");
        return "profile";
    }

    @PostMapping
    public String updateProfile(@RequestParam("fullName") String fullName,
                                @RequestParam(value = "bio", required = false) String bio,
                                RedirectAttributes redirectAttributes) {
        Long currentUserId = SecurityUtils.getCurrentUserId();
        userService.updateProfile(currentUserId, fullName, bio);
        redirectAttributes.addFlashAttribute("successMessage", "Profile updated successfully.");
        return "redirect:/profile";
    }
}
