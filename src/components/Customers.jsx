import React, { useState, useEffect } from 'react';
import { customersAPI } from '../services/api';

function Customers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  });

  useEffect(() => {
    loadCustomers();
  }, []);

  async function loadCustomers() {
    try {
      setLoading(true);
      setError(null);
      const data = await customersAPI.getAll();
      setCustomers(data);
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
      if (editingId) {
        await customersAPI.update(editingId, formData);
      } else {
        await customersAPI.create(formData);
      }
      setFormData({ name: '', email: '', phone: '' });
      setEditingId(null);
      await loadCustomers();
    } catch (err) {
      setError(err.message);
    }
  }

  function handleEdit(customer) {
    setEditingId(customer.id);
    setFormData({
      name: customer.name,
      email: customer.email,
      phone: customer.phone
    });
  }

  function handleCancelEdit() {
    setEditingId(null);
    setFormData({ name: '', email: '', phone: '' });
  }

  async function handleDelete(id) {
    if (!window.confirm('Are you sure you want to delete this customer?')) {
      return;
    }
    try {
      setError(null);
      await customersAPI.delete(id);
      await loadCustomers();
    } catch (err) {
      setError(err.message);
    }
  }

  if (loading) {
    return <div style={styles.loading}>Loading customers...</div>;
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Customers</h2>

      {error && (
        <div style={styles.error}>
          Error: {error}
        </div>
      )}

      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.formRow}>
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleInputChange}
            required
            style={styles.input}
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleInputChange}
            required
            style={styles.input}
          />
          <input
            type="tel"
            name="phone"
            placeholder="Phone"
            value={formData.phone}
            onChange={handleInputChange}
            required
            style={styles.input}
          />
          <button type="submit" style={styles.buttonPrimary}>
            {editingId ? 'Update' : 'Add'} Customer
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
            <th style={styles.th}>Name</th>
            <th style={styles.th}>Email</th>
            <th style={styles.th}>Phone</th>
            <th style={styles.th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {customers.length === 0 ? (
            <tr>
              <td colSpan="5" style={styles.emptyState}>
                No customers found. Add your first customer above.
              </td>
            </tr>
          ) : (
            customers.map(customer => (
              <tr key={customer.id} style={styles.tr}>
                <td style={styles.td}>{customer.id}</td>
                <td style={styles.td}>{customer.name}</td>
                <td style={styles.td}>{customer.email}</td>
                <td style={styles.td}>{customer.phone}</td>
                <td style={styles.td}>
                  <button
                    onClick={() => handleEdit(customer)}
                    style={styles.buttonSmall}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(customer.id)}
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
    minWidth: '150px',
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

export default Customers;
