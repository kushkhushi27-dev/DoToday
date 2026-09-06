package com.dotoday.entity;

public enum TaskPriority {
    LOW("Low", "success"),
    MEDIUM("Medium", "warning"),
    HIGH("High", "danger");

    private final String displayName;
    private final String badgeColor;

    TaskPriority(String displayName, String badgeColor) {
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
