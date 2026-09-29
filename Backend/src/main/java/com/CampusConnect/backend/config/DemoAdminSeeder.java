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
    ApplicationRunner seedDemoAdministrators(UserRepository users, PasswordEncoder passwordEncoder) {
        return args -> List.of(
                new DemoAdmin("admin1@campusconnect.demo", "admin123"),
                new DemoAdmin("admin2@campusconnect.demo", "admin456"),
                new DemoAdmin("admin3@campusconnect.demo", "admin789")
        ).forEach(admin -> {
            if (!users.existsByEmail(admin.email())) {
                users.save(new User(admin.email(), passwordEncoder.encode(admin.password()), Role.ADMIN));
            }
        });
    }

    private record DemoAdmin(String email, String password) {
    }
}
