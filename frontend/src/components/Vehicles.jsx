import React, { useState, useEffect } from 'react';
import { vehiclesAPI, customersAPI } from '../services/api';

function Vehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    make: '',
    model: '',
    year: '',
    price: '',
    status: 'available',
    customer_id: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);
      setError(null);
      const [vehiclesData, customersData] = await Promise.all([
        vehiclesAPI.getAll(),
        customersAPI.getAll()
      ]);
      setVehicles(vehiclesData);
      setCustomers(customersData);
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
        year: parseInt(formData.year),
        price: parseFloat(formData.price),
        customer_id: formData.customer_id ? parseInt(formData.customer_id) : null
      };

      if (editingId) {
        await vehiclesAPI.update(editingId, submitData);
      } else {
        await vehiclesAPI.create(submitData);
      }
      setFormData({ make: '', model: '', year: '', price: '', status: 'available', customer_id: '' });
      setEditingId(null);
      await loadData();
    } catch (err) {
      setError(err.message);
    }
  }

  function handleEdit(vehicle) {
    setEditingId(vehicle.id);
    setFormData({
      make: vehicle.make,
      model: vehicle.model,
      year: vehicle.year.toString(),
      price: vehicle.price.toString(),
      status: vehicle.status,
      customer_id: vehicle.customer_id ? vehicle.customer_id.toString() : ''
    });
  }

  function handleCancelEdit() {
    setEditingId(null);
    setFormData({ make: '', model: '', year: '', price: '', status: 'available', customer_id: '' });
  }

  async function handleDelete(id) {
    if (!window.confirm('Are you sure you want to delete this vehicle?')) {
      return;
    }
    try {
      setError(null);
      await vehiclesAPI.delete(id);
      await loadData();
    } catch (err) {
      setError(err.message);
    }
  }

  function getCustomerName(customerId) {
    const customer = customers.find(c => c.id === customerId);
    return customer ? customer.name : 'N/A';
  }

  if (loading) {
    return <div style={styles.loading}>Loading vehicles...</div>;
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Vehicles</h2>

      {error && (
        <div style={styles.error}>
          Error: {error}
        </div>
      )}

      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.formRow}>
          <input
            type="text"
            name="make"
            placeholder="Make"
            value={formData.make}
            onChange={handleInputChange}
            required
            style={styles.input}
          />
          <input
            type="text"
            name="model"
            placeholder="Model"
            value={formData.model}
            onChange={handleInputChange}
            required
            style={styles.input}
          />
          <input
            type="number"
            name="year"
            placeholder="Year"
            value={formData.year}
            onChange={handleInputChange}
            required
            style={styles.input}
          />
          <input
            type="number"
            name="price"
            placeholder="Price"
            step="0.01"
            value={formData.price}
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
            <option value="available">Available</option>
            <option value="sold">Sold</option>
            <option value="reserved">Reserved</option>
            <option value="service">In Service</option>
          </select>
          <select
            name="customer_id"
            value={formData.customer_id}
            onChange={handleInputChange}
            style={styles.input}
          >
            <option value="">No Owner</option>
            {customers.map(customer => (
              <option key={customer.id} value={customer.id}>
                {customer.name}
              </option>
            ))}
          </select>
          <button type="submit" style={styles.buttonPrimary}>
            {editingId ? 'Update' : 'Add'} Vehicle
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
            <th style={styles.th}>Make</th>
            <th style={styles.th}>Model</th>
            <th style={styles.th}>Year</th>
            <th style={styles.th}>Price</th>
            <th style={styles.th}>Status</th>
            <th style={styles.th}>Owner</th>
            <th style={styles.th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {vehicles.length === 0 ? (
            <tr>
              <td colSpan="8" style={styles.emptyState}>
                No vehicles found. Add your first vehicle above.
              </td>
            </tr>
          ) : (
            vehicles.map(vehicle => (
              <tr key={vehicle.id} style={styles.tr}>
                <td style={styles.td}>{vehicle.id}</td>
                <td style={styles.td}>{vehicle.make}</td>
                <td style={styles.td}>{vehicle.model}</td>
                <td style={styles.td}>{vehicle.year}</td>
                <td style={styles.td}>${vehicle.price.toFixed(2)}</td>
                <td style={styles.td}>
                  <span style={getStatusStyle(vehicle.status)}>
                    {vehicle.status}
                  </span>
                </td>
                <td style={styles.td}>{getCustomerName(vehicle.customer_id)}</td>
                <td style={styles.td}>
                  <button
                    onClick={() => handleEdit(vehicle)}
                    style={styles.buttonSmall}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(vehicle.id)}
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
    available: { backgroundColor: '#d4edda', color: '#155724' },
    sold: { backgroundColor: '#d1ecf1', color: '#0c5460' },
    reserved: { backgroundColor: '#fff3cd', color: '#856404' },
    service: { backgroundColor: '#f8d7da', color: '#721c24' },
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

export default Vehicles;
