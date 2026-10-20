package com.CampusConnect.backend.service;

import com.CampusConnect.backend.entity.StudentProfile;
import com.CampusConnect.backend.repository.StudentProfileRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Locale;
import java.util.Optional;

@Service
public class StudentProfileService {

    private final StudentProfileRepository profileRepository;

    public StudentProfileService(StudentProfileRepository profileRepository) {
        this.profileRepository = profileRepository;
    }

    public Optional<StudentProfile> getProfileByEmail(String email) {
        if (email == null || email.isBlank()) {
            return Optional.empty();
        }
        return profileRepository.findByEmailIgnoreCase(email.trim().toLowerCase(Locale.ROOT));
    }

    public StudentProfile saveOrUpdateProfile(StudentProfile profile) {
        if (profile.getEmail() == null || profile.getEmail().isBlank()) {
            throw new IllegalArgumentException("Student email cannot be blank");
        }
        String normalizedEmail = profile.getEmail().trim().toLowerCase(Locale.ROOT);
        profile.setEmail(normalizedEmail);

        Optional<StudentProfile> existingOpt = profileRepository.findByEmailIgnoreCase(normalizedEmail);
        StudentProfile target;
        if (existingOpt.isPresent()) {
            target = existingOpt.get();
        } else {
            target = new StudentProfile(normalizedEmail);
        }

        target.setFullName(profile.getFullName());
        target.setPhone(profile.getPhone());
        target.setCollege(profile.getCollege());
        target.setDepartment(profile.getDepartment());
        target.setYear(profile.getYear());
        target.setRollNo(profile.getRollNo());
        target.setPortfolio(profile.getPortfolio());
        target.setSkills(profile.getSkills());
        target.setBio(profile.getBio());
        target.setUpdatedAt(LocalDateTime.now());

        return profileRepository.save(target);
    }
}
