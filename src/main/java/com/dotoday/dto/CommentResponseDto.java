package com.dotoday.dto;

import com.dotoday.entity.Comment;

import java.time.LocalDateTime;

public class CommentResponseDto {
    private Long id;
    private String content;
    private Long authorId;
    private String authorName;
    private String authorInitials;
    private String authorColor;
    private LocalDateTime createdAt;
    private String formattedCreatedAt;

    public CommentResponseDto() {
    }

    public static CommentResponseDto fromEntity(Comment comment) {
        CommentResponseDto dto = new CommentResponseDto();
        dto.setId(comment.getId());
        dto.setContent(comment.getContent());
        if (comment.getAuthor() != null) {
            dto.setAuthorId(comment.getAuthor().getId());
            dto.setAuthorName(comment.getAuthor().getFullName());
            dto.setAuthorInitials(comment.getAuthor().getInitials());
            dto.setAuthorColor(comment.getAuthor().getAvatarColor());
        }
        dto.setCreatedAt(comment.getCreatedAt());
        dto.setFormattedCreatedAt(comment.getFormattedCreatedAt());
        return dto;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public Long getAuthorId() {
        return authorId;
    }

    public void setAuthorId(Long authorId) {
        this.authorId = authorId;
    }

    public String getAuthorName() {
        return authorName;
    }

    public void setAuthorName(String authorName) {
        this.authorName = authorName;
    }

    public String getAuthorInitials() {
        return authorInitials;
    }

    public void setAuthorInitials(String authorInitials) {
        this.authorInitials = authorInitials;
    }

    public String getAuthorColor() {
        return authorColor;
    }

    public void setAuthorColor(String authorColor) {
        this.authorColor = authorColor;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public String getFormattedCreatedAt() {
        return formattedCreatedAt;
    }

    public void setFormattedCreatedAt(String formattedCreatedAt) {
        this.formattedCreatedAt = formattedCreatedAt;
    }
}
