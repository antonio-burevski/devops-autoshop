import React, { useState } from 'react';
import Customers from './components/Customers';
import Vehicles from './components/Vehicles';
import Services from './components/Services';

function App() {
  const [activeTab, setActiveTab] = useState('customers');

  return (
    <div style={styles.app}>
      <header style={styles.header}>
        <h1 style={styles.headerTitle}>Auto/Moto Shop Management</h1>
        <p style={styles.headerSubtitle}>Manage customers, vehicles, and service records</p>
      </header>

      <nav style={styles.nav}>
        <button
          onClick={() => setActiveTab('customers')}
          style={{
            ...styles.tabButton,
            ...(activeTab === 'customers' ? styles.tabButtonActive : {})
          }}
        >
          Customers
        </button>
        <button
          onClick={() => setActiveTab('vehicles')}
          style={{
            ...styles.tabButton,
            ...(activeTab === 'vehicles' ? styles.tabButtonActive : {})
          }}
        >
          Vehicles
        </button>
        <button
          onClick={() => setActiveTab('services')}
          style={{
            ...styles.tabButton,
            ...(activeTab === 'services' ? styles.tabButtonActive : {})
          }}
        >
          Services
        </button>
      </nav>

      <main style={styles.main}>
        {activeTab === 'customers' && <Customers />}
        {activeTab === 'vehicles' && <Vehicles />}
        {activeTab === 'services' && <Services />}
      </main>

      <footer style={styles.footer}>
        <p>Auto/Moto Shop Management System - DevOps Application</p>
      </footer>
    </div>
  );
}

const styles = {
  app: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#2c3e50',
    color: 'white',
    padding: '30px 20px',
    textAlign: 'center',
  },
  headerTitle: {
    margin: 0,
    fontSize: '32px',
    fontWeight: 'bold',
  },
  headerSubtitle: {
    margin: '8px 0 0 0',
    fontSize: '14px',
    opacity: 0.9,
  },
  nav: {
    backgroundColor: 'white',
    borderBottom: '2px solid #dee2e6',
    display: 'flex',
    gap: '0',
    padding: '0',
  },
  tabButton: {
    flex: '1',
    padding: '16px 24px',
    border: 'none',
    backgroundColor: 'white',
    color: '#6c757d',
    fontSize: '16px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s',
    borderBottom: '3px solid transparent',
  },
  tabButtonActive: {
    color: '#007bff',
    borderBottom: '3px solid #007bff',
    backgroundColor: '#f8f9fa',
  },
  main: {
    flex: '1',
    maxWidth: '1400px',
    width: '100%',
    margin: '0 auto',
    padding: '0',
  },
  footer: {
    backgroundColor: '#2c3e50',
    color: 'white',
    textAlign: 'center',
    padding: '20px',
    marginTop: 'auto',
  },
};

export default App;
