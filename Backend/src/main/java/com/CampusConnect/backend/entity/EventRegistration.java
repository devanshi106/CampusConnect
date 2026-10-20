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

    private String studentName;

    private String department;

    @Column(name = "academic_year")
    private String year;

    @Column(columnDefinition = "TEXT")
    private String answers;

    private LocalDateTime registeredAt = LocalDateTime.now();

    public EventRegistration() {
    }

    public EventRegistration(String studentEmail, Long eventId) {
        this(studentEmail, eventId, null, null, null, null);
    }

    public EventRegistration(String studentEmail, Long eventId, String studentName, String department, String year, String answers) {
        this.studentEmail = studentEmail;
        this.eventId = eventId;
        this.studentName = studentName;
        this.department = department;
        this.year = year;
        this.answers = answers;
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

    public String getStudentName() {
        return studentName;
    }

    public void setStudentName(String studentName) {
        this.studentName = studentName;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public String getYear() {
        return year;
    }

    public void setYear(String year) {
        this.year = year;
    }

    public String getAnswers() {
        return answers;
    }

    public void setAnswers(String answers) {
        this.answers = answers;
    }

    public LocalDateTime getRegisteredAt() {
        return registeredAt;
    }

    public void setRegisteredAt(LocalDateTime registeredAt) {
        this.registeredAt = registeredAt;
    }
}
