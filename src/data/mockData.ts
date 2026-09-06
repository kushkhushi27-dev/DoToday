import { User, Project, Task, TaskComment, ActivityLog } from '../types';

export const INITIAL_USERS: User[] = [
  {
    id: 1,
    username: 'admin',
    email: 'alex@taskflow.com',
    fullName: 'Alex Vance',
    avatarColor: '#0284C7', // Sky blue
    initials: 'AV',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    roles: ['ROLE_ADMIN', 'ROLE_USER'],
    bio: 'Lead Architect & Administrator'
  },
  {
    id: 2,
    username: 'john_dev',
    email: 'john@taskflow.com',
    fullName: 'John Doe',
    avatarColor: '#059669', // Mint / Emerald
    initials: 'JD',
    roles: ['ROLE_USER'],
    bio: 'Senior Backend Engineer • Java & Spring Boot'
  },
  {
    id: 3,
    username: 'sarah_pm',
    email: 'sarah@taskflow.com',
    fullName: 'Sarah Jenkins',
    avatarColor: '#EA580C', // Warm orange
    initials: 'SJ',
    roles: ['ROLE_USER'],
    bio: 'Product Lead & Coordinator'
  },
  {
    id: 4,
    username: 'david_qa',
    email: 'david@taskflow.com',
    fullName: 'David Smith',
    avatarColor: '#0891B2', // Cyan
    initials: 'DS',
    roles: ['ROLE_USER'],
    bio: 'Quality & Test Automation'
  }
];

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 1,
    name: 'DSA Practice',
    description: 'Data structures, algorithm problem sets, dynamic programming, and complexity proofs.',
    color: '#0284C7', // Sky blue
    ownerId: 1,
    members: [
      { userId: 2, role: 'MEMBER' },
      { userId: 4, role: 'MEMBER' }
    ],
    createdAt: '2026-08-15T09:00:00Z'
  },
  {
    id: 2,
    name: 'Web Dev',
    description: 'Modernizing frontend user flows, responsive dashboard layouts, and accessibility.',
    color: '#0EA5E9', // Soft cyan / sky blue (NO PURPLE)
    ownerId: 3,
    members: [
      { userId: 1, role: 'MEMBER' },
      { userId: 2, role: 'MEMBER' }
    ],
    createdAt: '2026-08-20T10:30:00Z'
  },
  {
    id: 3,
    name: 'College',
    description: 'Academic coursework, semester projects, presentations, and group research.',
    color: '#10B981', // Mint emerald
    ownerId: 2,
    members: [
      { userId: 3, role: 'MEMBER' },
      { userId: 4, role: 'MEMBER' }
    ],
    createdAt: '2026-09-01T14:15:00Z'
  },
  {
    id: 4,
    name: 'ML Project',
    description: 'Machine learning model evaluation, dataset preprocessing, and research synthesis.',
    color: '#F97316', // Soft orange
    ownerId: 1,
    members: [
      { userId: 2, role: 'MEMBER' },
      { userId: 3, role: 'MEMBER' }
    ],
    createdAt: '2026-09-02T11:00:00Z'
  }
];

export const INITIAL_TASKS: Task[] = [
  {
    id: 1,
    title: 'Submit DSA Assignment',
    description: 'Finalize asymptotic complexity proofs, write binary search tree balance tests, and upload solution archive.',
    priority: 'HIGH',
    status: 'IN_PROGRESS',
    dueDate: '2026-09-05', // Today
    category: 'DSA Practice',
    projectId: 1,
    assigneeId: 1,
    creatorId: 1,
    createdAt: '2026-09-01T08:00:00Z',
    completedAt: null
  },
  {
    id: 2,
    title: 'Design Project UI',
    description: 'Craft fresh high-fidelity responsive dashboard layouts with soft pastel badges, clean typography, and zero purple accents.',
    priority: 'MEDIUM',
    status: 'IN_PROGRESS',
    dueDate: '2026-09-06', // Tomorrow
    category: 'Web Dev',
    projectId: 2,
    assigneeId: 1,
    creatorId: 3,
    createdAt: '2026-09-02T10:15:00Z',
    completedAt: null
  },
  {
    id: 3,
    title: 'Prepare Presentation',
    description: 'Synthesize sprint velocity metrics, project milestones, and architectural diagrams for the presentation.',
    priority: 'MEDIUM',
    status: 'TODO',
    dueDate: '2026-09-08', // 8 Sep
    category: 'College',
    projectId: 3,
    assigneeId: 3,
    creatorId: 1,
    createdAt: '2026-09-03T11:20:00Z',
    completedAt: null
  },
  {
    id: 4,
    title: 'Read Research Paper',
    description: 'Review consensus algorithms and distributed ledger architectures for machine learning inference.',
    priority: 'LOW',
    status: 'TODO',
    dueDate: '2026-09-10', // 10 Sep
    category: 'ML Project',
    projectId: 4,
    assigneeId: 4,
    creatorId: 2,
    createdAt: '2026-09-04T09:30:00Z',
    completedAt: null
  },
  {
    id: 5,
    title: 'Plan Weekend Trip',
    description: 'Reserve mountain trail accommodations, finalize transit itineraries, and pack weather gear.',
    priority: 'HIGH',
    status: 'TODO',
    dueDate: '2026-09-04', // Overdue (Yesterday)
    category: 'Personal',
    projectId: 3,
    assigneeId: 2,
    creatorId: 3,
    createdAt: '2026-08-28T14:00:00Z',
    completedAt: null
  },
  {
    id: 6,
    title: 'Configure Spring Security 6 with BCrypt',
    description: 'Implement stateless UserDetailsService, BCryptPasswordEncoder (10 rounds), and CSRF token propagation.',
    priority: 'MEDIUM',
    status: 'COMPLETED',
    dueDate: '2026-09-01',
    category: 'DSA Practice',
    projectId: 1,
    assigneeId: 2,
    creatorId: 1,
    createdAt: '2026-08-29T10:00:00Z',
    completedAt: '2026-09-01T18:30:00Z'
  },
  {
    id: 7,
    title: 'UX Review & Accessibility Checks',
    description: 'Verify WCAG AA 4.5:1 contrast, touch targets (minimum 44px), and keyboard navigability across all screens.',
    priority: 'LOW',
    status: 'COMPLETED',
    dueDate: '2026-09-02',
    category: 'Web Dev',
    projectId: 2,
    assigneeId: 4,
    creatorId: 3,
    createdAt: '2026-09-02T15:00:00Z',
    completedAt: '2026-09-02T19:00:00Z'
  }
];

export const INITIAL_COMMENTS: TaskComment[] = [
  {
    id: 1,
    taskId: 2,
    authorId: 1,
    content: 'The new sky blue and mint palette looks exceptionally fresh and crisp!',
    createdAt: '2026-09-02T14:20:00Z'
  },
  {
    id: 2,
    taskId: 2,
    authorId: 3,
    content: 'Agreed! The soft cards and subtle 1px borders give it that premium Apple-like feel.',
    createdAt: '2026-09-02T16:05:00Z'
  },
  {
    id: 3,
    taskId: 5,
    authorId: 2,
    content: 'Campsite booking confirmed for sunrise view on Saturday.',
    createdAt: '2026-09-03T10:11:00Z'
  }
];

export const INITIAL_ACTIVITIES: ActivityLog[] = [
  {
    id: 1,
    action: 'TASK_COMPLETED',
    description: 'completed task "Submit DSA Assignment"',
    entityType: 'TASK',
    entityId: 1,
    userId: 1,
    createdAt: '2026-09-03T16:45:00Z'
  },
  {
    id: 2,
    action: 'STATUS_CHANGED',
    description: 'moved task "Design Project UI" to IN_PROGRESS',
    entityType: 'TASK',
    entityId: 2,
    userId: 1,
    createdAt: '2026-09-03T09:15:00Z'
  },
  {
    id: 3,
    action: 'COMMENT_ADDED',
    description: 'commented on task "Design Project UI"',
    entityType: 'COMMENT',
    entityId: 2,
    userId: 3,
    createdAt: '2026-09-02T16:05:00Z'
  },
  {
    id: 4,
    action: 'TASK_CREATED',
    description: 'created new task "Prepare Presentation"',
    entityType: 'TASK',
    entityId: 3,
    userId: 1,
    createdAt: '2026-09-03T11:20:00Z'
  },
  {
    id: 5,
    action: 'PROJECT_CREATED',
    description: 'created project "Mobile App Redesign"',
    entityType: 'PROJECT',
    entityId: 2,
    userId: 3,
    createdAt: '2026-09-01T14:15:00Z'
  }
];
