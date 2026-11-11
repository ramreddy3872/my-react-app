import React from 'react';
import { FiEye, FiEdit2, FiTrash2, FiCalendar, FiClock } from 'react-icons/fi';

const TaskTable = ({ tasks, onView, onEdit, onDelete, onStatusChange }) => {
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

  return (
    <div className="table-container animate-fade-in">
      <table className="tasks-table">
        <thead>
          <tr>
            <th>Task & Category</th>
            <th>Priority</th>
            <th>Status</th>
            <th>Progress</th>
            <th>Assignee</th>
            <th>Due Date</th>
            <th style={{ textAlign: 'right' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr key={task.id}>
              {/* Task Title & Details */}
              <td>
                <div className="table-task-cell">
                  <span 
                    className="table-task-title" 
                    onClick={() => onView(task)}
                    title="Click to view details"
                  >
                    {task.title}
                  </span>
                  <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                    <span className="badge badge-low" style={{ fontSize: '0.7rem', padding: '0.1rem 0.4rem' }}>
                      {task.category}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
                      {task.id}
                    </span>
                  </div>
                </div>
              </td>

              {/* Priority */}
              <td>
                <span className={`badge ${getPriorityClass(task.priority)}`}>
                  {task.priority}
                </span>
              </td>

              {/* Status with Inline Quick-Update Dropdown */}
              <td>
                <select 
                  className={`form-select ${getStatusClass(task.status)}`}
                  style={{ 
                    padding: '0.3rem 0.6rem', 
                    fontSize: '0.8rem', 
                    borderRadius: 'var(--radius-full)',
                    width: 'auto',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                  value={task.status}
                  onChange={(e) => onStatusChange && onStatusChange(task.id, e.target.value)}
                  title="Quick change status"
                >
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="In Review">In Review</option>
                  <option value="Completed">Completed</option>
                </select>
              </td>

              {/* Progress Bar */}
              <td>
                <div className="table-progress-bar-wrapper">
                  <div className="progress-track">
                    <div 
                      className="progress-fill" 
                      style={{ 
                        width: `${task.progress || 0}%`,
                        background: task.progress === 100 ? 'var(--success)' : 'var(--primary-gradient)'
                      }} 
                    />
                  </div>
                  <span className="progress-text">{task.progress || 0}%</span>
                </div>
              </td>

              {/* Assignee */}
              <td>
                <div className="table-assignee-cell" title={`${task.assignedTo} - ${task.assigneeRole}`}>
                  <img 
                    src={task.assigneeAvatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80"} 
                    alt={task.assignedTo} 
                    className="table-avatar" 
                  />
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.88rem' }}>{task.assignedTo}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{task.assigneeRole}</div>
                  </div>
                </div>
              </td>

              {/* Due Date */}
              <td>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem' }}>
                  <FiCalendar style={{ color: 'var(--text-dim)' }} />
                  <span>{task.dueDate}</span>
                </div>
              </td>

              {/* Action Buttons */}
              <td style={{ textAlign: 'right' }}>
                <div className="action-buttons-group" style={{ justifyContent: 'flex-end' }}>
                  <button 
                    className="btn-icon" 
                    style={{ width: '32px', height: '32px' }} 
                    onClick={() => onView(task)}
                    title="View Full Details"
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
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TaskTable;
