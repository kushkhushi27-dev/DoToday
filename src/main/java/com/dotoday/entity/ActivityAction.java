package com.dotoday.entity;

public enum ActivityAction {
    TASK_CREATED("created a task"),
    TASK_UPDATED("updated task"),
    TASK_COMPLETED("completed task"),
    TASK_DELETED("deleted a task"),
    MEMBER_ADDED("added member to project"),
    TASK_ASSIGNED("assigned task"),
    COMMENT_ADDED("commented on task");

    private final String description;

    ActivityAction(String description) {
        this.description = description;
    }

    public String getDescription() {
        return description;
    }
}
