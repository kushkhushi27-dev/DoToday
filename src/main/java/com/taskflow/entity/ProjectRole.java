package com.taskflow.entity;

public enum ProjectRole {
    OWNER("Owner", "primary"),
    MEMBER("Member", "info"),
    VIEWER("Viewer", "secondary");

    private final String displayName;
    private final String badgeColor;

    ProjectRole(String displayName, String badgeColor) {
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
