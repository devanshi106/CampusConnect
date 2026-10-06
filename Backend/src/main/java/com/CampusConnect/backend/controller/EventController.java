package com.CampusConnect.backend.controller;

import com.CampusConnect.backend.entity.Event;
import com.CampusConnect.backend.entity.EventRegistration;
import com.CampusConnect.backend.service.EventService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/events")
public class EventController {

    private final EventService eventService;

    public EventController(EventService eventService) {
        this.eventService = eventService;
    }

    @GetMapping
    public List<Event> getEvents(@RequestParam(required = false) String status,
                                 @RequestParam(required = false, defaultValue = "false") boolean all,
                                 @RequestParam(required = false) String organizer) {
        if (all) {
            return eventService.getAllEvents();
        }
        if (organizer != null && !organizer.isBlank()) {
            return eventService.getEventsByOrganizer(organizer);
        }
        if (status != null && !status.isBlank()) {
            return eventService.getEventsByStatus(status);
        }
        return eventService.getApprovedEvents();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Event createEvent(@RequestBody Event event) {
        if (event.getStatus() == null || event.getStatus().isBlank()) {
            event.setStatus("PENDING");
        }
        return eventService.createEvent(event);
    }

    @PostMapping("/{id}/approve")
    public Event approveEvent(@PathVariable Long id) {
        return eventService.updateEventStatus(id, "APPROVED");
    }

    @PostMapping("/{id}/reject")
    public Event rejectEvent(@PathVariable Long id) {
        return eventService.updateEventStatus(id, "REJECTED");
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteEvent(@PathVariable Long id) {
        eventService.deleteEvent(id);
    }

    @GetMapping("/{id}/attendees")
    public List<String> getEventAttendees(@PathVariable Long id) {
        return eventService.getRegisteredStudentEmailsForEvent(id);
    }

    @GetMapping("/registration-counts")
    public Map<Long, Long> getRegistrationCounts() {
        return eventService.getAllRegistrationCounts();
    }

    @PostMapping("/{id}/register")
    @ResponseStatus(HttpStatus.CREATED)
    public Map<String, Object> registerForEvent(@PathVariable Long id, @RequestBody Map<String, String> request) {
        String email = request.getOrDefault("email", request.get("studentEmail"));
        EventRegistration registration = eventService.registerStudent(id, email);
        return Map.of(
                "success", true,
                "message", "Successfully registered for event",
                "eventId", registration.getEventId(),
                "studentEmail", registration.getStudentEmail()
        );
    }

    @GetMapping("/my-registrations")
    public List<Long> getMyRegistrations(@RequestParam String email) {
        return eventService.getRegisteredEventIds(email);
    }

    @DeleteMapping("/{id}/register")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void unregisterFromEvent(@PathVariable Long id, @RequestParam String email) {
        eventService.unregisterStudent(id, email);
    }
}