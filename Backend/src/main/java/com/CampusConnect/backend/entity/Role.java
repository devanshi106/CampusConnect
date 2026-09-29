package com.CampusConnect.backend.entity;

import com.fasterxml.jackson.annotation.JsonCreator;

public enum Role {
    STUDENT,
    ORGANISER,
    ADMIN;

    @JsonCreator
    public static Role fromString(String value) {
        if (value == null || value.isBlank()) {
            return STUDENT;
        }
        String normalized = value.trim().toUpperCase();
        if (normalized.equals("ORGANIZER") || normalized.equals("ORGANISER")) {
            return ORGANISER;
        }
        if (normalized.equals("ADMIN") || normalized.equals("ADMINISTRATOR")) {
            return ADMIN;
        }
        return STUDENT;
    }
}
