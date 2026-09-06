import { User, Project, Task, TaskComment, ActivityLog } from '../types';

export const GUEST_DEMO_USERS: User[] = [
    {
        id: 1,
        username: 'alex_vance',
        email: 'alex@example.com',
        fullName: 'Alex Vance',
        avatarColor: '#0284C7',
        initials: 'AV',
        roles: ['ROLE_ADMIN'],
        bio: 'Workspace administrator'
    },
    {
        id: 2,
        username: 'john_dev',
        email: 'john@example.com',
        fullName: 'John Doe',
        avatarColor: '#059669',
        initials: 'JD',
        roles: ['ROLE_USER'],
        bio: 'Team member'
    },
    {
        id: 3,
        username: 'sarah_pm',
        email: 'sarah@example.com',
        fullName: 'Sarah Jenkins',
        avatarColor: '#EA580C',
        initials: 'SJ',
        roles: ['ROLE_USER'],
        bio: 'Team member'
    },
    {
        id: 4,
        username: 'david_qa',
        email: 'david@example.com',
        fullName: 'David Smith',
        avatarColor: '#0891B2',
        initials: 'DS',
        roles: ['ROLE_USER'],
        bio: 'Team member'
    }
];

export const GUEST_DEMO_PROJECTS: Project[] = [
    {
        id: 1,
        name: 'DSA Practice',
        description: 'Data structures and algorithm problem sets.',
        color: '#0284C7',
        ownerId: 1,
        members: [{ userId: 2, role: 'MEMBER' }, { userId: 4, role: 'MEMBER' }],
        createdAt: '2026-08-15T09:00:00Z'
    },
    {
        id: 2,
        name: 'Web Dev',
        description: 'Frontend flows, dashboard layouts, and accessibility.',
        color: '#0EA5E9',
        ownerId: 3,
        members: [{ userId: 1, role: 'MEMBER' }, { userId: 2, role: 'MEMBER' }],
        createdAt: '2026-08-20T10:30:00Z'
    },
    {
        id: 3,
        name: 'College',
        description: 'Coursework, presentations, and group research.',
        color: '#10B981',
        ownerId: 2,
        members: [{ userId: 3, role: 'MEMBER' }, { userId: 4, role: 'MEMBER' }],
        createdAt: '2026-09-01T14:15:00Z'
    },
    {
        id: 4,
        name: 'ML Project',
        description: 'Model evaluation, data preparation, and research.',
        color: '#F97316',
        ownerId: 1,
        members: [{ userId: 2, role: 'MEMBER' }, { userId: 3, role: 'MEMBER' }],
        createdAt: '2026-09-02T11:00:00Z'
    }
];

export const GUEST_DEMO_TASKS: Task[] = [
    {
        id: 1,
        title: 'Submit DSA Assignment',
        description: 'Finalize the assignment and upload the solution.',
        priority: 'HIGH',
        status: 'IN_PROGRESS',
        dueDate: '2026-09-05',
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
        description: 'Create responsive dashboard layouts.',
        priority: 'MEDIUM',
        status: 'IN_PROGRESS',
        dueDate: '2026-09-06',
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
        description: 'Prepare project milestones for the presentation.',
        priority: 'MEDIUM',
        status: 'TODO',
        dueDate: '2026-09-08',
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
        description: 'Review the assigned research paper.',
        priority: 'LOW',
        status: 'TODO',
        dueDate: '2026-09-10',
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
        description: 'Finalize the weekend travel plans.',
        priority: 'HIGH',
        status: 'TODO',
        dueDate: '2026-09-04',
        category: 'Personal',
        projectId: null,
        assigneeId: 2,
        creatorId: 3,
        createdAt: '2026-08-28T14:00:00Z',
        completedAt: null
    },
    {
        id: 6,
        title: 'Configure Security',
        description: 'Review the authentication configuration.',
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
        title: 'Accessibility Checks',
        description: 'Verify contrast, touch targets, and keyboard navigation.',
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

export const GUEST_DEMO_COMMENTS: TaskComment[] = [];

export const GUEST_DEMO_ACTIVITIES: ActivityLog[] = [
    {
        id: 1,
        action: 'TASK_COMPLETED',
        description: 'completed task "Configure Security"',
        entityType: 'TASK',
        entityId: 6,
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
    }
];
