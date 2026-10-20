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
            List<Event> canvaAndCampusEvents = List.of(
                new Event(
                    "AI, Startups & You: The New Rules of Career Growth",
                    "A free live webinar, \"AI, Startups & You: It is showing students how AI is changing careers and how hackathons, ideathons, and startup support can help them build skills, portfolios, and networks.",
                    "Online",
                    "Seminars & Webinars",
                    "Wednesday, 8th July 2026",
                    "7:00 PM IST",
                    null,
                    "the leadership team of Cloud Counselage Pvt. Ltd. and Dolphin Tank India (DTI)",
                    "https://careers.industryacademiacommunity.com/l/9bc1a3cacc",
                    "Not mention",
                    "Free",
                    null,
                    null,
                    "APPROVED"
                ),
                new Event(
                    "S.E INTERVIEW CALL – TRAINING & PLACEMENT COMMITTEE",
                    "An opportunity to become a part of the Training & Placement Committee, contribute to campus placements, enhance your professional skills, and work alongside a dedicated team.",
                    null,
                    "Clubs",
                    "8th July (Wednesday)",
                    "10:00 AM Onwards",
                    null,
                    "Training & Placement Committee,",
                    "https://forms.gle/WNv5SJmMmeqGzq3d7",
                    null,
                    null,
                    null,
                    null,
                    "APPROVED"
                ),
                new Event(
                    "Final Drone Simulation Challenge",
                    "To participate and learn how engineers use MATLAB & Simulink to model, simulate, and test autonomous drone systems.",
                    null,
                    "Virtual Events",
                    null,
                    null,
                    null,
                    "in.mathswork",
                    "https://in.mathworks.com/company/events/webinars/upcoming/simulink-game-day-drone-simulation-challenge-2026-5419650.html",
                    "Registration closes: 17 July 2026",
                    null,
                    null,
                    "Certificate for Participants",
                    "APPROVED"
                ),
                new Event(
                    "CSEDS Student Committee – Interview",
                    "Interviews for the CSEDS Student Committee in contributing to the department and being part of the committee.",
                    null,
                    "Clubs",
                    "20th July Friday",
                    null,
                    null,
                    "CSEDS Student Committee",
                    "https://forms.gle/wBHieY6wSvbEw9xb8",
                    null,
                    null,
                    null,
                    null,
                    "APPROVED"
                ),
                new Event(
                    "Tata Imagination Challenge 2026",
                    "Tata Imagination Challenge 2026 is inviting undergraduate and postgraduate students across any stream or campus in India, giving them a space to bring an idea, shape it across five rounds with the final round culminating in an in-person pitch to the Tata leaders",
                    "online and begin with Round 1: the Tata Quiz — a test of their Tata knowledge, critical thinking, quant and general smarts.",
                    "Virtual Events",
                    null,
                    null,
                    null,
                    "Tata",
                    "https://www.tata.com/careers/programs/tata-imagination-challenge?utm_source=social&utm_medium=TCS&utm_campaign=TIC2026",
                    null,
                    null,
                    null,
                    "A fully sponsored two-day experience in Mumbai, along with exclusive Tata brand goodies.\nVisits to Bombay House, Taj Palace and the Tata Experience Centre\nParticipation certificate for the Top 10 winners:\n₹2 lakh in cash prizes",
                    "APPROVED"
                ),
                new Event(
                    "12-Workshop Series by Dolphin Tank India (DTI)",
                    "Customer Discovery.\nLearn how to understand your customers,conduct effective customer interviews, and identify the right people to build for",
                    "Online",
                    "Workshops",
                    "1st September 2026",
                    "7:00 PM IST",
                    null,
                    "Dolphin Tank India (DTI)",
                    "https://careers.industryacademiacommunity.com/web/checkout/6a06aca7a832961f75a460b5?affiliate=69aff5a723d6117cecc1c296",
                    null,
                    "Free",
                    null,
                    null,
                    "APPROVED"
                ),
                new Event(
                    "PRODUCT VIDYA 2026",
                    "Discover the latest industry products and technologies through live, hands-on demos and real-world solutions, and earn a participation certificate.",
                    "3rd Floor, Lab 308 A and D",
                    "Event",
                    "11 Sep 2026",
                    null,
                    null,
                    "Department of Computer Science Engineering (Data Science)",
                    "https://forms.gle/fFC8KGU6yVtV2jEbA",
                    null,
                    null,
                    null,
                    null,
                    "APPROVED"
                ),
                new Event(
                    "SAKAR – Ganpati Idol Making & Essay Writing Competition",
                    "Ganpati Idol Making & Essay Writing Competition",
                    "VCET",
                    "Competitions",
                    "8th September 2026",
                    "2.00pm to 5.00pm",
                    null,
                    "Ek Bharat Shreshtha Bharat (EBSB) Committee",
                    "https://docs.google.com/forms/d/e/1FAIpQLSfwjvBjn8hMQLhOpHFzOEfv7F0YWprLXM9Gv4IO-0FMucKfwA/viewform?usp=header",
                    null,
                    null,
                    null,
                    null,
                    "APPROVED"
                ),
                new Event(
                    "Institution's Innovation Council (IIC), VCET",
                    "The Institution's Innovation Council (IIC) is an initiative of the Ministry of Education (MoE), Government of India, in collaboration with AICTE, aimed at promoting innovation, research, entrepreneurship, startups, internships, intellectual property awareness, and a culture of creative problem-solving within educational institutions.",
                    null,
                    "Clubs",
                    null,
                    null,
                    null,
                    "Institution's Innovation Council (IIC)",
                    "https://forms.gle/mSp5ABqXmQvQ2JBB6",
                    null,
                    null,
                    null,
                    null,
                    "APPROVED"
                ),
                new Event(
                    "FULL-STACK FUNDAMENTALS\nBuild & Deploy a Backend-Heavy MERN Project",
                    "Learn & build with:\nnode.js & Express\nMongoDB & REST APIs\nReact & Tailwind CSS\nGit, GitHub & Deployment\nCloudinary & CI/CD",
                    "Room no. 314",
                    "Workshops",
                    "13 Aug 2026",
                    "10:30 AM",
                    null,
                    "MLSC – VCET",
                    "https://forms.gle/e474o3QYrnZZatqs8",
                    null,
                    null,
                    null,
                    null,
                    "APPROVED"
                ),
                new Event(
                    "PIRATES OF THE FLAG – CTF CHALLENGE",
                    null,
                    "The event will have one round only\nTRCAC, Dahisar East",
                    "Hackathons",
                    null,
                    null,
                    null,
                    "TRCAC DevClub",
                    "https://www.devclubtrcac.in/zettaabyte/events/pirates-flag",
                    null,
                    "Free",
                    null,
                    "Trophy\nCertificate",
                    "APPROVED"
                ),
                new Event(
                    "BYTEVERSE",
                    "BYTEVERSE is a duo-based technical competition where teams will face challenges in:\n Logical Thinking\n Debugging Data Structures & Algorithms\n AI Code Optimization\n AI vs Human",
                    "VCET, Vasai",
                    "Hackathons",
                    "3rd September 2026",
                    "10:30 AM onwards",
                    "AI & DS",
                    "NSDC",
                    "https://byteverse-2026.vercel.app/",
                    null,
                    null,
                    null,
                    "GOODIES + CASH PRIZES + CERTIFICATES",
                    "APPROVED"
                ),
                new Event(
                    "From Commit to Contribution: Git, GitHub & Open Source Workshop",
                    "Git and GitHub are essential skills for projects, hackathons, internships, and future career opportunities.",
                    "3rd Floor Seminar Hall.",
                    "Workshops",
                    "1st September",
                    "3:30 PM",
                    null,
                    "Microsoft Learn Students Club (MLSC)",
                    "https://forms.gle/w62hMMGA3j4fZQZR8",
                    null,
                    null,
                    null,
                    null,
                    "APPROVED"
                ),
                new Event(
                    "IIT Bombay Techfest 2026–27",
                    "These workshops are a great opportunity to:\nLearn practical & industry-relevant skills\nExplore emerging technologies\n Interact with like-minded students\n Enhance your technical knowledge beyond the classroom",
                    null,
                    "Workshops",
                    null,
                    null,
                    null,
                    "IIT Bombay",
                    "https://forms.gle/FFAXgiJJNZ6Q5Tmm6",
                    null,
                    null,
                    null,
                    null,
                    "APPROVED"
                ),
                new Event(
                    "Product Showcase",
                    "The platform connects innovation and industry through product demonstrations , interactive experiences,digital displays, student presentations and industry institute collaboration",
                    "Vcet Campus",
                    "Event",
                    "Sept 11 , 2026",
                    "9am - 5 am",
                    "All department(Comps, CSE(DS), IT, Electronics, Mech, AI & DS, MMS, Civil)",
                    "Vcet",
                    null,
                    null,
                    null,
                    null,
                    null,
                    "APPROVED"
                ),
                new Event(
                    "Algorithm in Action",
                    "It is an insightful lecture with Mr.Hritik Kanojiya, SDE-|| & Ex. Oracle Corporation, as he shares industry perspectives on algorithms, problem-solving and their real-world applications",
                    "Ground Floar Seminar Hall, Vcet",
                    "Seminars & Webinars",
                    "17 Aug 2026",
                    "9:15 am",
                    "AI & DS",
                    "AI & DS department",
                    null,
                    null,
                    null,
                    null,
                    null,
                    "APPROVED"
                ),
                new Event(
                    "Agile Development and Higher Studies in Germ",
                    "An insightful Expert lecture with MS. Rina Yadav, Compliance Manager, Kion group, Frankfurt am Main, Germany, as he shares a valuable opportunity for students to gain insights into Agile Development, international Career opportunities and higher studies in Germany",
                    "Room No. 424, Vcet",
                    "Seminars & Webinars",
                    "14 Aug 2026",
                    "11:00 am - 12:00 pm",
                    "AI & DS",
                    "AI & DS Department",
                    null,
                    null,
                    null,
                    null,
                    null,
                    "APPROVED"
                ),
                new Event(
                    "Code-O-fiesta",
                    "A National level coding competition off a day for innovation, real-world problem-solving and amazing opportunities",
                    null,
                    "Hackathons",
                    "13 Sep 2025",
                    null,
                    "AI & DS and Comps",
                    "AI & DS, Comps and NSDC",
                    null,
                    null,
                    null,
                    null,
                    null,
                    "APPROVED"
                ),
                new Event(
                    "Paper-A-Thon",
                    "It is a Hackthon for the innovative suggestion that requires space to flourish and for ideas that are worth researching",
                    null,
                    "Hackathons",
                    "8 Aug 2025",
                    "12 pm onwards",
                    "All department(TE Students only)",
                    "Microsoft Learn Student Club",
                    null,
                    null,
                    null,
                    null,
                    null,
                    "APPROVED"
                ),
                new Event(
                    "NSDC Workshop",
                    null,
                    null,
                    "Workshops",
                    "3 Aug 2025",
                    "3:00pm",
                    null,
                    "NSDC",
                    null,
                    null,
                    null,
                    null,
                    null,
                    "APPROVED"
                )
            );

            List<Event> committees = List.of(
                new Event(
                    "Student Council",
                    "The apex student governing committee representing the student community. Student organizers lead campus policy dialogues with university administration, manage campus club funds, organize flagship fests, and champion student rights and campus welfare. Open to all students wishing to join or stand for student elections.",
                    "Senate Hall & Council Office Rm 204",
                    "Committees",
                    "Weekly Assembly • Wed 4:00 PM",
                    "4:00 PM",
                    "All Departments",
                    "Student Organizers Body",
                    null,
                    null,
                    "Free",
                    null,
                    null,
                    "APPROVED"
                ),
                new Event(
                    "CSI Committee",
                    "The Computer Society of India (CSI) student committee is the premier technical body of student organizers on campus. Directs annual hackathons, technical conferences, coding bootcamps, and open-source research wings. Members gain access to national CSI publications, tech certifications, and executive organizing roles.",
                    "Auditorium Hall 1 & CS Labs",
                    "Committees",
                    "Bi-Weekly Tech Sprints • Fri 3:30 PM",
                    "3:30 PM",
                    "Computer Science & IT",
                    "Computer Society of India",
                    null,
                    null,
                    "Free",
                    null,
                    null,
                    "APPROVED"
                ),
                new Event(
                    "Airnova",
                    "Airnova is the official student aviation, aeromodelling, and drone engineering committee. Student organizers build autonomous quadcopters, FPV racing drones, and fixed-wing RC aircraft. Join as a student pilot, avionics researcher, CAD designer, or lead organizer for national aero championships and drone expos.",
                    "College Sports Grounds & Aero Hangar",
                    "Committees",
                    "Weekly Build & Trials • Sat 10:00 AM",
                    "10:00 AM",
                    "Mechanical & Robotics",
                    "Aviation & Aeromodelling Committee",
                    null,
                    null,
                    "Free",
                    null,
                    null,
                    "APPROVED"
                ),
                new Event(
                    "Sports Committee",
                    "The Sports Committee of student organizers spearheads all campus athletics, inter-department tournaments, and university varsity teams in Football, Basketball, Cricket, Badminton, and Table Tennis. Student members manage tournament fixtures, referee matches, maintain sports facilities, and lead the annual sports fest.",
                    "Indoor Sports Complex & Track Grounds",
                    "Committees",
                    "Daily Practice & League Trials • 4:30 PM",
                    "4:30 PM",
                    "All Departments",
                    "Athletics & Games Committee",
                    null,
                    null,
                    "Free",
                    null,
                    null,
                    "APPROVED"
                )
            );

            // Upsert / Seed Canva events
            for (Event event : canvaAndCampusEvents) {
                List<Event> matches = events.findByTitle(event.getTitle());
                if (!matches.isEmpty()) {
                    Event existing = matches.get(0);
                    existing.setDescription(event.getDescription());
                    existing.setLocation(event.getLocation());
                    existing.setCategory(event.getCategory());
                    existing.setEventDate(event.getEventDate());
                    existing.setEventTime(event.getEventTime());
                    existing.setDepartment(event.getDepartment());
                    existing.setOrganizer(event.getOrganizer());
                    existing.setRegistrationLink(event.getRegistrationLink());
                    existing.setDeadline(event.getDeadline());
                    existing.setFee(event.getFee());
                    existing.setTeamSize(event.getTeamSize());
                    existing.setPrize(event.getPrize());
                    existing.setStatus("APPROVED");
                    existing.setRegistrationRequirements(getDefaultRequirements(event.getCategory()));
                    events.save(existing);
                    for (int i = 1; i < matches.size(); i++) {
                        events.delete(matches.get(i));
                    }
                } else {
                    event.setRegistrationRequirements(getDefaultRequirements(event.getCategory()));
                    events.save(event);
                }
            }

            // Upsert / Seed Committees
            for (Event comm : committees) {
                List<Event> matches = events.findByTitle(comm.getTitle());
                if (!matches.isEmpty()) {
                    Event existing = matches.get(0);
                    existing.setDescription(comm.getDescription());
                    existing.setLocation(comm.getLocation());
                    existing.setCategory(comm.getCategory());
                    existing.setEventDate(comm.getEventDate());
                    existing.setEventTime(comm.getEventTime());
                    existing.setDepartment(comm.getDepartment());
                    existing.setOrganizer(comm.getOrganizer());
                    existing.setStatus("APPROVED");
                    existing.setRegistrationRequirements(getDefaultRequirements(comm.getCategory()));
                    events.save(existing);
                    for (int i = 1; i < matches.size(); i++) {
                        events.delete(matches.get(i));
                    }
                } else {
                    comm.setRegistrationRequirements(getDefaultRequirements(comm.getCategory()));
                    events.save(comm);
                }
            }
        };
    }

    private String getDefaultRequirements(String category) {
        if (category == null) return "Statement of Interest;Relevant Background / Skills";
        String cat = category.toLowerCase();
        if (cat.contains("hackathon")) {
            return "Number of Team Members;Topic / Track Selected for Hackathon;GitHub / Project Portfolio Link";
        } else if (cat.contains("workshop")) {
            return "Prior Experience Level in Topic;What do you hope to learn / build in this workshop?";
        } else if (cat.contains("committee") || cat.contains("club")) {
            return "Statement of Purpose (Why do you want to join?);Relevant Leadership or Technical Experience;Available Hours per Week";
        } else if (cat.contains("competition")) {
            return "Participation Mode (Solo or Team);Chosen Competition Track / Idea Summary";
        } else if (cat.contains("seminar") || cat.contains("webinar")) {
            return "Topic of Interest;Questions for the Speaker or Panelists";
        }
        return "Statement of Interest;Relevant Background / Skills";
    }
}
