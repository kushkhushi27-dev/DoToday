package com.dotoday.exception;

import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.ui.Model;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.servlet.ModelAndView;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@ControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    private boolean isApiRequest(HttpServletRequest request) {
        String uri = request.getRequestURI();
        String accept = request.getHeader("Accept");
        return uri.startsWith("/api/") || (accept != null && accept.contains("application/json"));
    }

    @ExceptionHandler(ResourceNotFoundException.class)
    public Object handleResourceNotFound(ResourceNotFoundException ex, HttpServletRequest request, Model model) {
        log.warn("Resource not found: {}", ex.getMessage());
        if (isApiRequest(request)) {
            Map<String, Object> error = new HashMap<>();
            error.put("timestamp", LocalDateTime.now().toString());
            error.put("status", HttpStatus.NOT_FOUND.value());
            error.put("error", "Not Found");
            error.put("message", ex.getMessage());
            error.put("path", request.getRequestURI());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        }

        ModelAndView mav = new ModelAndView("error/404");
        mav.addObject("errorMessage", ex.getMessage());
        mav.addObject("statusCode", 404);
        mav.setStatus(HttpStatus.NOT_FOUND);
        return mav;
    }

    @ExceptionHandler(UnauthorizedAccessException.class)
    public Object handleUnauthorizedAccess(UnauthorizedAccessException ex, HttpServletRequest request, Model model) {
        log.warn("Unauthorized access: {}", ex.getMessage());
        if (isApiRequest(request)) {
            Map<String, Object> error = new HashMap<>();
            error.put("timestamp", LocalDateTime.now().toString());
            error.put("status", HttpStatus.FORBIDDEN.value());
            error.put("error", "Forbidden");
            error.put("message", ex.getMessage());
            error.put("path", request.getRequestURI());
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(error);
        }

        ModelAndView mav = new ModelAndView("error/403");
        mav.addObject("errorMessage", ex.getMessage());
        mav.addObject("statusCode", 403);
        mav.setStatus(HttpStatus.FORBIDDEN);
        return mav;
    }

    @ExceptionHandler(BadRequestException.class)
    public Object handleBadRequest(BadRequestException ex, HttpServletRequest request, Model model) {
        log.warn("Bad request: {}", ex.getMessage());
        if (isApiRequest(request)) {
            Map<String, Object> error = new HashMap<>();
            error.put("timestamp", LocalDateTime.now().toString());
            error.put("status", HttpStatus.BAD_REQUEST.value());
            error.put("error", "Bad Request");
            error.put("message", ex.getMessage());
            error.put("path", request.getRequestURI());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }

        ModelAndView mav = new ModelAndView("error/500");
        mav.addObject("errorMessage", ex.getMessage());
        mav.addObject("statusCode", 400);
        mav.setStatus(HttpStatus.BAD_REQUEST);
        return mav;
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleValidationExceptions(MethodArgumentNotValidException ex, HttpServletRequest request) {
        Map<String, String> fieldErrors = new HashMap<>();
        ex.getBindingResult().getFieldErrors().forEach(error -> 
            fieldErrors.put(error.getField(), error.getDefaultMessage())
        );

        Map<String, Object> error = new HashMap<>();
        error.put("timestamp", LocalDateTime.now().toString());
        error.put("status", HttpStatus.BAD_REQUEST.value());
        error.put("error", "Validation Failed");
        error.put("fieldErrors", fieldErrors);
        error.put("path", request.getRequestURI());

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
    }

    @ExceptionHandler(Exception.class)
    public Object handleGeneralException(Exception ex, HttpServletRequest request) {
        log.error("Unhandled exception occurred", ex);
        if (isApiRequest(request)) {
            Map<String, Object> error = new HashMap<>();
            error.put("timestamp", LocalDateTime.now().toString());
            error.put("status", HttpStatus.INTERNAL_SERVER_ERROR.value());
            error.put("error", "Internal Server Error");
            error.put("message", ex.getMessage());
            error.put("path", request.getRequestURI());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }

        ModelAndView mav = new ModelAndView("error/500");
        mav.addObject("errorMessage", "An unexpected error occurred: " + ex.getMessage());
        mav.addObject("statusCode", 500);
        mav.setStatus(HttpStatus.INTERNAL_SERVER_ERROR);
        return mav;
    }
}
