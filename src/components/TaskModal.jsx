import React, { useState, useEffect } from 'react';
import { FiX, FiCheck, FiPlus, FiTrash2, FiAlertCircle } from 'react-icons/fi';
import { teamMembers } from '../services/initialData';

const TaskModal = ({ isOpen, onClose, onSubmit, task = null }) => {
  const isEditing = !!task;

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Development',
    priority: 'Medium',
    status: 'Pending',
    dueDate: '',
    assignedTo: teamMembers[0].name,
    estimatedHours: 16,
    progress: 0,
    tagsInput: 'Frontend, React',
    checklist: [
      { id: 1, text: 'Initial design review', completed: false },
      { id: 2, text: 'Core implementation & tests', completed: false }
    ]
  });

  const [newChecklistText, setNewChecklistText] = useState('');
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Populate form if editing
  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || '',
        description: task.description || '',
        category: task.category || 'Development',
        priority: task.priority || 'Medium',
        status: task.status || 'Pending',
        dueDate: task.dueDate || '',
        assignedTo: task.assignedTo || teamMembers[0].name,
        estimatedHours: task.estimatedHours || 16,
        progress: task.progress || 0,
        tagsInput: task.tags ? task.tags.join(', ') : '',
        checklist: task.checklist || []
      });
    } else {
      // Default dates: 7 days from today
      const nextWeek = new Date();
      nextWeek.setDate(nextWeek.getDate() + 7);
      const defaultDate = nextWeek.toISOString().split('T')[0];

      setFormData({
        title: '',
        description: '',
        category: 'Development',
        priority: 'Medium',
        status: 'Pending',
        dueDate: defaultDate,
        assignedTo: teamMembers[0].name,
        estimatedHours: 16,
        progress: 0,
        tagsInput: 'Feature, Sprint',
        checklist: [
          { id: 1, text: 'Requirements gathering & scoping', completed: true },
          { id: 2, text: 'Implementation & code review', completed: false }
        ]
      });
    }
    setErrors({});
  }, [task, isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Task title is required';
    } else if (formData.title.trim().length < 4) {
      newErrors.title = 'Title must be at least 4 characters long';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.trim().length < 10) {
      newErrors.description = 'Description must be at least 10 characters long';
    }

    if (!formData.dueDate) {
      newErrors.dueDate = 'Due date is required';
    }

    if (!formData.estimatedHours || Number(formData.estimatedHours) <= 0) {
      newErrors.estimatedHours = 'Estimated hours must be greater than 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error for field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  // Checklist Helpers
  const handleAddChecklistItem = (e) => {
    e.preventDefault();
    if (!newChecklistText.trim()) return;

    setFormData(prev => ({
      ...prev,
      checklist: [
        ...prev.checklist,
        { id: Date.now(), text: newChecklistText.trim(), completed: false }
      ]
    }));
    setNewChecklistText('');
  };

  const handleToggleChecklist = (id) => {
    setFormData(prev => {
      const updated = prev.checklist.map(item => 
        item.id === id ? { ...item, completed: !item.completed } : item
      );
      // Auto-recalculate progress based on completed checklist items
      const completed = updated.filter(i => i.completed).length;
      const progress = updated.length > 0 ? Math.round((completed / updated.length) * 100) : prev.progress;
      return { ...prev, checklist: updated, progress };
    });
  };

  const handleRemoveChecklist = (id) => {
    setFormData(prev => ({
      ...prev,
      checklist: prev.checklist.filter(item => item.id !== id)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      // Find selected team member info
      const selectedMember = teamMembers.find(m => m.name === formData.assignedTo) || teamMembers[0];

      // Parse tags
      const tags = formData.tagsInput
        .split(',')
        .map(t => t.trim())
        .filter(t => t.length > 0);

      const payload = {
        ...formData,
        tags,
        assigneeRole: selectedMember.role,
        assigneeAvatar: selectedMember.avatar,
        progress: Number(formData.progress),
        estimatedHours: Number(formData.estimatedHours)
      };

      await onSubmit(payload);
      onClose();
    } catch (err) {
      console.error(err);
      setErrors({ general: 'Failed to save task. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <h2 className="modal-title">
            {isEditing ? 'Edit Task Details' : 'Create New Task'}
          </h2>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
            <FiX />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div className="modal-body">
            {errors.general && (
              <div className="alert-box alert-danger">
                <FiAlertCircle /> <span>{errors.general}</span>
              </div>
            )}

            {/* Title */}
            <div className="form-group">
              <label className="form-label" htmlFor="task-title">
                Task Title *
              </label>
              <input 
                id="task-title"
                name="title" 
                type="text" 
                className={`form-input ${errors.title ? 'is-invalid' : ''}`}
                placeholder="e.g. Implement OAuth 2.0 and Multi-Factor Auth"
                value={formData.title}
                onChange={handleChange}
              />
              {errors.title && <div className="form-error"><FiAlertCircle /> {errors.title}</div>}
            </div>

            {/* Description */}
            <div className="form-group">
              <label className="form-label" htmlFor="task-desc">
                Description & Goals *
              </label>
              <textarea 
                id="task-desc"
                name="description" 
                rows="3" 
                className={`form-textarea ${errors.description ? 'is-invalid' : ''}`}
                placeholder="Detailed scope, technical requirements, and acceptance criteria..."
                value={formData.description}
                onChange={handleChange}
              />
              {errors.description && <div className="form-error"><FiAlertCircle /> {errors.description}</div>}
            </div>

            {/* Category & Priority Grid */}
            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label" htmlFor="task-category">Category</label>
                <select 
                  id="task-category"
                  name="category" 
                  className="form-select"
                  value={formData.category}
                  onChange={handleChange}
                >
                  <option value="Development">Development</option>
                  <option value="Design">Design</option>
                  <option value="Marketing">Marketing</option>
                  <option value="DevOps">DevOps</option>
                  <option value="Research">Research</option>
                  <option value="Security">Security</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="task-priority">Priority</label>
                <select 
                  id="task-priority"
                  name="priority" 
                  className="form-select"
                  value={formData.priority}
                  onChange={handleChange}
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Urgent">Urgent</option>
                </select>
              </div>
            </div>

            {/* Status & Assignee Grid */}
            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label" htmlFor="task-status">Status</label>
                <select 
                  id="task-status"
                  name="status" 
                  className="form-select"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="In Review">In Review</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="task-assigned">Assignee</label>
                <select 
                  id="task-assigned"
                  name="assignedTo" 
                  className="form-select"
                  value={formData.assignedTo}
                  onChange={handleChange}
                >
                  {teamMembers.map((m, idx) => (
                    <option key={idx} value={m.name}>
                      {m.name} ({m.department})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Due Date & Estimated Hours Grid */}
            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label" htmlFor="task-duedate">Due Date *</label>
                <input 
                  id="task-duedate"
                  name="dueDate" 
                  type="date" 
                  className={`form-input ${errors.dueDate ? 'is-invalid' : ''}`}
                  value={formData.dueDate}
                  onChange={handleChange}
                />
                {errors.dueDate && <div className="form-error"><FiAlertCircle /> {errors.dueDate}</div>}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="task-hours">Estimated Hours *</label>
                <input 
                  id="task-hours"
                  name="estimatedHours" 
                  type="number" 
                  min="1"
                  max="500"
                  className={`form-input ${errors.estimatedHours ? 'is-invalid' : ''}`}
                  value={formData.estimatedHours}
                  onChange={handleChange}
                />
                {errors.estimatedHours && <div className="form-error"><FiAlertCircle /> {errors.estimatedHours}</div>}
              </div>
            </div>

            {/* Progress Slider */}
            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.2rem' }}>
                <label className="form-label">Progress: {formData.progress}%</label>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  {formData.progress === 100 ? 'Completed 🎉' : 'In work'}
                </span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="100" 
                step="5"
                name="progress"
                value={formData.progress} 
                onChange={handleChange}
                style={{ width: '100%', accentColor: 'var(--primary)', cursor: 'pointer' }}
              />
            </div>

            {/* Tags Input */}
            <div className="form-group">
              <label className="form-label" htmlFor="task-tags">Tags (comma separated)</label>
              <input 
                id="task-tags"
                name="tagsInput" 
                type="text" 
                className="form-input"
                placeholder="React, Backend, Urgent, MVP"
                value={formData.tagsInput}
                onChange={handleChange}
              />
            </div>

            {/* Checklist / Subtasks Manager */}
            <div className="checklist-section">
              <div className="checklist-title">
                <span>Task Checklist / Subtasks</span>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>
                  {formData.checklist.filter(i => i.completed).length} / {formData.checklist.length} completed
                </span>
              </div>

              <div className="checklist-items">
                {formData.checklist.map((item) => (
                  <div key={item.id} className={`checklist-item ${item.completed ? 'completed' : ''}`}>
                    <label className="checklist-left" style={{ cursor: 'pointer' }}>
                      <input 
                        type="checkbox" 
                        checked={item.completed} 
                        onChange={() => handleToggleChecklist(item.id)} 
                        style={{ accentColor: 'var(--primary)', cursor: 'pointer' }}
                      />
                      <span>{item.text}</span>
                    </label>
                    <button 
                      type="button" 
                      onClick={() => handleRemoveChecklist(item.id)}
                      style={{ color: 'var(--text-dim)', cursor: 'pointer' }}
                      title="Remove subtask"
                    >
                      <FiTrash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>

              <div className="checklist-input-group">
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="Add a new subtask..."
                  value={newChecklistText}
                  onChange={(e) => setNewChecklistText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddChecklistItem(e);
                    }
                  }}
                  style={{ padding: '0.45rem 0.8rem', fontSize: '0.85rem' }}
                />
                <button 
                  type="button" 
                  className="btn btn-secondary btn-sm"
                  onClick={handleAddChecklistItem}
                >
                  <FiPlus /> Add
                </button>
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Saving...' : isEditing ? 'Update Task' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;
