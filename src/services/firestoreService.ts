import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  QueryConstraint,
  writeBatch,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { Task, Project, TaskComment, ActivityLog } from '../types';

// ===== TASKS =====
export async function getTasks(filters?: {
  projectId?: string;
  status?: string;
  priority?: string;
  userId?: string;
}): Promise<Task[]> {
  try {
    const constraints: QueryConstraint[] = [];

    if (filters?.projectId) constraints.push(where('projectId', '==', filters.projectId));
    if (filters?.status) constraints.push(where('status', '==', filters.status));
    if (filters?.priority) constraints.push(where('priority', '==', filters.priority));
    if (filters?.userId) constraints.push(where('assignedTo', '==', filters.userId));

    constraints.push(orderBy('createdAt', 'desc'));

    const q = query(collection(db, 'tasks'), ...constraints);
    const snapshot = await getDocs(q);

    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as Task[];
  } catch (error: any) {
    throw new Error(`Failed to fetch tasks: ${error.message}`);
  }
}

export async function getTaskById(taskId: string): Promise<Task | null> {
  try {
    const taskDoc = await getDoc(doc(db, 'tasks', taskId));
    return taskDoc.exists() ? ({ id: taskDoc.id, ...taskDoc.data() } as Task) : null;
  } catch (error: any) {
    throw new Error(`Failed to fetch task: ${error.message}`);
  }
}

export async function createTask(task: Omit<Task, 'id'>): Promise<Task> {
  try {
    const docRef = await addDoc(collection(db, 'tasks'), {
      ...task,
      createdAt: new Date(),
    });
    return { id: docRef.id, ...task, createdAt: new Date() } as Task;
  } catch (error: any) {
    throw new Error(`Failed to create task: ${error.message}`);
  }
}

export async function updateTask(taskId: string, updates: Partial<Task>): Promise<void> {
  try {
    const taskRef = doc(db, 'tasks', taskId);
    await updateDoc(taskRef, {
      ...updates,
      updatedAt: new Date(),
    });
  } catch (error: any) {
    throw new Error(`Failed to update task: ${error.message}`);
  }
}

export async function deleteTask(taskId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, 'tasks', taskId));
  } catch (error: any) {
    throw new Error(`Failed to delete task: ${error.message}`);
  }
}

// ===== PROJECTS =====
export async function getProjects(userId?: string): Promise<Project[]> {
  try {
    const constraints: QueryConstraint[] = [];

    if (userId) {
      constraints.push(
        where('members', 'array-contains', userId)
      );
    }

    constraints.push(orderBy('createdAt', 'desc'));

    const q = query(collection(db, 'projects'), ...constraints);
    const snapshot = await getDocs(q);

    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as Project[];
  } catch (error: any) {
    throw new Error(`Failed to fetch projects: ${error.message}`);
  }
}

export async function getProjectById(projectId: string): Promise<Project | null> {
  try {
    const projectDoc = await getDoc(doc(db, 'projects', projectId));
    return projectDoc.exists() ? ({ id: projectDoc.id, ...projectDoc.data() } as Project) : null;
  } catch (error: any) {
    throw new Error(`Failed to fetch project: ${error.message}`);
  }
}

export async function createProject(project: Omit<Project, 'id'>): Promise<Project> {
  try {
    const docRef = await addDoc(collection(db, 'projects'), {
      ...project,
      createdAt: new Date(),
    });
    return { id: docRef.id, ...project, createdAt: new Date() } as Project;
  } catch (error: any) {
    throw new Error(`Failed to create project: ${error.message}`);
  }
}

export async function updateProject(projectId: string, updates: Partial<Project>): Promise<void> {
  try {
    const projectRef = doc(db, 'projects', projectId);
    await updateDoc(projectRef, {
      ...updates,
      updatedAt: new Date(),
    });
  } catch (error: any) {
    throw new Error(`Failed to update project: ${error.message}`);
  }
}

export async function deleteProject(projectId: string): Promise<void> {
  try {
    // Delete all tasks in project
    const tasks = await getTasks({ projectId });
    const batch = writeBatch(db);

    tasks.forEach(task => {
      batch.delete(doc(db, 'tasks', task.id));
    });

    batch.delete(doc(db, 'projects', projectId));
    await batch.commit();
  } catch (error: any) {
    throw new Error(`Failed to delete project: ${error.message}`);
  }
}

// ===== COMMENTS =====
export async function getTaskComments(taskId: string): Promise<TaskComment[]> {
  try {
    const q = query(
      collection(db, 'comments'),
      where('taskId', '==', taskId),
      orderBy('createdAt', 'asc')
    );
    const snapshot = await getDocs(q);

    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as TaskComment[];
  } catch (error: any) {
    throw new Error(`Failed to fetch comments: ${error.message}`);
  }
}

export async function addComment(comment: Omit<TaskComment, 'id'>): Promise<TaskComment> {
  try {
    const docRef = await addDoc(collection(db, 'comments'), {
      ...comment,
      createdAt: new Date(),
    });
    return { id: docRef.id, ...comment, createdAt: new Date() } as TaskComment;
  } catch (error: any) {
    throw new Error(`Failed to add comment: ${error.message}`);
  }
}

export async function deleteComment(commentId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, 'comments', commentId));
  } catch (error: any) {
    throw new Error(`Failed to delete comment: ${error.message}`);
  }
}

// ===== ACTIVITY LOGS =====
export async function getActivityLogs(limit: number = 50): Promise<ActivityLog[]> {
  try {
    const q = query(
      collection(db, 'activities'),
      orderBy('timestamp', 'desc')
    );
    const snapshot = await getDocs(q);

    return snapshot.docs.slice(0, limit).map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as ActivityLog[];
  } catch (error: any) {
    throw new Error(`Failed to fetch activity logs: ${error.message}`);
  }
}

export async function logActivity(activity: Omit<ActivityLog, 'id'>): Promise<ActivityLog> {
  try {
    const docRef = await addDoc(collection(db, 'activities'), {
      ...activity,
      timestamp: new Date(),
    });
    return { id: docRef.id, ...activity, timestamp: new Date() } as ActivityLog;
  } catch (error: any) {
    throw new Error(`Failed to log activity: ${error.message}`);
  }
}
