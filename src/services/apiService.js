import { initialTasks } from './initialData';

const API_BASE_URL = 'http://localhost:5000/api';
const STORAGE_KEY = 'novatask_tasks_cache';
const USERS_KEY = 'novatask_users_cache';

// Initialize localStorage cache if empty
const getLocalTasks = () => {
  const cached = localStorage.getItem(STORAGE_KEY);
  if (!cached) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialTasks));
    return initialTasks;
  }
  try {
    return JSON.parse(cached);
  } catch (e) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialTasks));
    return initialTasks;
  }
};

const saveLocalTasks = (tasks) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
};

// Check if express backend is reachable
let isBackendAvailable = null;
const checkBackend = async () => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1200);
    const res = await fetch(`${API_BASE_URL}/health`, { signal: controller.signal });
    clearTimeout(timeoutId);
    isBackendAvailable = res.ok;
    return isBackendAvailable;
  } catch (e) {
    isBackendAvailable = false;
    return false;
  }
};

export const apiService = {
  // Fetch tasks
  async getTasks(params = {}) {
    const online = await checkBackend();
    if (online) {
      try {
        const query = new URLSearchParams(params).toString();
        const res = await fetch(`${API_BASE_URL}/tasks?${query}`);
        if (res.ok) {
          const data = await res.json();
          saveLocalTasks(data);
          return { data, isLiveBackend: true };
        }
      } catch (e) {
        console.warn('API error, falling back to local store:', e);
      }
    }

    // Local fallback
    let tasks = getLocalTasks();
    const { search, category, status, priority, sortBy } = params;

    if (search) {
      const q = search.toLowerCase();
      tasks = tasks.filter(t => 
        t.title.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        (t.assignedTo && t.assignedTo.toLowerCase().includes(q))
      );
    }

    if (category && category !== 'All') {
      tasks = tasks.filter(t => t.category.toLowerCase() === category.toLowerCase());
    }

    if (status && status !== 'All') {
      tasks = tasks.filter(t => t.status.toLowerCase() === status.toLowerCase());
    }

    if (priority && priority !== 'All') {
      tasks = tasks.filter(t => t.priority.toLowerCase() === priority.toLowerCase());
    }

    if (sortBy) {
      if (sortBy === 'dueDate') {
        tasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
      } else if (sortBy === 'priority') {
        const pOrder = { Urgent: 4, High: 3, Medium: 2, Low: 1 };
        tasks.sort((a, b) => (pOrder[b.priority] || 0) - (pOrder[a.priority] || 0));
      } else if (sortBy === 'progress') {
        tasks.sort((a, b) => b.progress - a.progress);
      } else if (sortBy === 'title') {
        tasks.sort((a, b) => a.title.localeCompare(b.title));
      }
    }

    return { data: tasks, isLiveBackend: false };
  },

  // Create task
  async createTask(taskData) {
    const online = isBackendAvailable ?? await checkBackend();
    if (online) {
      try {
        const res = await fetch(`${API_BASE_URL}/tasks`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(taskData)
        });
        if (res.ok) {
          const created = await res.json();
          const local = getLocalTasks();
          saveLocalTasks([created, ...local]);
          return created;
        }
      } catch (e) {
        console.warn('Backend create failed, saving locally:', e);
      }
    }

    // Fallback local creation
    const newTask = {
      ...taskData,
      id: `TSK-${Math.floor(100 + Math.random() * 900)}`,
      progress: Number(taskData.progress) || 0,
      estimatedHours: Number(taskData.estimatedHours) || 8,
      tags: taskData.tags || [taskData.category || 'General'],
      checklist: taskData.checklist || [
        { id: 1, text: 'Initial scoping and kickoff', completed: false }
      ],
      createdAt: new Date().toISOString().split('T')[0]
    };

    const tasks = getLocalTasks();
    tasks.unshift(newTask);
    saveLocalTasks(tasks);
    return newTask;
  },

  // Update task
  async updateTask(id, updates) {
    const online = isBackendAvailable ?? await checkBackend();
    if (online) {
      try {
        const res = await fetch(`${API_BASE_URL}/tasks/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updates)
        });
        if (res.ok) {
          const updated = await res.json();
          const local = getLocalTasks();
          saveLocalTasks(local.map(t => t.id === id ? updated : t));
          return updated;
        }
      } catch (e) {
        console.warn('Backend update failed, updating locally:', e);
      }
    }

    // Fallback local update
    const tasks = getLocalTasks();
    const index = tasks.findIndex(t => t.id === id);
    if (index === -1) throw new Error('Task not found');

    const updatedTask = {
      ...tasks[index],
      ...updates,
      id,
      progress: updates.progress !== undefined ? Number(updates.progress) : tasks[index].progress,
      updatedAt: new Date().toISOString()
    };

    tasks[index] = updatedTask;
    saveLocalTasks(tasks);
    return updatedTask;
  },

  // Delete task
  async deleteTask(id) {
    const online = isBackendAvailable ?? await checkBackend();
    if (online) {
      try {
        const res = await fetch(`${API_BASE_URL}/tasks/${id}`, { method: 'DELETE' });
        if (res.ok) {
          const local = getLocalTasks();
          saveLocalTasks(local.filter(t => t.id !== id));
          return { id, success: true };
        }
      } catch (e) {
        console.warn('Backend delete failed, removing locally:', e);
      }
    }

    // Fallback local delete
    const tasks = getLocalTasks();
    const filtered = tasks.filter(t => t.id !== id);
    saveLocalTasks(filtered);
    return { id, success: true };
  },

  // Get KPI Stats
  async getStats() {
    const tasks = getLocalTasks();
    const total = tasks.length;
    const completed = tasks.filter(t => (t.status || '').toLowerCase() === 'completed').length;
    const inProgress = tasks.filter(t => (t.status || '').toLowerCase() === 'in progress').length;
    const pending = tasks.filter(t => (t.status || '').toLowerCase() === 'pending').length;
    const inReview = tasks.filter(t => (t.status || '').toLowerCase() === 'in review').length;
    const urgentOrHigh = tasks.filter(t => t.priority === 'Urgent' || t.priority === 'High').length;
    const avgProgress = total > 0 
      ? Math.round(tasks.reduce((acc, curr) => acc + (Number(curr.progress) || 0), 0) / total) 
      : 0;

    return {
      total,
      completed,
      inProgress,
      pending,
      inReview,
      urgentOrHigh,
      avgProgress
    };
  },

  // Reset to default sample data
  resetDefaults() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialTasks));
    return initialTasks;
  }
};
