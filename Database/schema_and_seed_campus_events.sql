-- CampusConnect: Database Schema & Seed Data for Campus Events from Canva Dataset
-- This script adds/updates the events table columns and seeds the 20 campus events + 4 committees.

-- 1. Ensure table schema is up to date
CREATE TABLE IF NOT EXISTS events (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255),
    description TEXT,
    location VARCHAR(255),
    category VARCHAR(255),
    event_date VARCHAR(255),
    event_time VARCHAR(255),
    department VARCHAR(255),
    organizer VARCHAR(255),
    registration_link TEXT,
    deadline VARCHAR(255),
    fee VARCHAR(255),
    team_size VARCHAR(255),
    prize TEXT,
    status VARCHAR(50) DEFAULT 'APPROVED'
);

-- Ensure all columns exist
ALTER TABLE events ADD COLUMN IF NOT EXISTS event_time VARCHAR(255);
ALTER TABLE events ADD COLUMN IF NOT EXISTS department VARCHAR(255);
ALTER TABLE events ADD COLUMN IF NOT EXISTS registration_link TEXT;
ALTER TABLE events ADD COLUMN IF NOT EXISTS deadline VARCHAR(255);
ALTER TABLE events ADD COLUMN IF NOT EXISTS fee VARCHAR(255);
ALTER TABLE events ADD COLUMN IF NOT EXISTS team_size VARCHAR(255);
ALTER TABLE events ADD COLUMN IF NOT EXISTS prize TEXT;
ALTER TABLE events ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'APPROVED';

-- 2. Seed Campus Events from Canva dataset
INSERT INTO events (title, description, location, category, event_date, event_time, department, organizer, registration_link, deadline, fee, team_size, prize, status)
VALUES
    ('AI, Startups & You: The New Rules of Career Growth', 'A free live webinar, "AI, Startups & You: It is showing students how AI is changing careers and how hackathons, ideathons, and startup support can help them build skills, portfolios, and networks.', 'Online', 'Seminars & Webinars', 'Wednesday, 8th July 2026', '7:00 PM IST', NULL, 'the leadership team of Cloud Counselage Pvt. Ltd. and Dolphin Tank India (DTI)', 'https://careers.industryacademiacommunity.com/l/9bc1a3cacc', 'Not mention', 'Free', NULL, NULL, 'APPROVED'),
    ('S.E INTERVIEW CALL – TRAINING & PLACEMENT COMMITTEE', 'An opportunity to become a part of the Training & Placement Committee, contribute to campus placements, enhance your professional skills, and work alongside a dedicated team.', NULL, 'Clubs', '8th July (Wednesday)', '10:00 AM Onwards', NULL, 'Training & Placement Committee,', 'https://forms.gle/WNv5SJmMmeqGzq3d7', NULL, NULL, NULL, NULL, 'APPROVED'),
    ('Final Drone Simulation Challenge', 'To participate and learn how engineers use MATLAB & Simulink to model, simulate, and test autonomous drone systems.', NULL, 'Virtual Events', NULL, NULL, NULL, 'in.mathswork', 'https://in.mathworks.com/company/events/webinars/upcoming/simulink-game-day-drone-simulation-challenge-2026-5419650.html', 'Registration closes: 17 July 2026', NULL, NULL, 'Certificate for Participants', 'APPROVED'),
    ('CSEDS Student Committee – Interview', 'Interviews for the CSEDS Student Committee in contributing to the department and being part of the committee.', NULL, 'Clubs', '20th July Friday', NULL, NULL, 'CSEDS Student Committee', 'https://forms.gle/wBHieY6wSvbEw9xb8', NULL, NULL, NULL, NULL, 'APPROVED'),
    ('Tata Imagination Challenge 2026', 'Tata Imagination Challenge 2026 is inviting undergraduate and postgraduate students across any stream or campus in India, giving them a space to bring an idea, shape it across five rounds with the final round culminating in an in-person pitch to the Tata leaders', 'online and begin with Round 1: the Tata Quiz — a test of their Tata knowledge, critical thinking, quant and general smarts.', 'Virtual Events', NULL, NULL, NULL, 'Tata', 'https://www.tata.com/careers/programs/tata-imagination-challenge?utm_source=social&utm_medium=TCS&utm_campaign=TIC2026', NULL, NULL, NULL, 'A fully sponsored two-day experience in Mumbai, along with exclusive Tata brand goodies.
Visits to Bombay House, Taj Palace and the Tata Experience Centre
Participation certificate for the Top 10 winners:
₹2 lakh in cash prizes', 'APPROVED'),
    ('12-Workshop Series by Dolphin Tank India (DTI)', 'Customer Discovery.
Learn how to understand your customers,conduct effective customer interviews, and identify the right people to build for', 'Online', 'Workshops', '1st September 2026', '7:00 PM IST', NULL, 'Dolphin Tank India (DTI)', 'https://careers.industryacademiacommunity.com/web/checkout/6a06aca7a832961f75a460b5?affiliate=69aff5a723d6117cecc1c296', NULL, 'Free', NULL, NULL, 'APPROVED'),
    ('PRODUCT VIDYA 2026', 'Discover the latest industry products and technologies through live, hands-on demos and real-world solutions, and earn a participation certificate.', '3rd Floor, Lab 308 A and D', 'Event', '11 Sep 2026', NULL, NULL, 'Department of Computer Science Engineering (Data Science)', 'https://forms.gle/fFC8KGU6yVtV2jEbA', NULL, NULL, NULL, NULL, 'APPROVED'),
    ('SAKAR – Ganpati Idol Making & Essay Writing Competition', 'Ganpati Idol Making & Essay Writing Competition', 'VCET', 'Competitions', '8th September 2026', '2.00pm to 5.00pm', NULL, 'Ek Bharat Shreshtha Bharat (EBSB) Committee', 'https://docs.google.com/forms/d/e/1FAIpQLSfwjvBjn8hMQLhOpHFzOEfv7F0YWprLXM9Gv4IO-0FMucKfwA/viewform?usp=header', NULL, NULL, NULL, NULL, 'APPROVED'),
    ('Institution''s Innovation Council (IIC), VCET', 'The Institution''s Innovation Council (IIC) is an initiative of the Ministry of Education (MoE), Government of India, in collaboration with AICTE, aimed at promoting innovation, research, entrepreneurship, startups, internships, intellectual property awareness, and a culture of creative problem-solving within educational institutions.', NULL, 'Clubs', NULL, NULL, NULL, 'Institution''s Innovation Council (IIC)', 'https://forms.gle/mSp5ABqXmQvQ2JBB6', NULL, NULL, NULL, NULL, 'APPROVED'),
    ('FULL-STACK FUNDAMENTALS
Build & Deploy a Backend-Heavy MERN Project', 'Learn & build with:
node.js & Express
MongoDB & REST APIs
React & Tailwind CSS
Git, GitHub & Deployment
Cloudinary & CI/CD', 'Room no. 314', 'Workshops', '13 Aug 2026', '10:30 AM', NULL, 'MLSC – VCET', 'https://forms.gle/e474o3QYrnZZatqs8', NULL, NULL, NULL, NULL, 'APPROVED'),
    ('PIRATES OF THE FLAG – CTF CHALLENGE', NULL, 'The event will have one round only
TRCAC, Dahisar East', 'Hackathons', NULL, NULL, NULL, 'TRCAC DevClub', 'https://www.devclubtrcac.in/zettaabyte/events/pirates-flag', NULL, 'Free', NULL, 'Trophy
Certificate', 'APPROVED'),
    ('BYTEVERSE', 'BYTEVERSE is a duo-based technical competition where teams will face challenges in:
 Logical Thinking
 Debugging Data Structures & Algorithms
 AI Code Optimization
 AI vs Human', 'VCET, Vasai', 'Hackathons', '3rd September 2026', '10:30 AM onwards', 'AI & DS', 'NSDC', 'https://byteverse-2026.vercel.app/', NULL, NULL, NULL, 'GOODIES + CASH PRIZES + CERTIFICATES', 'APPROVED'),
    ('From Commit to Contribution: Git, GitHub & Open Source Workshop', 'Git and GitHub are essential skills for projects, hackathons, internships, and future career opportunities.', '3rd Floor Seminar Hall.', 'Workshops', '1st September', '3:30 PM', NULL, 'Microsoft Learn Students Club (MLSC)', 'https://forms.gle/w62hMMGA3j4fZQZR8', NULL, NULL, NULL, NULL, 'APPROVED'),
    ('IIT Bombay Techfest 2026–27', 'These workshops are a great opportunity to:
Learn practical & industry-relevant skills
Explore emerging technologies
 Interact with like-minded students
 Enhance your technical knowledge beyond the classroom', NULL, 'Workshops', NULL, NULL, NULL, 'IIT Bombay', 'https://forms.gle/FFAXgiJJNZ6Q5Tmm6', NULL, NULL, NULL, NULL, 'APPROVED'),
    ('Product Showcase', 'The platform connects innovation and industry through product demonstrations , interactive experiences,digital displays, student presentations and industry institute collaboration', 'Vcet Campus', 'Event', 'Sept 11 , 2026', '9am - 5 am', 'All department(Comps, CSE(DS), IT, Electronics, Mech, AI & DS, MMS, Civil)', 'Vcet', NULL, NULL, NULL, NULL, NULL, 'APPROVED'),
    ('Algorithm in Action', 'It is an insightful lecture with Mr.Hritik Kanojiya, SDE-|| & Ex. Oracle Corporation, as he shares industry perspectives on algorithms, problem-solving and their real-world applications', 'Ground Floar Seminar Hall, Vcet', 'Seminars & Webinars', '17 Aug 2026', '9:15 am', 'AI & DS', 'AI & DS department', NULL, NULL, NULL, NULL, NULL, 'APPROVED'),
    ('Agile Development and Higher Studies in Germ', 'An insightful Expert lecture with MS. Rina Yadav, Compliance Manager, Kion group, Frankfurt am Main, Germany, as he shares a valuable opportunity for students to gain insights into Agile Development, international Career opportunities and higher studies in Germany', 'Room No. 424, Vcet', 'Seminars & Webinars', '14 Aug 2026', '11:00 am - 12:00 pm', 'AI & DS', 'AI & DS Department', NULL, NULL, NULL, NULL, NULL, 'APPROVED'),
    ('Code-O-fiesta', 'A National level coding competition off a day for innovation, real-world problem-solving and amazing opportunities', NULL, 'Hackathons', '13 Sep 2025', NULL, 'AI & DS and Comps', 'AI & DS, Comps and NSDC', NULL, NULL, NULL, NULL, NULL, 'APPROVED'),
    ('Paper-A-Thon', 'It is a Hackthon for the innovative suggestion that requires space to flourish and for ideas that are worth researching', NULL, 'Hackathons', '8 Aug 2025', '12 pm onwards', 'All department(TE Students only)', 'Microsoft Learn Student Club', NULL, NULL, NULL, NULL, NULL, 'APPROVED'),
    ('NSDC Workshop', NULL, NULL, 'Workshops', '3 Aug 2025', '3:00pm', NULL, 'NSDC', NULL, NULL, NULL, NULL, NULL, 'APPROVED'),
    ('Student Council', 'The apex student governing committee representing the student community. Student organizers lead campus policy dialogues with university administration, manage campus club funds, organize flagship fests, and champion student rights and campus welfare. Open to all students wishing to join or stand for student elections.', 'Senate Hall & Council Office Rm 204', 'Committees', 'Weekly Assembly • Wed 4:00 PM', '4:00 PM', 'All Departments', 'Student Organizers Body', NULL, NULL, 'Free', NULL, NULL, 'APPROVED'),
    ('CSI Committee', 'The Computer Society of India (CSI) student committee is the premier technical body of student organizers on campus. Directs annual hackathons, technical conferences, coding bootcamps, and open-source research wings. Members gain access to national CSI publications, tech certifications, and executive organizing roles.', 'Auditorium Hall 1 & CS Labs', 'Committees', 'Bi-Weekly Tech Sprints • Fri 3:30 PM', '3:30 PM', 'Computer Science & IT', 'Computer Society of India', NULL, NULL, 'Free', NULL, NULL, 'APPROVED'),
    ('Airnova', 'Airnova is the official student aviation, aeromodelling, and drone engineering committee. Student organizers build autonomous quadcopters, FPV racing drones, and fixed-wing RC aircraft. Join as a student pilot, avionics researcher, CAD designer, or lead organizer for national aero championships and drone expos.', 'College Sports Grounds & Aero Hangar', 'Committees', 'Weekly Build & Trials • Sat 10:00 AM', '10:00 AM', 'Mechanical & Robotics', 'Aviation & Aeromodelling Committee', NULL, NULL, 'Free', NULL, NULL, 'APPROVED'),
    ('Sports Committee', 'The Sports Committee of student organizers spearheads all campus athletics, inter-department tournaments, and university varsity teams in Football, Basketball, Cricket, Badminton, and Table Tennis. Student members manage tournament fixtures, referee matches, maintain sports facilities, and lead the annual sports fest.', 'Indoor Sports Complex & Track Grounds', 'Committees', 'Daily Practice & League Trials • 4:30 PM', '4:30 PM', 'All Departments', 'Athletics & Games Committee', NULL, NULL, 'Free', NULL, NULL, 'APPROVED');
