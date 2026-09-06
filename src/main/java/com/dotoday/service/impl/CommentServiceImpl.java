package com.dotoday.service.impl;

import com.dotoday.dto.CommentRequestDto;
import com.dotoday.dto.CommentResponseDto;
import com.dotoday.entity.ActivityAction;
import com.dotoday.entity.Comment;
import com.dotoday.entity.Task;
import com.dotoday.entity.User;
import com.dotoday.exception.BadRequestException;
import com.dotoday.repository.CommentRepository;
import com.dotoday.service.ActivityLogService;
import com.dotoday.service.CommentService;
import com.dotoday.service.TaskService;
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
