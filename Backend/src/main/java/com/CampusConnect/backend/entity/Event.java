package com.CampusConnect.backend.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "events")
public class Event {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    private String location;

    private String category;

    private String eventDate;

    private String organizer;

    @Column(name = "status")
    private String status = "APPROVED";

    public Event() {
    }

    public Event(String title, String description, String location, String category, String eventDate, String organizer) {
        this(title, description, location, category, eventDate, organizer, "APPROVED");
    }

    public Event(String title, String description, String location, String category, String eventDate, String organizer, String status) {
        this.title = title;
        this.description = description;
        this.location = location;
        this.category = category;
        this.eventDate = eventDate;
        this.organizer = organizer;
        this.status = status != null ? status : "APPROVED";
    }

    public Long getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getEventDate() {
        return eventDate;
    }

    public void setEventDate(String eventDate) {
        this.eventDate = eventDate;
    }

    public String getOrganizer() {
        return organizer;
    }

    public void setOrganizer(String organizer) {
        this.organizer = organizer;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}