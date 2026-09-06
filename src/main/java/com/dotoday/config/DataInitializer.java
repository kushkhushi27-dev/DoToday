package com.dotoday.config;

import com.dotoday.entity.*;
import com.dotoday.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final ProjectRepository projectRepository;
    private final ProjectMemberRepository projectMemberRepository;
    private final TaskRepository taskRepository;
    private final CommentRepository commentRepository;
    private final ActivityLogRepository activityLogRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(RoleRepository roleRepository,
                           UserRepository userRepository,
                           ProjectRepository projectRepository,
                           ProjectMemberRepository projectMemberRepository,
                           TaskRepository taskRepository,
                           CommentRepository commentRepository,
                           ActivityLogRepository activityLogRepository,
                           PasswordEncoder passwordEncoder) {
        this.roleRepository = roleRepository;
        this.userRepository = userRepository;
        this.projectRepository = projectRepository;
        this.projectMemberRepository = projectMemberRepository;
        this.taskRepository = taskRepository;
        this.commentRepository = commentRepository;
        this.activityLogRepository = activityLogRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        log.info("DataInitializer: Skipping seed data. Users register via Firebase Google Auth.");
        return;

        // 1. Create Roles
        Role adminRole = roleRepository.save(new Role("ROLE_ADMIN"));
        Role userRole = roleRepository.save(new Role("ROLE_USER"));

        // 2. Create Users
        User admin = new User("admin", "admin@dotoday.com", passwordEncoder.encode("Admin@123"), "Alex Morgan");
        admin.setAvatarColor("#4F46E5");
        admin.setBio("Platform Administrator & Lead Architect");
        admin.addRole(adminRole);
        admin.addRole(userRole);
        admin = userRepository.save(admin);

        User john = new User("john_dev", "john@dotoday.com", passwordEncoder.encode("User@123"), "John Developer");
        john.setAvatarColor("#2563EB");
        john.setBio("Senior Backend Engineer specializing in Java and Spring Boot ecosystems.");
        john.addRole(userRole);
        john = userRepository.save(john);

        User sarah = new User("sarah_pm", "sarah@dotoday.com", passwordEncoder.encode("User@123"), "Sarah Mitchell");
        sarah.setAvatarColor("#059669");
        sarah.setBio("Lead Product Manager driving sprint goals and team delivery.");
        sarah.addRole(userRole);
        sarah = userRepository.save(sarah);

        User david = new User("david_qa", "david@dotoday.com", passwordEncoder.encode("User@123"), "David QA");
        david.setAvatarColor("#D97706");
        david.setBio("Quality assurance lead focused on automated integration testing and reliability.");
        david.addRole(userRole);
        david = userRepository.save(david);

        // 3. Create Projects
        Project cloudProject = new Project(
                "Cloud Migration & Microservices",
                "Migrating legacy monolithic workloads to resilient cloud-native Spring Boot services with container orchestration.",
                "#3B82F6",
                sarah
        );
        cloudProject = projectRepository.save(cloudProject);

        Project mobileProject = new Project(
                "Mobile App Experience V2",
                "Complete overhaul of user interface and API response times for mobile client applications.",
                "#8B5CF6",
                admin
        );
        mobileProject = projectRepository.save(mobileProject);

        Project securityProject = new Project(
                "Security & Compliance Audit",
                "Quarterly security compliance audit covering OWASP top 10, role-based access control, and data encryption.",
                "#10B981",
                john
        );
        securityProject = projectRepository.save(securityProject);

        // 4. Add Project Members
        projectMemberRepository.save(new ProjectMember(cloudProject, john, ProjectRole.MEMBER));
        projectMemberRepository.save(new ProjectMember(cloudProject, david, ProjectRole.MEMBER));
        projectMemberRepository.save(new ProjectMember(cloudProject, admin, ProjectRole.MEMBER));

        projectMemberRepository.save(new ProjectMember(mobileProject, sarah, ProjectRole.MEMBER));
        projectMemberRepository.save(new ProjectMember(mobileProject, john, ProjectRole.MEMBER));

        projectMemberRepository.save(new ProjectMember(securityProject, sarah, ProjectRole.MEMBER));
        projectMemberRepository.save(new ProjectMember(securityProject, admin, ProjectRole.MEMBER));

        // 5. Create Tasks
        LocalDate today = LocalDate.now();

        // Task 1: In Progress
        Task task1 = new Task();
        task1.setTitle("Implement Spring Security JWT and Session hardening");
        task1.setDescription("Harden authentication filter chain, configure BCrypt strength 12, and sanitize session cookies.");
        task1.setStatus(TaskStatus.IN_PROGRESS);
        task1.setPriority(TaskPriority.HIGH);
        task1.setDueDate(today.plusDays(2));
        task1.setCategory("Security");
        task1.setProject(cloudProject);
        task1.setCreator(sarah);
        task1.setAssignee(john);
        task1 = taskRepository.save(task1);

        // Task 2: Due Today
        Task task2 = new Task();
        task2.setTitle("Deploy MariaDB database schema migrations");
        task2.setDescription("Run JPA/Hibernate DDL updates and verify foreign key indexing on users, projects, and tasks tables.");
        task2.setStatus(TaskStatus.IN_PROGRESS);
        task2.setPriority(TaskPriority.HIGH);
        task2.setDueDate(today);
        task2.setCategory("Database");
        task2.setProject(cloudProject);
        task2.setCreator(john);
        task2.setAssignee(john);
        task2 = taskRepository.save(task2);

        // Task 3: Overdue
        Task task3 = new Task();
        task3.setTitle("Review legacy REST API payload validation");
        task3.setDescription("Update old endpoints with Jakarta Bean Validation annotations to reject malformed input payloads.");
        task3.setStatus(TaskStatus.TODO);
        task3.setPriority(TaskPriority.MEDIUM);
        task3.setDueDate(today.minusDays(2));
        task3.setCategory("Backend");
        task3.setProject(cloudProject);
        task3.setCreator(sarah);
        task3.setAssignee(david);
        task3 = taskRepository.save(task3);

        // Task 4: Completed
        Task task4 = new Task();
        task4.setTitle("Set up automated CI build pipeline");
        task4.setDescription("Configured Maven test runner and verify zero unit test regressions on pull requests.");
        task4.setStatus(TaskStatus.COMPLETED);
        task4.setPriority(TaskPriority.LOW);
        task4.setDueDate(today.minusDays(5));
        task4.setCategory("DevOps");
        task4.setProject(cloudProject);
        task4.setCreator(sarah);
        task4.setAssignee(john);
        task4.setCompletedAt(LocalDateTime.now().minusDays(1));
        task4 = taskRepository.save(task4);

        // Task 5: Mobile project task
        Task task5 = new Task();
        task5.setTitle("Design interactive Kanban board status transitions");
        task5.setDescription("Implement clean column views with To Do, In Progress, and Completed states and responsive feedback.");
        task5.setStatus(TaskStatus.TODO);
        task5.setPriority(TaskPriority.MEDIUM);
        task5.setDueDate(today.plusDays(4));
        task5.setCategory("Frontend");
        task5.setProject(mobileProject);
        task5.setCreator(admin);
        task5.setAssignee(john);
        task5 = taskRepository.save(task5);

        // Task 6: Personal task for John
        Task task6 = new Task();
        task6.setTitle("Prepare Java placement interview architectural notes");
        task6.setDescription("Document Spring Boot MVC architecture, JPA relationship cascade strategies, and multi-tenant security patterns.");
        task6.setStatus(TaskStatus.TODO);
        task6.setPriority(TaskPriority.HIGH);
        task6.setDueDate(today.plusDays(1));
        task6.setCategory("General");
        task6.setCreator(john);
        task6.setAssignee(john);
        task6 = taskRepository.save(task6);

        // 6. Comments
        Comment c1 = new Comment("The schema verification script passed all tests on staging environment.", task2, john);
        commentRepository.save(c1);

        Comment c2 = new Comment("Great job John! Please ensure connection pooling is tuned for peak traffic.", task2, sarah);
        commentRepository.save(c2);

        Comment c3 = new Comment("Initial security filter chain is drafted. Reviewing CSRF exclusions for REST endpoints.", task1, john);
        commentRepository.save(c3);

        // 7. Activity Logs
        activityLogRepository.save(new ActivityLog(ActivityAction.TASK_CREATED, "created task \"Implement Spring Security JWT and Session hardening\"", "TASK", task1.getId(), cloudProject, sarah));
        activityLogRepository.save(new ActivityLog(ActivityAction.TASK_ASSIGNED, "assigned task to John Developer", "TASK", task1.getId(), cloudProject, sarah));
        activityLogRepository.save(new ActivityLog(ActivityAction.TASK_CREATED, "created task \"Deploy MariaDB database schema migrations\"", "TASK", task2.getId(), cloudProject, john));
        activityLogRepository.save(new ActivityLog(ActivityAction.COMMENT_ADDED, "commented on task \"Deploy MariaDB database schema migrations\"", "COMMENT", c1.getId(), cloudProject, john));
        activityLogRepository.save(new ActivityLog(ActivityAction.COMMENT_ADDED, "commented on task \"Deploy MariaDB database schema migrations\"", "COMMENT", c2.getId(), cloudProject, sarah));
        activityLogRepository.save(new ActivityLog(ActivityAction.TASK_COMPLETED, "marked task \"Set up automated CI build pipeline\" as completed", "TASK", task4.getId(), cloudProject, john));

        log.info("TaskFlow seed data created successfully!");
    }
}
