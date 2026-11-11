import React from 'react';
import { FiX, FiEdit2, FiCalendar, FiClock, FiCheckSquare, FiUser, FiTag } from 'react-icons/fi';

const ViewDetailsModal = ({ isOpen, onClose, task, onEdit, onToggleSubtask }) => {
  if (!isOpen || !task) return null;

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
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 700 }}>
              {task.id}
            </span>
            <span className={`badge ${getStatusClass(task.status)}`}>
              {task.status}
            </span>
            <span className={`badge ${getPriorityClass(task.priority)}`}>
              {task.priority}
            </span>
          </div>

          <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
            <FiX />
          </button>
        </div>

        {/* Modal Body */}
        <div className="modal-body">
          {/* Title */}
          <div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)', lineHeight: 1.3 }}>
              {task.title}
            </h2>
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
              <span className="badge badge-low">{task.category}</span>
              {task.createdAt && (
                <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)', alignSelf: 'center' }}>
                  Created on {task.createdAt}
                </span>
              )}
            </div>
          </div>

          {/* Metadata Grid */}
          <div className="view-meta-grid">
            <div className="meta-block">
              <span className="meta-label">Assignee</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.2rem' }}>
                <img 
                  src={task.assigneeAvatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80"} 
                  alt={task.assignedTo} 
                  className="table-avatar" 
                />
                <div>
                  <div className="meta-value">{task.assignedTo}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{task.assigneeRole}</div>
                </div>
              </div>
            </div>

            <div className="meta-block">
              <span className="meta-label">Due Date</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.35rem' }}>
                <FiCalendar style={{ color: 'var(--primary)' }} />
                <span className="meta-value">{task.dueDate}</span>
              </div>
            </div>

            <div className="meta-block">
              <span className="meta-label">Estimated Effort</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.35rem' }}>
                <FiClock style={{ color: 'var(--info)' }} />
                <span className="meta-value">{task.estimatedHours || 8} Hours</span>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.4rem' }}>
              <span style={{ fontWeight: 600 }}>Overall Progress</span>
              <span style={{ fontWeight: 700, color: 'var(--primary)' }}>{task.progress || 0}%</span>
            </div>
            <div className="progress-track" style={{ height: '8px' }}>
              <div 
                className="progress-fill" 
                style={{ 
                  width: `${task.progress || 0}%`,
                  background: task.progress === 100 ? 'var(--success)' : 'var(--primary-gradient)'
                }} 
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-muted)' }}>
              Description & Specifications
            </h4>
            <div className="detail-desc-box">
              {task.description}
            </div>
          </div>

          {/* Tags */}
          {task.tags && task.tags.length > 0 && (
            <div>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-muted)' }}>
                Tags
              </h4>
              <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                {task.tags.map((tag, idx) => (
                  <span key={idx} className="badge badge-low" style={{ textTransform: 'none' }}>
                    <FiTag size={12} /> {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Subtasks Checklist */}
          {task.checklist && task.checklist.length > 0 && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-muted)' }}>
                  Action Items & Deliverables ({task.checklist.filter(c => c.completed).length}/{task.checklist.length})
                </h4>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {task.checklist.map((item) => (
                  <div 
                    key={item.id} 
                    className={`checklist-item ${item.completed ? 'completed' : ''}`}
                    onClick={() => onToggleSubtask && onToggleSubtask(task.id, item.id)}
                    style={{ cursor: 'pointer' }}
                  >
                    <label className="checklist-left" style={{ cursor: 'pointer' }}>
                      <input 
                        type="checkbox" 
                        checked={item.completed} 
                        onChange={() => {}} 
                        style={{ accentColor: 'var(--primary)' }}
                      />
                      <span style={{ fontSize: '0.9rem' }}>{item.text}</span>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Close
          </button>
          <button 
            type="button" 
            className="btn btn-primary" 
            onClick={() => {
              onClose();
              onEdit(task);
            }}
          >
            <FiEdit2 /> Edit Task
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewDetailsModal;
