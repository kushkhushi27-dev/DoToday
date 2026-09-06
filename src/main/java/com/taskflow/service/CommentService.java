package com.taskflow.service;

import com.taskflow.dto.CommentRequestDto;
import com.taskflow.dto.CommentResponseDto;
import com.taskflow.entity.Comment;
import com.taskflow.entity.User;

import java.util.List;

public interface CommentService {
    Comment addComment(Long taskId, CommentRequestDto dto, User author);
    List<Comment> getTaskComments(Long taskId, Long currentUserId);
    List<CommentResponseDto> getTaskCommentDtos(Long taskId, Long currentUserId);
}
