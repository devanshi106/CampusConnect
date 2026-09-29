package com.CampusConnect.backend;

import org.junit.jupiter.api.Test;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import static org.junit.jupiter.api.Assertions.assertTrue;

class AdminPasswordEncoderTest {

    @Test
    void testDemoAdminPasswordsMatch() {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

        String hash1 = encoder.encode("admin123");
        String hash2 = encoder.encode("admin456");
        String hash3 = encoder.encode("admin789");

        System.out.println("BCRYPT_HASH_1=" + hash1);
        System.out.println("BCRYPT_HASH_2=" + hash2);
        System.out.println("BCRYPT_HASH_3=" + hash3);

        assertTrue(encoder.matches("admin123", hash1));
        assertTrue(encoder.matches("admin456", hash2));
        assertTrue(encoder.matches("admin789", hash3));
    }

    @Test
    void testRoleFromStringParsing() {
        org.junit.jupiter.api.Assertions.assertEquals(
                com.CampusConnect.backend.entity.Role.STUDENT,
                com.CampusConnect.backend.entity.Role.fromString("student"));
        org.junit.jupiter.api.Assertions.assertEquals(
                com.CampusConnect.backend.entity.Role.ORGANISER,
                com.CampusConnect.backend.entity.Role.fromString("organizer"));
        org.junit.jupiter.api.Assertions.assertEquals(
                com.CampusConnect.backend.entity.Role.ORGANISER,
                com.CampusConnect.backend.entity.Role.fromString("ORGANISER"));
    }
}
