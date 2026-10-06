package com.CampusConnect.backend.repository;

import com.CampusConnect.backend.entity.EventRegistration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface EventRegistrationRepository extends JpaRepository<EventRegistration, Long> {

    boolean existsByStudentEmailAndEventId(String studentEmail, Long eventId);

    List<EventRegistration> findByStudentEmail(String studentEmail);

    List<EventRegistration> findByEventId(Long eventId);

    long countByEventId(Long eventId);

    @Transactional
    void deleteByStudentEmailAndEventId(String studentEmail, Long eventId);

    @Transactional
    void deleteByEventId(Long eventId);
}
