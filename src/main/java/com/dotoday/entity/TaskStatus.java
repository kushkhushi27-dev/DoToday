package com.dotoday.entity;

public enum TaskStatus {
    TODO("To Do", "secondary"),
    IN_PROGRESS("In Progress", "primary"),
    COMPLETED("Completed", "success");

    private final String displayName;
    private final String badgeColor;

    TaskStatus(String displayName, String badgeColor) {
        this.displayName = displayName;
        this.badgeColor = badgeColor;
    }

    public String getDisplayName() {
        return displayName;
    }

    public String getBadgeColor() {
        return badgeColor;
    }
}
