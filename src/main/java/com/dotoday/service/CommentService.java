package com.dotoday.service;

import com.dotoday.dto.CommentRequestDto;
import com.dotoday.dto.CommentResponseDto;
import com.dotoday.entity.Comment;
import com.dotoday.entity.User;

import java.util.List;

public interface CommentService {
    Comment addComment(Long taskId, CommentRequestDto dto, User author);
    List<Comment> getTaskComments(Long taskId, Long currentUserId);
    List<CommentResponseDto> getTaskCommentDtos(Long taskId, Long currentUserId);
}
