package com.CampusConnect.backend.repository;

import com.CampusConnect.backend.entity.Event;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EventRepository extends JpaRepository<Event, Long> {
}