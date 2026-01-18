import React, { useState, useEffect } from 'react';
import { servicesAPI, vehiclesAPI } from '../services/api';

function Services() {
  const [services, setServices] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    vehicle_id: '',
    description: '',
    cost: '',
    date: '',
    status: 'pending'
  });

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);
      setError(null);
      const [servicesData, vehiclesData] = await Promise.all([
        servicesAPI.getAll(),
        vehiclesAPI.getAll()
      ]);
      setServices(servicesData);
      setVehicles(vehiclesData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function handleInputChange(e) {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setError(null);
      const submitData = {
        ...formData,
        vehicle_id: parseInt(formData.vehicle_id),
        cost: parseFloat(formData.cost),
      };

      if (editingId) {
        await servicesAPI.update(editingId, submitData);
      } else {
        await servicesAPI.create(submitData);
      }
      setFormData({ vehicle_id: '', description: '', cost: '', date: '', status: 'pending' });
      setEditingId(null);
      await loadData();
    } catch (err) {
      setError(err.message);
    }
  }

  function handleEdit(service) {
    setEditingId(service.id);
    setFormData({
      vehicle_id: service.vehicle_id.toString(),
      description: service.description,
      cost: service.cost.toString(),
      date: service.date,
      status: service.status
    });
  }

  function handleCancelEdit() {
    setEditingId(null);
    setFormData({ vehicle_id: '', description: '', cost: '', date: '', status: 'pending' });
  }

  async function handleDelete(id) {
    if (!window.confirm('Are you sure you want to delete this service record?')) {
      return;
    }
    try {
      setError(null);
      await servicesAPI.delete(id);
      await loadData();
    } catch (err) {
      setError(err.message);
    }
  }

  function getVehicleInfo(vehicleId) {
    const vehicle = vehicles.find(v => v.id === vehicleId);
    return vehicle ? `${vehicle.make} ${vehicle.model} (${vehicle.year})` : 'N/A';
  }

  function getTodayDate() {
    const today = new Date();
    return today.toISOString().split('T')[0];
  }

  if (loading) {
    return <div style={styles.loading}>Loading services...</div>;
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Services</h2>

      {error && (
        <div style={styles.error}>
          Error: {error}
        </div>
      )}

      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.formRow}>
          <select
            name="vehicle_id"
            value={formData.vehicle_id}
            onChange={handleInputChange}
            required
            style={styles.input}
          >
            <option value="">Select Vehicle</option>
            {vehicles.map(vehicle => (
              <option key={vehicle.id} value={vehicle.id}>
                {vehicle.make} {vehicle.model} ({vehicle.year})
              </option>
            ))}
          </select>
          <input
            type="text"
            name="description"
            placeholder="Service Description"
            value={formData.description}
            onChange={handleInputChange}
            required
            style={{ ...styles.input, flex: 2 }}
          />
          <input
            type="number"
            name="cost"
            placeholder="Cost"
            step="0.01"
            value={formData.cost}
            onChange={handleInputChange}
            required
            style={styles.input}
          />
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleInputChange}
            required
            style={styles.input}
          />
          <select
            name="status"
            value={formData.status}
            onChange={handleInputChange}
            required
            style={styles.input}
          >
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <button type="submit" style={styles.buttonPrimary}>
            {editingId ? 'Update' : 'Add'} Service
          </button>
          {editingId && (
            <button type="button" onClick={handleCancelEdit} style={styles.buttonSecondary}>
              Cancel
            </button>
          )}
        </div>
      </form>

      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>ID</th>
            <th style={styles.th}>Vehicle</th>
            <th style={styles.th}>Description</th>
            <th style={styles.th}>Cost</th>
            <th style={styles.th}>Date</th>
            <th style={styles.th}>Status</th>
            <th style={styles.th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {services.length === 0 ? (
            <tr>
              <td colSpan="7" style={styles.emptyState}>
                No service records found. Add your first service above.
              </td>
            </tr>
          ) : (
            services.map(service => (
              <tr key={service.id} style={styles.tr}>
                <td style={styles.td}>{service.id}</td>
                <td style={styles.td}>{getVehicleInfo(service.vehicle_id)}</td>
                <td style={styles.td}>{service.description}</td>
                <td style={styles.td}>${service.cost.toFixed(2)}</td>
                <td style={styles.td}>{service.date}</td>
                <td style={styles.td}>
                  <span style={getStatusStyle(service.status)}>
                    {service.status}
                  </span>
                </td>
                <td style={styles.td}>
                  <button
                    onClick={() => handleEdit(service)}
                    style={styles.buttonSmall}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(service.id)}
                    style={{ ...styles.buttonSmall, ...styles.buttonDanger }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

function getStatusStyle(status) {
  const baseStyle = {
    padding: '4px 8px',
    borderRadius: '3px',
    fontSize: '12px',
    fontWeight: '500',
    textTransform: 'capitalize',
  };

  const statusColors = {
    pending: { backgroundColor: '#fff3cd', color: '#856404' },
    'in-progress': { backgroundColor: '#cce5ff', color: '#004085' },
    completed: { backgroundColor: '#d4edda', color: '#155724' },
    cancelled: { backgroundColor: '#f8d7da', color: '#721c24' },
  };

  return { ...baseStyle, ...(statusColors[status] || {}) };
}

const styles = {
  container: {
    padding: '20px',
  },
  title: {
    marginBottom: '20px',
    fontSize: '24px',
    fontWeight: 'bold',
  },
  loading: {
    padding: '20px',
    textAlign: 'center',
  },
  error: {
    backgroundColor: '#fee',
    color: '#c33',
    padding: '10px',
    borderRadius: '4px',
    marginBottom: '20px',
    border: '1px solid #fcc',
  },
  form: {
    marginBottom: '30px',
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '4px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
  formRow: {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap',
  },
  input: {
    flex: '1',
    minWidth: '120px',
    padding: '8px 12px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '14px',
  },
  buttonPrimary: {
    padding: '8px 16px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
  },
  buttonSecondary: {
    padding: '8px 16px',
    backgroundColor: '#6c757d',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
  },
  table: {
    width: '100%',
    backgroundColor: 'white',
    borderCollapse: 'collapse',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    borderRadius: '4px',
    overflow: 'hidden',
  },
  th: {
    backgroundColor: '#f8f9fa',
    padding: '12px',
    textAlign: 'left',
    fontWeight: '600',
    borderBottom: '2px solid #dee2e6',
  },
  td: {
    padding: '12px',
    borderBottom: '1px solid #dee2e6',
  },
  tr: {
    '&:hover': {
      backgroundColor: '#f8f9fa',
    },
  },
  buttonSmall: {
    padding: '4px 12px',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '3px',
    cursor: 'pointer',
    fontSize: '13px',
    marginRight: '5px',
  },
  buttonDanger: {
    backgroundColor: '#dc3545',
  },
  emptyState: {
    padding: '40px',
    textAlign: 'center',
    color: '#6c757d',
  },
};

export default Services;
