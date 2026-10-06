package com.CampusConnect.backend.service;

import com.CampusConnect.backend.entity.Event;
import com.CampusConnect.backend.entity.EventRegistration;
import com.CampusConnect.backend.repository.EventRegistrationRepository;
import com.CampusConnect.backend.repository.EventRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;

@Service
public class EventService {

    private final EventRepository eventRepository;
    private final EventRegistrationRepository registrationRepository;

    public EventService(EventRepository eventRepository, EventRegistrationRepository registrationRepository) {
        this.eventRepository = eventRepository;
        this.registrationRepository = registrationRepository;
    }

    public List<Event> getAllEvents() {
        return eventRepository.findAll();
    }

    public List<Event> getApprovedEvents() {
        return eventRepository.findApprovedEvents();
    }

    public List<Event> getEventsByOrganizer(String organizer) {
        if (organizer == null || organizer.isBlank()) {
            return eventRepository.findAll();
        }
        return eventRepository.findByOrganizerScoped(organizer.trim());
    }

    public List<Event> getEventsByStatus(String status) {
        if (status == null || status.isBlank()) {
            return eventRepository.findAll();
        }
        return eventRepository.findByStatusIgnoreCase(status.trim());
    }

    public Event createEvent(Event event) {
        if (event.getStatus() == null || event.getStatus().isBlank()) {
            event.setStatus("PENDING");
        }
        return eventRepository.save(event);
    }

    public Event updateEventStatus(Long id, String status) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Event not found"));
        event.setStatus(status != null ? status.toUpperCase(Locale.ROOT) : "APPROVED");
        return eventRepository.save(event);
    }

    public void deleteEvent(Long id) {
        if (!eventRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Event not found");
        }
        registrationRepository.deleteByEventId(id);
        eventRepository.deleteById(id);
    }

    public List<String> getRegisteredStudentEmailsForEvent(Long eventId) {
        return registrationRepository.findByEventId(eventId).stream()
                .map(EventRegistration::getStudentEmail)
                .toList();
    }

    public Map<Long, Long> getAllRegistrationCounts() {
        Map<Long, Long> counts = new HashMap<>();
        List<Event> all = eventRepository.findAll();
        for (Event e : all) {
            counts.put(e.getId(), registrationRepository.countByEventId(e.getId()));
        }
        return counts;
    }

    public EventRegistration registerStudent(Long eventId, String studentEmail) {
        if (studentEmail == null || studentEmail.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Student email is required");
        }
        String normalizedEmail = studentEmail.trim().toLowerCase(Locale.ROOT);

        if (!eventRepository.existsById(eventId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Event not found");
        }

        if (registrationRepository.existsByStudentEmailAndEventId(normalizedEmail, eventId)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "You are already registered for this event");
        }

        return registrationRepository.save(new EventRegistration(normalizedEmail, eventId));
    }

    public List<Long> getRegisteredEventIds(String studentEmail) {
        if (studentEmail == null || studentEmail.isBlank()) {
            return List.of();
        }
        String normalizedEmail = studentEmail.trim().toLowerCase(Locale.ROOT);
        return registrationRepository.findByStudentEmail(normalizedEmail)
                .stream()
                .map(EventRegistration::getEventId)
                .toList();
    }

    public void unregisterStudent(Long eventId, String studentEmail) {
        if (studentEmail != null && !studentEmail.isBlank()) {
            String normalizedEmail = studentEmail.trim().toLowerCase(Locale.ROOT);
            registrationRepository.deleteByStudentEmailAndEventId(normalizedEmail, eventId);
        }
    }
}