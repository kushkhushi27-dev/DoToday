package com.taskflow.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class CommentRequestDto {

    @NotBlank(message = "Comment content cannot be empty")
    @Size(max = 2000, message = "Comment must not exceed 2000 characters")
    private String content;

    public CommentRequestDto() {
    }

    public CommentRequestDto(String content) {
        this.content = content;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }
}
