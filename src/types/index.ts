export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH';
export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'COMPLETED';
export type UserRole = 'ROLE_USER' | 'ROLE_ADMIN' | 'ROLE_GUEST';
export type NavTab = 'dashboard' | 'my-tasks' | 'projects' | 'kanban' | 'calendar' | 'analytics' | 'activity';

export interface User {
  id: number;
  uid?: string;
  username: string;
  email: string;
  fullName: string;
  avatarColor: string;
  initials: string;
  avatarUrl?: string;
  roles: UserRole[];
  bio?: string;
}

export interface ProjectMember {
  userId: number;
  role: 'LEAD' | 'MEMBER';
}

export interface Project {
  id: number;
  name: string;
  description: string;
  color: string;
  ownerId: number;
  members: ProjectMember[];
  createdAt: string;
}

export interface Task {
  id: number;
  title: string;
  description: string;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate: string | null; // YYYY-MM-DD
  category: string;
  projectId: number | null;
  assigneeId: number | null;
  creatorId: number;
  createdAt: string;
  completedAt: string | null;
}

export interface TaskComment {
  id: number;
  taskId: number;
  authorId: number;
  content: string;
  createdAt: string;
}

export interface ActivityLog {
  id: number;
  action: string;
  description: string;
  entityType: 'TASK' | 'PROJECT' | 'COMMENT';
  entityId: number;
  userId: number;
  createdAt: string;
}

export interface FilterState {
  search: string;
  status: string;
  priority: string;
  category: string;
  projectId: string;
  assignedToMeOnly: boolean;
  sortBy: 'dueDate' | 'priority' | 'createdAt' | 'title';
  sortOrder: 'asc' | 'desc';
}
