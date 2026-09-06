package com.taskflow.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class ProjectRequestDto {

    @NotBlank(message = "Project name is required")
    @Size(min = 2, max = 120, message = "Project name must be between 2 and 120 characters")
    private String name;

    private String description;

    private String color = "#3B82F6";

    public ProjectRequestDto() {
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }
}
