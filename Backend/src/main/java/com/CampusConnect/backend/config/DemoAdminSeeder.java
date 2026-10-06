package com.CampusConnect.backend.config;

import com.CampusConnect.backend.entity.Role;
import com.CampusConnect.backend.entity.User;
import com.CampusConnect.backend.repository.UserRepository;
import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;

@Configuration
public class DemoAdminSeeder {

    @Bean
    @ConditionalOnProperty(prefix = "app.demo", name = "seed-admins", havingValue = "true", matchIfMissing = true)
    ApplicationRunner seedDemoAccounts(UserRepository users, PasswordEncoder passwordEncoder) {
        return args -> {
            List.of(
                    new DemoUser("admin1@campusconnect.demo", "admin123", Role.ADMIN, "Administration"),
                    new DemoUser("admin2@campusconnect.demo", "admin456", Role.ADMIN, "Administration"),
                    new DemoUser("admin3@campusconnect.demo", "admin789", Role.ADMIN, "Administration"),
                    new DemoUser("council@campusconnect.demo", "council123", Role.ORGANISER, "Student Council"),
                    new DemoUser("csi@campusconnect.demo", "csi123", Role.ORGANISER, "CSI Committee"),
                    new DemoUser("airnova@campusconnect.demo", "airnova123", Role.ORGANISER, "Airnova"),
                    new DemoUser("sports@campusconnect.demo", "sports123", Role.ORGANISER, "Sports Committee")
            ).forEach(demo -> {
                if (!users.existsByEmail(demo.email())) {
                    users.save(new User(demo.email(), passwordEncoder.encode(demo.password()), demo.role(), demo.organization()));
                }
            });
        };
    }

    private record DemoUser(String email, String password, Role role, String organization) {
    }
}
