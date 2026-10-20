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

    private String eventTime;

    private String department;

    private String organizer;

    @Column(columnDefinition = "TEXT")
    private String registrationLink;

    private String deadline;

    private String fee;

    private String teamSize;

    @Column(columnDefinition = "TEXT")
    private String prize;

    @Column(name = "status")
    private String status = "APPROVED";

    @Column(columnDefinition = "TEXT")
    private String registrationRequirements;

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

    public Event(String title, String description, String location, String category, String eventDate,
                 String eventTime, String department, String organizer, String registrationLink,
                 String deadline, String fee, String teamSize, String prize, String status) {
        this.title = title;
        this.description = description;
        this.location = location;
        this.category = category;
        this.eventDate = eventDate;
        this.eventTime = eventTime;
        this.department = department;
        this.organizer = organizer;
        this.registrationLink = registrationLink;
        this.deadline = deadline;
        this.fee = fee;
        this.teamSize = teamSize;
        this.prize = prize;
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

    public String getEventTime() {
        return eventTime;
    }

    public void setEventTime(String eventTime) {
        this.eventTime = eventTime;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public String getOrganizer() {
        return organizer;
    }

    public void setOrganizer(String organizer) {
        this.organizer = organizer;
    }

    public String getRegistrationLink() {
        return registrationLink;
    }

    public void setRegistrationLink(String registrationLink) {
        this.registrationLink = registrationLink;
    }

    public String getDeadline() {
        return deadline;
    }

    public void setDeadline(String deadline) {
        this.deadline = deadline;
    }

    public String getFee() {
        return fee;
    }

    public void setFee(String fee) {
        this.fee = fee;
    }

    public String getTeamSize() {
        return teamSize;
    }

    public void setTeamSize(String teamSize) {
        this.teamSize = teamSize;
    }

    public String getPrize() {
        return prize;
    }

    public void setPrize(String prize) {
        this.prize = prize;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getRegistrationRequirements() {
        return registrationRequirements;
    }

    public void setRegistrationRequirements(String registrationRequirements) {
        this.registrationRequirements = registrationRequirements;
    }
}