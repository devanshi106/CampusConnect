package com.CampusConnect.backend.repository;

import com.CampusConnect.backend.entity.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface EventRepository extends JpaRepository<Event, Long> {
    boolean existsByTitle(String title);

    List<Event> findByStatusIgnoreCase(String status);

    @Query("SELECT e FROM Event e WHERE LOWER(e.organizer) = LOWER(:organizer) OR LOWER(e.title) LIKE LOWER(CONCAT('%', :organizer, '%'))")
    List<Event> findByOrganizerScoped(@Param("organizer") String organizer);

    @Query("SELECT e FROM Event e WHERE e.status IS NULL OR UPPER(e.status) = 'APPROVED'")
    List<Event> findApprovedEvents();
}