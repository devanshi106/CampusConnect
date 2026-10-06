package com.CampusConnect.backend.config;

import com.CampusConnect.backend.entity.Event;
import com.CampusConnect.backend.repository.EventRepository;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class EventSeeder {

    @Bean
    ApplicationRunner seedCollegeEvents(EventRepository events) {
        return args -> {
            List<Event> mockEvents = List.of(
                // 1. Hackathons
                new Event(
                    "CodeQuest 2026: 24-Hour Campus Hackathon",
                    "CodeQuest 2026 is our flagship annual 24-hour campus hackathon bringing together programmers, designers, and innovators from all departments. Build solutions for Smart Campus, AI & Accessibility, or Sustainability. Teams of up to 4 members are supported by dedicated industry mentors from top tech companies. Enjoy midnight snacks, high-speed WiFi, hardware lab access, sponsor swag, and compete for a $1,500 prize pool.",
                    "Innovation Center & Virtual Hub",
                    "Hackathons",
                    "Oct 24-25, 2026 • 9:00 AM",
                    "Devs & Hackers Society"
                ),
                new Event(
                    "AI Sprint: Agentic AI Hackathon",
                    "A fast-paced builder sprint focused on autonomous agent workflows, LLM applications, and multimodal tools. Participants will receive free API cloud credits and access to GPU compute clusters. Tackle real challenges in education tech and campus automation. Submissions are judged on novelty, architecture robustness, and practical usability.",
                    "CS Seminar Hall 2",
                    "Hackathons",
                    "Nov 07, 2026 • 10:00 AM",
                    "AI Research Group"
                ),

                // 2. Clubs
                new Event(
                    "Robotics Club: BattleBot Arena & Recruitment",
                    "Witness custom high-torque combat bots clash live in the reinforced arena! The Robotics & Automation Club is opening recruitment across mechanical engineering, embedded systems, and firmware divisions. No prior hardware background required—hands-on starter bootcamps will be hosted for all accepted inductees.",
                    "Campus Amphitheatre",
                    "Clubs",
                    "Oct 18, 2026 • 4:00 PM",
                    "Robotics & Automation Club"
                ),
                new Event(
                    "Design Guild: UI/UX Portfolio Jam & Critique",
                    "Join senior student designers and alumni mentors for an interactive design review and Figma jam. Bring your mobile app designs, web wireframes, or graphic illustrations to receive constructive 1-on-1 critique. Network with peers who share an obsession for typography, clean layouts, and intuitive micro-interactions.",
                    "Design Studio, Block B",
                    "Clubs",
                    "Oct 21, 2026 • 3:30 PM",
                    "Creative Design Guild"
                ),

                // 3. Workshops
                new Event(
                    "Full-Stack Web Development: React & Spring Boot",
                    "An intensive hands-on masterclass taking you through modern enterprise web architecture. Learn how to design RESTful APIs with Spring Boot, connect PostgreSQL via Spring Data JPA, handle password hashing with BCrypt, and build a reactive user interface in React. All attendees receive downloadable project templates and a certificate of completion.",
                    "Computer Lab 4",
                    "Workshops",
                    "Oct 16, 2026 • 2:00 PM",
                    "ACM Student Chapter"
                ),
                new Event(
                    "Cloud DevOps & Kubernetes Crash Course",
                    "Bridge the gap between coding on localhost and shipping reliable apps to the cloud. This interactive workshop covers containerizing applications with Docker, orchestrating clusters with Kubernetes, and setting up automated CI/CD deployment pipelines on AWS.",
                    "Virtual (Google Meet)",
                    "Workshops",
                    "Oct 29, 2026 • 6:00 PM",
                    "Cloud Computing Society"
                ),

                // 4. Competitions
                new Event(
                    "AlgoClash: Speed Coding Championship",
                    "Sharpen your competitive programming instincts! Solve 6 algorithmic problems of escalating difficulty within 2 hours. Problems span graph theory, dynamic programming, and greedy optimization. Live real-time leaderboard display, sponsor prizes, and direct invites to the regional inter-college ICPC training camp.",
                    "Computer Center 1 & 2",
                    "Competitions",
                    "Nov 02, 2026 • 5:00 PM",
                    "Competitive Programming Wing"
                ),
                new Event(
                    "Campus PitchDeck 2026: Startup Battle",
                    "Got an innovative business idea or technology venture? Pitch your 5-minute slide deck to a jury of alumni founders and early-stage venture capitalists. Top 3 teams receive micro-grant funding of $500, incubator co-working desks, and complimentary legal mentorship.",
                    "Management Auditorium",
                    "Competitions",
                    "Nov 12, 2026 • 11:00 AM",
                    "E-Cell (Entrepreneurship Cell)"
                ),

                // 5. Committees (Student Organizers)
                new Event(
                    "Student Council",
                    "The apex student governing committee representing the student community. Student organizers lead campus policy dialogues with university administration, manage campus club funds, organize flagship fests, and champion student rights and campus welfare. Open to all students wishing to join or stand for student elections.",
                    "Senate Hall & Council Office Rm 204",
                    "Committees",
                    "Weekly Assembly • Wed 4:00 PM",
                    "Student Organizers Body"
                ),
                new Event(
                    "CSI Committee",
                    "The Computer Society of India (CSI) student committee is the premier technical body of student organizers on campus. Directs annual hackathons, technical conferences, coding bootcamps, and open-source research wings. Members gain access to national CSI publications, tech certifications, and executive organizing roles.",
                    "Auditorium Hall 1 & CS Labs",
                    "Committees",
                    "Bi-Weekly Tech Sprints • Fri 3:30 PM",
                    "Computer Society of India"
                ),
                new Event(
                    "Airnova",
                    "Airnova is the official student aviation, aeromodelling, and drone engineering committee. Student organizers build autonomous quadcopters, FPV racing drones, and fixed-wing RC aircraft. Join as a student pilot, avionics researcher, CAD designer, or lead organizer for national aero championships and drone expos.",
                    "College Sports Grounds & Aero Hangar",
                    "Committees",
                    "Weekly Build & Trials • Sat 10:00 AM",
                    "Aviation & Aeromodelling Committee"
                ),
                new Event(
                    "Sports Committee",
                    "The Sports Committee of student organizers spearheads all campus athletics, inter-department tournaments, and university varsity teams in Football, Basketball, Cricket, Badminton, and Table Tennis. Student members manage tournament fixtures, referee matches, maintain sports facilities, and lead the annual sports fest.",
                    "Indoor Sports Complex & Track Grounds",
                    "Committees",
                    "Daily Practice & League Trials • 4:30 PM",
                    "Athletics & Games Committee"
                )
            );

            // Ensure all existing events have APPROVED status
            List<Event> existing = events.findAll();
            for (Event e : existing) {
                if (e.getStatus() == null || e.getStatus().isBlank()) {
                    e.setStatus("APPROVED");
                    events.save(e);
                }
                if ("Committees".equalsIgnoreCase(e.getCategory())) {
                    if (e.getTitle().contains("Student Council")) {
                        e.setTitle("Student Council");
                        e.setOrganizer("Student Organizers Body");
                        e.setLocation("Senate Hall & Council Office Rm 204");
                        e.setEventDate("Weekly Assembly • Wed 4:00 PM");
                        e.setDescription("The apex student governing committee representing the student community. Student organizers lead campus policy dialogues with university administration, manage campus club funds, organize flagship fests, and champion student rights and campus welfare. Open to all students wishing to join or stand for student elections.");
                        e.setStatus("APPROVED");
                        events.save(e);
                    } else if (e.getTitle().contains("CSI Committee")) {
                        e.setTitle("CSI Committee");
                        e.setOrganizer("Computer Society of India");
                        e.setLocation("Auditorium Hall 1 & CS Labs");
                        e.setEventDate("Bi-Weekly Tech Sprints • Fri 3:30 PM");
                        e.setDescription("The Computer Society of India (CSI) student committee is the premier technical body of student organizers on campus. Directs annual hackathons, technical conferences, coding bootcamps, and open-source research wings. Members gain access to national CSI publications, tech certifications, and executive organizing roles.");
                        e.setStatus("APPROVED");
                        events.save(e);
                    } else if (e.getTitle().contains("Airnova")) {
                        e.setTitle("Airnova");
                        e.setOrganizer("Aviation & Aeromodelling Committee");
                        e.setLocation("College Sports Grounds & Aero Hangar");
                        e.setEventDate("Weekly Build & Trials • Sat 10:00 AM");
                        e.setDescription("Airnova is the official student aviation, aeromodelling, and drone engineering committee. Student organizers build autonomous quadcopters, FPV racing drones, and fixed-wing RC aircraft. Join as a student pilot, avionics researcher, CAD designer, or lead organizer for national aero championships and drone expos.");
                        e.setStatus("APPROVED");
                        events.save(e);
                    } else if (e.getTitle().contains("Sports Committee")) {
                        e.setTitle("Sports Committee");
                        e.setOrganizer("Athletics & Games Committee");
                        e.setLocation("Indoor Sports Complex & Track Grounds");
                        e.setEventDate("Daily Practice & League Trials • 4:30 PM");
                        e.setDescription("The Sports Committee of student organizers spearheads all campus athletics, inter-department tournaments, and university varsity teams in Football, Basketball, Cricket, Badminton, and Table Tennis. Student members manage tournament fixtures, referee matches, maintain sports facilities, and lead the annual sports fest.");
                        e.setStatus("APPROVED");
                        events.save(e);
                    }
                }
            }

            for (Event event : mockEvents) {
                if (!events.existsByTitle(event.getTitle())) {
                    event.setStatus("APPROVED");
                    events.save(event);
                }
            }
        };
    }
}
