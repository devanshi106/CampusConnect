package com.CampusConnect.backend.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "event_registrations", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"student_email", "event_id"})
})
public class EventRegistration {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "student_email", nullable = false)
    private String studentEmail;

    @Column(name = "event_id", nullable = false)
    private Long eventId;

    private LocalDateTime registeredAt = LocalDateTime.now();

    public EventRegistration() {
    }

    public EventRegistration(String studentEmail, Long eventId) {
        this.studentEmail = studentEmail;
        this.eventId = eventId;
        this.registeredAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public String getStudentEmail() {
        return studentEmail;
    }

    public void setStudentEmail(String studentEmail) {
        this.studentEmail = studentEmail;
    }

    public Long getEventId() {
        return eventId;
    }

    public void setEventId(Long eventId) {
        this.eventId = eventId;
    }

    public LocalDateTime getRegisteredAt() {
        return registeredAt;
    }

    public void setRegisteredAt(LocalDateTime registeredAt) {
        this.registeredAt = registeredAt;
    }
}
