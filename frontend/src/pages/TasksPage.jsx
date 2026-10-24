import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getTasks, createTask, updateTask, deleteTask } from '../services/api';
import Spinner from '../components/Spinner';
import ErrorMessage from '../components/ErrorMessage';
import Task from '../components/Task';
import ConfirmModal from '../components/ConfirmModal';
import { useAuth } from '../context/AuthContext';
import { 
  Plus, 
  Trash2, 
  CheckCircle, 
  Circle, 
  RefreshCw, 
  User, 
  LogOut, 
  Edit, 
  Calendar, 
  Save, 
  X,
  ShieldCheck
} from 'lucide-react';

function TasksPage() {
  const { user, logout } = useAuth();

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [completed, setCompleted] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [filter, setFilter] = useState('all');
  const [taskNotification, setTaskNotification] = useState(null);
  
  const [deleteId, setDeleteId] = useState(null);

  const fetchTasksList = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getTasks();
      setTasks(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Fetch tasks error:', err);
      setError(err.message || 'Failed to connect to backend server on http://localhost:5000');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasksList();
  }, []);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    setSubmitting(true);
    try {
      if (editingTask) {
        const updated = await updateTask(editingTask._id, { 
          title, 
          description, 
          priority, 
          completed 
        });
        setTasks((prev) =>
          prev.map((t) => (t._id === editingTask._id ? updated : t))
        );
        setTaskNotification({ type: 'success', message: 'Task updated successfully!' });
        handleCancelEdit();
      } else {
        const newTask = await createTask({ title, description, priority, completed });
        setTasks((prev) => [newTask, ...prev]);
        setTitle('');
        setDescription('');
        setPriority('medium');
        setCompleted(false);
        setTaskNotification({ type: 'success', message: 'Task created successfully in MongoDB!' });
      }
    } catch (err) {
      setTaskNotification({ type: 'error', message: `Failed to save task: ${err.message}` });
    } finally {
      setSubmitting(false);
    }
  };

  const handleStartEdit = (task) => {
    setEditingTask(task);
    setTitle(task.title || '');
    setDescription(task.description || '');
    setPriority(task.priority || 'medium');
    setCompleted(!!task.completed);
    window.scrollTo({ top: 120, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingTask(null);
    setTitle('');
    setDescription('');
    setPriority('medium');
    setCompleted(false);
  };

  const handleToggleCompleted = async (task) => {
    try {
      const updated = await updateTask(task._id, { completed: !task.completed });
      setTasks((prev) =>
        prev.map((t) => (t._id === task._id ? { ...t, completed: updated.completed } : t))
      );
      setTaskNotification({
        type: 'info',
        message: `Task marked as ${updated.completed ? 'completed' : 'pending'}.`
      });
    } catch (err) {
      setTaskNotification({ type: 'error', message: `Failed to update task: ${err.message}` });
    }
  };

  const promptDelete = (id) => {
    setDeleteId(id);
  };

  const handleConfirmDelete = async () => {
    if (!deleteId) return;
    const targetId = deleteId;
    setDeleteId(null);

    try {
      await deleteTask(targetId);
      setTasks((prev) => prev.filter((t) => t._id !== targetId));
      if (editingTask && editingTask._id === targetId) {
        handleCancelEdit();
      }
      setTaskNotification({ type: 'success', message: 'Task deleted from database!' });
    } catch (err) {
      setTaskNotification({ type: 'error', message: `Failed to delete task: ${err.message}` });
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Aug 20, 2026, 09:13 PM';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return 'Aug 20, 2026, 09:13 PM';
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }) + ', ' + d.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const filteredTasks = tasks.filter((t) => {
    if (filter === 'pending') return !t.completed;
    if (filter === 'completed') return t.completed;
    return true;
  });

  const getUserDisplayName = () => {
    if (!user) return 'Riya';
    if (user.name) return user.name;
    if (user.email) return user.email.split('@')[0];
    return 'Riya';
  };

  const getUserEmail = () => {
    if (!user) return 'riya@gmail.com';
    return user.email || 'riya@gmail.com';
  };

  return (
    <div className="page-container tasks-page">
      <Task task={taskNotification} onClose={() => setTaskNotification(null)} />
      
      <ConfirmModal
        isOpen={!!deleteId}
        title="Delete Task"
        message="Are you sure you want to permanently delete this task from the database?"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteId(null)}
      />

      {/* Header Section */}
      <div className="task-system-header">
        <div className="practical-badge">
          ✦ PRACTICAL 7: AUTHENTICATION &amp; MIDDLEWARE PIPELINE
        </div>
        <h1 className="task-system-title">Task Management System</h1>
        <p className="task-system-subtitle">
          Express Middleware Pipeline + JWT Bearer Verification + bcrypt Hashing + MongoDB
        </p>

        {/* User Auth Banner Bar */}
        <div className="auth-banner-bar">
          <div className="auth-banner-user">
            <User className="user-avatar-icon" size={18} />
            <span className="welcome-text">
              Welcome, <strong>{getUserDisplayName()}!</strong>{' '}
              <span className="email-subtext">({getUserEmail()})</span>
            </span>
          </div>

          {user ? (
            <button onClick={logout} className="btn-logout-pill">
              <LogOut size={14} /> Logout
            </button>
          ) : (
            <Link to="/login" className="btn-login-pill">
              Login
            </Link>
          )}
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="tasks-layout-grid">
        {/* Left Column: Form Card */}
        <div className="card-section task-form-card">
          <h2 className="section-title">
            {editingTask ? '✏️ Edit Task' : '➕ Add New Task'}
          </h2>
          
          <form onSubmit={handleFormSubmit} className="task-form">
            <div className="form-group">
              <label className="form-label" htmlFor="task-title">Title *</label>
              <input
                id="task-title"
                type="text"
                className="form-input"
                placeholder="e.g. Implement Practical 7 Authenticato"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="task-desc">Description</label>
              <textarea
                id="task-desc"
                className="form-textarea"
                rows={3}
                placeholder="Add details about this task..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="form-row-group">
              <div className="form-group flex-1">
                <label className="form-label" htmlFor="task-priority">Priority</label>
                <select
                  id="task-priority"
                  className="form-select priority-select"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                >
                  <option value="medium">🟡 Medium</option>
                  <option value="low">🟢 Low</option>
                  <option value="high">🔴 High</option>
                </select>
              </div>

              <div className="form-group checkbox-group">
                <label className="checkbox-label" htmlFor="task-completed">
                  <input
                    id="task-completed"
                    type="checkbox"
                    checked={completed}
                    onChange={(e) => setCompleted(e.target.checked)}
                    className="custom-checkbox"
                  />
                  <span>Completed</span>
                </label>
              </div>
            </div>

            <div className="form-action-buttons">
              <button 
                type="submit" 
                className="btn btn-primary-pill btn-block" 
                disabled={submitting}
              >
                {submitting ? (
                  'Saving...'
                ) : editingTask ? (
                  <>Save Changes <Save size={16} /></>
                ) : (
                  <>Add Task <Plus size={16} /></>
                )}
              </button>

              {editingTask && (
                <button
                  type="button"
                  className="btn btn-outline-pill btn-block mt-2"
                  onClick={handleCancelEdit}
                >
                  Cancel <X size={16} />
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Right Column: Protected Task List */}
        <div className="card-section task-list-card">
          <div className="list-header-row">
            <h2 className="section-title">
              📋 Protected Task List ({tasks.length})
            </h2>
            
            <button 
              className="btn-refresh-pill" 
              onClick={fetchTasksList} 
              title="Refresh Task List"
            >
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Refresh
            </button>
          </div>

          <div className="filter-pills-row">
            <button
              className={`filter-tab-pill ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              All ({tasks.length})
            </button>
            <button
              className={`filter-tab-pill ${filter === 'pending' ? 'active' : ''}`}
              onClick={() => setFilter('pending')}
            >
              Pending ({tasks.filter(t => !t.completed).length})
            </button>
            <button
              className={`filter-tab-pill ${filter === 'completed' ? 'active' : ''}`}
              onClick={() => setFilter('completed')}
            >
              Completed ({tasks.filter(t => t.completed).length})
            </button>
          </div>

          {loading && <Spinner message="Loading protected tasks from backend..." />}

          {error && !loading && (
            <ErrorMessage message={error} onRetry={fetchTasksList} />
          )}

          {!loading && !error && (
            <div className="task-items-container">
              {filteredTasks.length === 0 ? (
                <div className="empty-box">
                  <p>No tasks available in database.</p>
                </div>
              ) : (
                filteredTasks.map((task) => (
                  <div
                    key={task._id}
                    className={`task-card-item ${task.completed ? 'completed-item' : ''}`}
                  >
                    <div className="task-card-header">
                      <div className="task-title-wrap">
                        <input
                          type="checkbox"
                          checked={!!task.completed}
                          onChange={() => handleToggleCompleted(task)}
                          className="task-item-checkbox"
                        />
                        <h3 className="task-item-title">{task.title}</h3>
                      </div>

                      <span className={`priority-badge-capsule priority-${task.priority || 'medium'}`}>
                        {(task.priority || 'medium').toUpperCase()}
                      </span>
                    </div>

                    {task.description && (
                      <p className="task-item-desc">{task.description}</p>
                    )}

                    <div className="task-card-footer">
                      <div className="created-date-info">
                        <Calendar size={14} className="calendar-icon" />
                        <span>Created: {formatDate(task.createdAt)}</span>
                      </div>

                      <div className="task-actions-group">
                        <button
                          className="btn-task-action btn-edit-action"
                          onClick={() => handleStartEdit(task)}
                          title="Edit Task"
                        >
                          <Edit size={14} /> Edit
                        </button>
                        <button
                          className="btn-task-action btn-delete-action"
                          onClick={() => promptDelete(task._id)}
                          title="Delete Task"
                        >
                          <Trash2 size={14} /> Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TasksPage;

