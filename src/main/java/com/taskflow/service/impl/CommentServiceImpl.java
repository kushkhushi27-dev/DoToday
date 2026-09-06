package com.taskflow.service.impl;

import com.taskflow.dto.CommentRequestDto;
import com.taskflow.dto.CommentResponseDto;
import com.taskflow.entity.ActivityAction;
import com.taskflow.entity.Comment;
import com.taskflow.entity.Task;
import com.taskflow.entity.User;
import com.taskflow.exception.BadRequestException;
import com.taskflow.repository.CommentRepository;
import com.taskflow.service.ActivityLogService;
import com.taskflow.service.CommentService;
import com.taskflow.service.TaskService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class CommentServiceImpl implements CommentService {

    private final CommentRepository commentRepository;
    private final TaskService taskService;
    private final ActivityLogService activityLogService;

    public CommentServiceImpl(CommentRepository commentRepository,
                              TaskService taskService,
                              ActivityLogService activityLogService) {
        this.commentRepository = commentRepository;
        this.taskService = taskService;
        this.activityLogService = activityLogService;
    }

    @Override
    public Comment addComment(Long taskId, CommentRequestDto dto, User author) {
        if (dto.getContent() == null || dto.getContent().trim().isBlank()) {
            throw new BadRequestException("Comment cannot be empty");
        }

        Task task = taskService.getTaskById(taskId, author.getId());

        Comment comment = new Comment(dto.getContent().trim(), task, author);
        Comment savedComment = commentRepository.save(comment);

        activityLogService.logActivity(
                ActivityAction.COMMENT_ADDED,
                "commented on task \"" + task.getTitle() + "\"",
                "COMMENT",
                savedComment.getId(),
                task.getProject(),
                author
        );

        return savedComment;
    }

    @Override
    @Transactional(readOnly = true)
    public List<Comment> getTaskComments(Long taskId, Long currentUserId) {
        taskService.getTaskById(taskId, currentUserId); // verifies authorization
        return commentRepository.findByTaskIdOrderByCreatedAtDesc(taskId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<CommentResponseDto> getTaskCommentDtos(Long taskId, Long currentUserId) {
        return getTaskComments(taskId, currentUserId).stream()
                .map(CommentResponseDto::fromEntity)
                .collect(Collectors.toList());
    }
}
