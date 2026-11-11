import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const tasksFilePath = path.join(__dirname, 'data', 'tasks.json');
const usersFilePath = path.join(__dirname, 'data', 'users.json');

// Helper to read JSON file safely
const readJsonFile = (filePath, fallback = []) => {
  try {
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, JSON.stringify(fallback, null, 2));
      return fallback;
    }
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error(`Error reading ${filePath}:`, err);
    return fallback;
  }
};

// Helper to write JSON file safely
const writeJsonFile = (filePath, data) => {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.error(`Error writing ${filePath}:`, err);
    return false;
  }
};

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'NovaTask Pro REST API is operational', time: new Date().toISOString() });
});

// GET /api/tasks - list all tasks with optional filters
app.get('/api/tasks', (req, res) => {
  let tasks = readJsonFile(tasksFilePath);
  const { search, category, status, priority, sortBy } = req.query;

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

  res.json(tasks);
});

// GET /api/tasks/:id
app.get('/api/tasks/:id', (req, res) => {
  const tasks = readJsonFile(tasksFilePath);
  const task = tasks.find(t => t.id === req.params.id);
  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }
  res.json(task);
});

// POST /api/tasks - create new task
app.post('/api/tasks', (req, res) => {
  const { title, description, category, priority, status, dueDate, assignedTo, assigneeRole, assigneeAvatar, estimatedHours, tags, checklist } = req.body;

  if (!title || !description || !dueDate) {
    return res.status(400).json({ error: 'Title, description, and due date are required.' });
  }

  const tasks = readJsonFile(tasksFilePath);
  const newTask = {
    id: `TSK-${Math.floor(100 + Math.random() * 900)}`,
    title: title.trim(),
    description: description.trim(),
    category: category || 'Development',
    priority: priority || 'Medium',
    status: status || 'Pending',
    progress: Number(req.body.progress) || 0,
    dueDate,
    assignedTo: assignedTo || 'Unassigned',
    assigneeRole: assigneeRole || 'Team Member',
    assigneeAvatar: assigneeAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    estimatedHours: Number(estimatedHours) || 8,
    tags: Array.isArray(tags) ? tags : ['General'],
    checklist: Array.isArray(checklist) ? checklist : [
      { id: 1, text: 'Initial scoping and kickoff', completed: false }
    ],
    createdAt: new Date().toISOString().split('T')[0]
  };

  tasks.unshift(newTask);
  writeJsonFile(tasksFilePath, tasks);
  res.status(201).json(newTask);
});

// PUT /api/tasks/:id - update existing task
app.put('/api/tasks/:id', (req, res) => {
  const tasks = readJsonFile(tasksFilePath);
  const index = tasks.findIndex(t => t.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ error: 'Task not found' });
  }

  const existing = tasks[index];
  const updatedTask = {
    ...existing,
    ...req.body,
    id: existing.id, // prevent id mutation
    progress: req.body.progress !== undefined ? Number(req.body.progress) : existing.progress,
    estimatedHours: req.body.estimatedHours !== undefined ? Number(req.body.estimatedHours) : existing.estimatedHours,
    updatedAt: new Date().toISOString()
  };

  tasks[index] = updatedTask;
  writeJsonFile(tasksFilePath, tasks);
  res.json(updatedTask);
});

// DELETE /api/tasks/:id - delete a task
app.delete('/api/tasks/:id', (req, res) => {
  const tasks = readJsonFile(tasksFilePath);
  const initialLength = tasks.length;
  const filtered = tasks.filter(t => t.id !== req.params.id);

  if (filtered.length === initialLength) {
    return res.status(404).json({ error: 'Task not found' });
  }

  writeJsonFile(tasksFilePath, filtered);
  res.json({ message: 'Task deleted successfully', id: req.params.id });
});

// GET /api/stats - summary metrics
app.get('/api/stats', (req, res) => {
  const tasks = readJsonFile(tasksFilePath);
  const total = tasks.length;
  const completed = tasks.filter(t => t.status.toLowerCase() === 'completed').length;
  const inProgress = tasks.filter(t => t.status.toLowerCase() === 'in progress').length;
  const pending = tasks.filter(t => t.status.toLowerCase() === 'pending').length;
  const inReview = tasks.filter(t => t.status.toLowerCase() === 'in review').length;
  const urgentOrHigh = tasks.filter(t => t.priority === 'Urgent' || t.priority === 'High').length;
  
  const avgProgress = total > 0 
    ? Math.round(tasks.reduce((acc, curr) => acc + (curr.progress || 0), 0) / total) 
    : 0;

  res.json({
    total,
    completed,
    inProgress,
    pending,
    inReview,
    urgentOrHigh,
    avgProgress
  });
});

// POST /api/auth/login
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const users = readJsonFile(usersFilePath);
  const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

  if (!user || user.password !== password) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  const { password: _, ...userWithoutPassword } = user;
  res.json({
    token: `mock-jwt-token-${Date.now()}`,
    user: userWithoutPassword
  });
});

// POST /api/auth/register
app.post('/api/auth/register', (req, res) => {
  const { name, email, password, department, role } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email, and password are required' });
  }

  const users = readJsonFile(usersFilePath);
  const existing = users.find(u => u.email.toLowerCase() === email.toLowerCase());

  if (existing) {
    return res.status(409).json({ error: 'An account with this email already exists' });
  }

  const newUser = {
    id: `usr-${Date.now()}`,
    name: name.trim(),
    email: email.trim().toLowerCase(),
    password,
    department: department || 'Engineering',
    role: role || 'Product Contributor',
    avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80`
  };

  users.push(newUser);
  writeJsonFile(usersFilePath, users);

  const { password: _, ...userWithoutPassword } = newUser;
  res.status(201).json({
    token: `mock-jwt-token-${Date.now()}`,
    user: userWithoutPassword
  });
});

app.listen(PORT, () => {
  console.log(`🚀 NovaTask Pro Express Server running on http://localhost:${PORT}`);
});
