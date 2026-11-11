import React, { useState, useEffect, useMemo } from 'react';
import { 
  FiSearch, 
  FiGrid, 
  FiList, 
  FiPlus, 
  FiRefreshCw, 
  FiCheckCircle, 
  FiClock, 
  FiAlertTriangle, 
  FiTrendingUp,
  FiFilter,
  FiX
} from 'react-icons/fi';
import { apiService } from '../services/apiService';
import { useAuth } from '../context/AuthContext';
import StatCard from '../components/StatCard';
import TaskCard from '../components/TaskCard';
import TaskTable from '../components/TaskTable';
import TaskModal from '../components/TaskModal';
import ViewDetailsModal from '../components/ViewDetailsModal';
import ConfirmDialog from '../components/ConfirmDialog';
import '../styles/dashboard.css';

const CATEGORIES = ['All', 'Development', 'Design', 'Marketing', 'DevOps', 'Research', 'Security'];
const STATUSES = ['All', 'Pending', 'In Progress', 'In Review', 'Completed'];
const PRIORITIES = ['All', 'Urgent', 'High', 'Medium', 'Low'];

const DashboardPage = ({ onShowToast, createModalOpen, onCloseCreateModal }) => {
  const { user } = useAuth();

  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    inProgress: 0,
    pending: 0,
    inReview: 0,
    urgentOrHigh: 0,
    avgProgress: 0
  });

  const [isLiveBackend, setIsLiveBackend] = useState(false);
  const [loading, setLoading] = useState(true);

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedPriority, setSelectedPriority] = useState('All');
  const [sortBy, setSortBy] = useState('dueDate');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'table'

  // Modal states
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [viewingTask, setViewingTask] = useState(null);
  const [deletingTask, setDeletingTask] = useState(null);

  // Sync external trigger from navbar
  useEffect(() => {
    if (createModalOpen) {
      setEditingTask(null);
      setIsTaskModalOpen(true);
    }
  }, [createModalOpen]);

  const loadData = async () => {
    setLoading(true);
    try {
      const { data, isLiveBackend: online } = await apiService.getTasks();
      setTasks(data);
      setIsLiveBackend(online);

      const computedStats = await apiService.getStats();
      setStats(computedStats);
    } catch (err) {
      console.error(err);
      if (onShowToast) onShowToast('Failed to load tasks', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filter and sort tasks
  const filteredTasks = useMemo(() => {
    let result = [...tasks];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(t => 
        t.title.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        (t.assignedTo && t.assignedTo.toLowerCase().includes(q)) ||
        (t.tags && t.tags.some(tag => tag.toLowerCase().includes(q)))
      );
    }

    if (selectedCategory !== 'All') {
      result = result.filter(t => t.category.toLowerCase() === selectedCategory.toLowerCase());
    }

    if (selectedStatus !== 'All') {
      result = result.filter(t => t.status.toLowerCase() === selectedStatus.toLowerCase());
    }

    if (selectedPriority !== 'All') {
      result = result.filter(t => t.priority.toLowerCase() === selectedPriority.toLowerCase());
    }

    if (sortBy === 'dueDate') {
      result.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
    } else if (sortBy === 'priority') {
      const pOrder = { Urgent: 4, High: 3, Medium: 2, Low: 1 };
      result.sort((a, b) => (pOrder[b.priority] || 0) - (pOrder[a.priority] || 0));
    } else if (sortBy === 'progress') {
      result.sort((a, b) => (b.progress || 0) - (a.progress || 0));
    } else if (sortBy === 'title') {
      result.sort((a, b) => a.title.localeCompare(b.title));
    }

    return result;
  }, [tasks, searchQuery, selectedCategory, selectedStatus, selectedPriority, sortBy]);

  const hasActiveFilters = searchQuery !== '' || selectedCategory !== 'All' || selectedStatus !== 'All' || selectedPriority !== 'All';

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedStatus('All');
    setSelectedPriority('All');
    setSortBy('dueDate');
    if (onShowToast) onShowToast('All filters have been reset', 'info');
  };

  // CRUD Operations
  const handleCreateOrUpdateTask = async (taskFormData) => {
    try {
      if (editingTask) {
        // Edit Operation
        const updated = await apiService.updateTask(editingTask.id, taskFormData);
        setTasks(prev => prev.map(t => t.id === updated.id ? updated : t));
        if (onShowToast) onShowToast(`Task "${updated.title}" updated successfully!`, 'success');
      } else {
        // Create Operation
        const created = await apiService.createTask(taskFormData);
        setTasks(prev => [created, ...prev]);
        if (onShowToast) onShowToast(`New task "${created.title}" created successfully!`, 'success');
      }

      const updatedStats = await apiService.getStats();
      setStats(updatedStats);
    } catch (err) {
      console.error(err);
      if (onShowToast) onShowToast('Error saving task', 'error');
    }
  };

  const handleDeleteTask = async () => {
    if (!deletingTask) return;
    try {
      await apiService.deleteTask(deletingTask.id);
      setTasks(prev => prev.filter(t => t.id !== deletingTask.id));
      if (onShowToast) onShowToast(`Task "${deletingTask.title}" deleted`, 'success');
      setDeletingTask(null);

      const updatedStats = await apiService.getStats();
      setStats(updatedStats);
    } catch (err) {
      console.error(err);
      if (onShowToast) onShowToast('Failed to delete task', 'error');
    }
  };

  const handleQuickStatusChange = async (taskId, newStatus) => {
    try {
      const existing = tasks.find(t => t.id === taskId);
      if (!existing) return;

      const newProgress = newStatus === 'Completed' ? 100 : existing.progress;
      const updated = await apiService.updateTask(taskId, { status: newStatus, progress: newProgress });

      setTasks(prev => prev.map(t => t.id === taskId ? updated : t));
      if (onShowToast) onShowToast(`Status updated to "${newStatus}"`, 'info');

      const updatedStats = await apiService.getStats();
      setStats(updatedStats);
    } catch (err) {
      console.error(err);
      if (onShowToast) onShowToast('Failed to update status', 'error');
    }
  };

  const handleToggleSubtask = async (taskId, subtaskId) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task || !task.checklist) return;

    const updatedChecklist = task.checklist.map(item => 
      item.id === subtaskId ? { ...item, completed: !item.completed } : item
    );

    const completed = updatedChecklist.filter(i => i.completed).length;
    const progress = Math.round((completed / updatedChecklist.length) * 100);
    const status = progress === 100 ? 'Completed' : task.status === 'Completed' ? 'In Progress' : task.status;

    try {
      const updated = await apiService.updateTask(taskId, {
        checklist: updatedChecklist,
        progress,
        status
      });

      setTasks(prev => prev.map(t => t.id === taskId ? updated : t));
      setViewingTask(updated);

      const updatedStats = await apiService.getStats();
      setStats(updatedStats);
    } catch (err) {
      console.error(err);
    }
  };

  const handleRestoreSampleData = () => {
    const restored = apiService.resetDefaults();
    setTasks(restored);
    apiService.getStats().then(setStats);
    if (onShowToast) onShowToast('Default sample data restored!', 'success');
  };

  return (
    <div className="dashboard-page container animate-fade-in">
      {/* Top Header */}
      <div className="dashboard-header">
        <div className="dashboard-title-group">
          <h1>Project Workspace</h1>
          <div className="dashboard-subtitle">
            <span>Welcome back, {user?.name || 'Guest'}</span>
            <span>•</span>
            <span className={`backend-indicator ${isLiveBackend ? 'live' : 'local'}`}>
              <span className="status-dot"></span>
              {isLiveBackend ? 'Express REST API Connected (Port 5000)' : 'Client LocalStorage Sync'}
            </span>
          </div>
        </div>

        <div className="dashboard-actions">
          <button 
            className="btn btn-secondary btn-sm"
            onClick={handleRestoreSampleData}
            title="Reset to default mock dataset"
          >
            <FiRefreshCw /> Reset Mock Data
          </button>
          <button 
            className="btn btn-primary"
            onClick={() => {
              setEditingTask(null);
              setIsTaskModalOpen(true);
            }}
          >
            <FiPlus /> New Task
          </button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="stats-grid">
        <StatCard 
          title="Total Tasks" 
          value={stats.total} 
          subtext="Active pipeline deliverables" 
          icon={<FiCheckCircle />} 
          variant="primary" 
        />
        <StatCard 
          title="In Progress" 
          value={stats.inProgress} 
          subtext={`${stats.inReview} in review phase`} 
          icon={<FiClock />} 
          variant="warning" 
        />
        <StatCard 
          title="Completed" 
          value={stats.completed} 
          subtext={`Avg. completion ${stats.avgProgress}%`} 
          icon={<FiTrendingUp />} 
          variant="success" 
        />
        <StatCard 
          title="Urgent & High" 
          value={stats.urgentOrHigh} 
          subtext="Requires executive attention" 
          icon={<FiAlertTriangle />} 
          variant="danger" 
        />
      </div>

      {/* Filter and Search Controls Toolbar */}
      <div className="filter-toolbar">
        {/* Top Filter Row: Search, Selectors, View Mode Switcher */}
        <div className="filter-row-top">
          <div className="search-box">
            <FiSearch className="search-icon" />
            <input 
              type="text" 
              className="search-input" 
              placeholder="Search by title, description, assignee, or #tag..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }}
              >
                <FiX />
              </button>
            )}
          </div>

          <div className="toolbar-controls">
            {/* Status Filter */}
            <select 
              className="form-select" 
              style={{ width: 'auto', padding: '0.65rem 0.9rem', fontSize: '0.85rem' }}
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              {STATUSES.map(s => (
                <option key={s} value={s}>{s === 'All' ? 'All Statuses' : s}</option>
              ))}
            </select>

            {/* Priority Filter */}
            <select 
              className="form-select" 
              style={{ width: 'auto', padding: '0.65rem 0.9rem', fontSize: '0.85rem' }}
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
            >
              {PRIORITIES.map(p => (
                <option key={p} value={p}>{p === 'All' ? 'All Priorities' : `${p} Priority`}</option>
              ))}
            </select>

            {/* Sort Selector */}
            <select 
              className="form-select" 
              style={{ width: 'auto', padding: '0.65rem 0.9rem', fontSize: '0.85rem' }}
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="dueDate">Sort: Due Date</option>
              <option value="priority">Sort: Priority</option>
              <option value="progress">Sort: Progress %</option>
              <option value="title">Sort: Title (A-Z)</option>
            </select>

            {/* View Mode Toggle: Grid Cards vs Table View */}
            <div className="view-mode-toggle">
              <button 
                className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => setViewMode('grid')}
                title="Cards Grid View"
              >
                <FiGrid />
              </button>
              <button 
                className={`view-btn ${viewMode === 'table' ? 'active' : ''}`}
                onClick={() => setViewMode('table')}
                title="Data Table View"
              >
                <FiList />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Filter Row: Category Filter Pills */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div className="category-pills">
            {CATEGORIES.map(cat => (
              <button 
                key={cat} 
                className={`pill-btn ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            <span>Showing <strong>{filteredTasks.length}</strong> of {tasks.length} tasks</span>
            {hasActiveFilters && (
              <button 
                onClick={handleResetFilters} 
                style={{ color: 'var(--primary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.3rem' }}
              >
                <FiX /> Clear filters
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      {filteredTasks.length === 0 ? (
        <div className="empty-state animate-fade-in">
          <div className="empty-state-icon">📋</div>
          <h3 className="empty-state-title">No tasks found</h3>
          <p className="empty-state-desc">
            {hasActiveFilters 
              ? "We couldn't find any tasks matching your active filters or search keyword. Try clearing filters or revising your query."
              : "Your project workspace is empty. Create your first task to jumpstart your workflow!"}
          </p>
          {hasActiveFilters ? (
            <button className="btn btn-secondary" onClick={handleResetFilters}>
              Reset Filters
            </button>
          ) : (
            <button 
              className="btn btn-primary"
              onClick={() => {
                setEditingTask(null);
                setIsTaskModalOpen(true);
              }}
            >
              <FiPlus /> Create First Task
            </button>
          )}
        </div>
      ) : viewMode === 'grid' ? (
        /* Cards Grid View */
        <div className="cards-grid">
          {filteredTasks.map((task) => (
            <TaskCard 
              key={task.id} 
              task={task} 
              onView={(t) => setViewingTask(t)}
              onEdit={(t) => {
                setEditingTask(t);
                setIsTaskModalOpen(true);
              }}
              onDelete={(t) => setDeletingTask(t)}
            />
          ))}
        </div>
      ) : (
        /* Responsive Data Table View */
        <TaskTable 
          tasks={filteredTasks}
          onView={(t) => setViewingTask(t)}
          onEdit={(t) => {
            setEditingTask(t);
            setIsTaskModalOpen(true);
          }}
          onDelete={(t) => setDeletingTask(t)}
          onStatusChange={handleQuickStatusChange}
        />
      )}

      {/* Add / Edit Task Modal Form */}
      <TaskModal 
        isOpen={isTaskModalOpen} 
        onClose={() => {
          setIsTaskModalOpen(false);
          setEditingTask(null);
          if (onCloseCreateModal) onCloseCreateModal();
        }}
        task={editingTask}
        onSubmit={handleCreateOrUpdateTask}
      />

      {/* View Task Details Modal */}
      <ViewDetailsModal 
        isOpen={!!viewingTask} 
        onClose={() => setViewingTask(null)}
        task={viewingTask}
        onEdit={(t) => {
          setEditingTask(t);
          setIsTaskModalOpen(true);
        }}
        onToggleSubtask={handleToggleSubtask}
      />

      {/* Confirm Delete Dialog */}
      <ConfirmDialog 
        isOpen={!!deletingTask}
        onClose={() => setDeletingTask(null)}
        onConfirm={handleDeleteTask}
        title="Delete Task"
        message={`Are you sure you want to permanently remove "${deletingTask?.title}" (${deletingTask?.id})? This action cannot be undone.`}
      />
    </div>
  );
};

export default DashboardPage;
