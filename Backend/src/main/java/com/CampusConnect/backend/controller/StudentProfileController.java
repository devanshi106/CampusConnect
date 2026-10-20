package com.CampusConnect.backend.controller;

import com.CampusConnect.backend.entity.StudentProfile;
import com.CampusConnect.backend.service.StudentProfileService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/profile")
public class StudentProfileController {

    private final StudentProfileService profileService;

    public StudentProfileController(StudentProfileService profileService) {
        this.profileService = profileService;
    }

    @GetMapping
    public ResponseEntity<StudentProfile> getProfile(@RequestParam(required = false) String email) {
        if (email == null || email.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email parameter is required");
        }
        return profileService.getProfileByEmail(email)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.ok(new StudentProfile(email.trim().toLowerCase())));
    }

    @PutMapping
    public ResponseEntity<StudentProfile> updateProfile(@RequestBody StudentProfile profile) {
        if (profile.getEmail() == null || profile.getEmail().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Profile email is required");
        }
        StudentProfile saved = profileService.saveOrUpdateProfile(profile);
        return ResponseEntity.ok(saved);
    }

    @PostMapping
    public ResponseEntity<StudentProfile> createOrUpdateProfile(@RequestBody StudentProfile profile) {
        return updateProfile(profile);
    }
}
