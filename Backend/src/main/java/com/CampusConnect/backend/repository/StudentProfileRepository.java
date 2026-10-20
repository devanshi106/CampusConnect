package com.CampusConnect.backend.repository;

import com.CampusConnect.backend.entity.StudentProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface StudentProfileRepository extends JpaRepository<StudentProfile, Long> {
    Optional<StudentProfile> findByEmailIgnoreCase(String email);
    boolean existsByEmailIgnoreCase(String email);
}
