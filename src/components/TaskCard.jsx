import React from 'react';
import { FiCalendar, FiClock, FiEye, FiEdit2, FiTrash2, FiCheckCircle } from 'react-icons/fi';

const TaskCard = ({ task, onView, onEdit, onDelete }) => {
  const getPriorityClass = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'urgent': return 'badge-urgent';
      case 'high': return 'badge-high';
      case 'medium': return 'badge-medium';
      default: return 'badge-low';
    }
  };

  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed': return 'badge-completed';
      case 'in progress': return 'badge-in-progress';
      case 'in review': return 'badge-in-review';
      default: return 'badge-pending';
    }
  };

  const completedChecklistCount = task.checklist ? task.checklist.filter(c => c.completed).length : 0;
  const totalChecklistCount = task.checklist ? task.checklist.length : 0;

  // Check if due date is within next 2 days or overdue
  const isUrgentDate = () => {
    if (!task.dueDate) return false;
    const today = new Date();
    today.setHours(0,0,0,0);
    const due = new Date(task.dueDate);
    const diffDays = Math.ceil((due - today) / (1000 * 60 * 60 * 24));
    return diffDays <= 2;
  };

  return (
    <div className="task-grid-card animate-fade-in">
      <div>
        {/* Header Meta: Category and Priority */}
        <div className="card-header-meta">
          <span className="badge badge-low" style={{ fontSize: '0.72rem' }}>
            {task.category || 'General'}
          </span>
          <div style={{ display: 'flex', gap: '0.4rem' }}>
            <span className={`badge ${getStatusClass(task.status)}`}>
              {task.status}
            </span>
            <span className={`badge ${getPriorityClass(task.priority)}`}>
              {task.priority}
            </span>
          </div>
        </div>

        {/* Task Title */}
        <h3 className="card-task-title" onClick={() => onView(task)} title="Click to view details">
          {task.title}
        </h3>

        {/* Description */}
        <p className="card-task-desc">
          {task.description}
        </p>

        {/* Tags */}
        {task.tags && task.tags.length > 0 && (
          <div className="card-tags">
            {task.tags.map((tag, idx) => (
              <span key={idx} className="tag-badge">#{tag}</span>
            ))}
          </div>
        )}

        {/* Progress Section */}
        <div className="card-progress-section">
          <div className="card-progress-header">
            <span>Progress ({task.progress || 0}%)</span>
            {totalChecklistCount > 0 && (
              <span>{completedChecklistCount}/{totalChecklistCount} subtasks</span>
            )}
          </div>
          <div className="progress-track">
            <div 
              className="progress-fill" 
              style={{ 
                width: `${task.progress || 0}%`,
                background: task.progress === 100 ? 'var(--success)' : 'var(--primary-gradient)'
              }} 
            />
          </div>
        </div>
      </div>

      {/* Card Footer: Assignee, Due Date & Actions */}
      <div className="card-footer">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <img 
            src={task.assigneeAvatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80"} 
            alt={task.assignedTo || 'Assignee'} 
            className="table-avatar"
            title={`${task.assignedTo} (${task.assigneeRole || 'Team Member'})`}
          />
          <div className={`card-due-date ${isUrgentDate() && task.status !== 'Completed' ? 'urgent' : ''}`}>
            <FiCalendar />
            <span>{task.dueDate}</span>
          </div>
        </div>

        <div className="action-buttons-group">
          <button 
            className="btn-icon" 
            style={{ width: '32px', height: '32px' }} 
            onClick={() => onView(task)}
            title="View Details"
          >
            <FiEye />
          </button>
          <button 
            className="btn-icon" 
            style={{ width: '32px', height: '32px' }} 
            onClick={() => onEdit(task)}
            title="Edit Task"
          >
            <FiEdit2 />
          </button>
          <button 
            className="btn-icon" 
            style={{ width: '32px', height: '32px', color: 'var(--danger)' }} 
            onClick={() => onDelete(task)}
            title="Delete Task"
          >
            <FiTrash2 />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
