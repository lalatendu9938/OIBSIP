import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const animatedBackgroundStyle = `
  @keyframes smoothGradient {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
  .admin-animated-bg {
    background: linear-gradient(-45deg, #f3f4f6, #ffffff, #ffebee, #e0f7fa);
    background-size: 400% 400%;
    animation: smoothGradient 15s ease infinite;
    min-height: 100vh;
    padding-bottom: 60px;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  }
`;

function AdminDashboard() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || user.role !== 'admin') {
      navigate('/login');
      return;
    }
    fetchAdminOrders();
  }, [navigate]);

  const fetchAdminOrders = async () => {
    try {
      const response = await fetch('https://oasis-pizza.onrender.com/api/orders/admin/all');
      const data = await response.json();
      setOrders(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching admin orders:', error);
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      const response = await fetch(`https://oasis-pizza.onrender.com/api/orders/admin/update-status/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        setOrders(orders.map(order => 
          order._id === orderId ? { ...order, status: newStatus } : order
        ));
      } else {
        alert('Failed to update status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Order Received': return '#ff9800'; 
      case 'In the Kitchen': return '#17a2b8'; 
      case 'Out for Delivery': return '#6f42c1'; 
      case 'Delivered': return '#28a745'; 
      default: return '#6c757d'; 
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } }
  };

  // --- ANALYTICS CALCULATIONS ---
  const totalRevenue = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
  const totalOrders = orders.length;
  
  const statusCounts = {
    'Order Received': orders.filter(o => o.status === 'Order Received').length,
    'In the Kitchen': orders.filter(o => o.status === 'In the Kitchen').length,
    'Out for Delivery': orders.filter(o => o.status === 'Out for Delivery').length,
    'Delivered': orders.filter(o => o.status === 'Delivered').length,
  };

  // NATIVE CSS DOUGHNUT CHART LOGIC (Zero Dependencies)
  const safeTotal = totalOrders === 0 ? 1 : totalOrders;
  const p1 = (statusCounts['Order Received'] / safeTotal) * 100;
  const p2 = p1 + ((statusCounts['In the Kitchen'] / safeTotal) * 100);
  const p3 = p2 + ((statusCounts['Out for Delivery'] / safeTotal) * 100);
  
  const conicGradient = `conic-gradient(
    #ff9800 0% ${p1}%, 
    #17a2b8 ${p1}% ${p2}%, 
    #6f42c1 ${p2}% ${p3}%, 
    #28a745 ${p3}% 100%
  )`;

  return (
    <>
      <style>{animatedBackgroundStyle}</style>
      <div className="admin-animated-bg">
        
        {/* Admin Navbar */}
        <nav style={{ backgroundColor: '#1a1a1a', padding: '15px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 4px 15px rgba(0,0,0,0.2)', position: 'sticky', top: 0, zIndex: 100 }}>
          <h1 style={{ margin: 0, color: '#e63946', fontSize: '26px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            🛡️ Oasis Pizza <span style={{ color: 'white', fontSize: '18px', fontWeight: 'normal', opacity: 0.8 }}>| Admin Panel</span>
          </h1>
          <button 
            onClick={handleLogout} 
            style={{ padding: '10px 20px', backgroundColor: '#e63946', color: 'white', border: 'none', borderRadius: '25px', cursor: 'pointer', fontSize: '14px', fontWeight: 'bold', transition: 'background 0.3s' }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#d32f2f'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#e63946'}
          >
            Logout
          </button>
        </nav>

        <div style={{ maxWidth: '1100px', margin: '40px auto', padding: '0 20px' }}>
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '36px', color: '#333', margin: '0 0 10px 0' }}>Live Dashboard 📊</h2>
            <p style={{ color: '#666', fontSize: '16px', margin: 0 }}>Business analytics and order management.</p>
          </motion.div>

          {/* BUSINESS SUMMARY & CHART SECTION */}
          {!loading && orders.length > 0 && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} style={{ display: 'flex', gap: '30px', marginBottom: '40px', flexWrap: 'wrap' }}>
              {/* Stats Cards */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderLeft: '8px solid #28a745' }}>
                  <div>
                    <p style={{ margin: 0, color: '#888', fontWeight: 'bold', fontSize: '14px', textTransform: 'uppercase' }}>Total Revenue</p>
                    <h3 style={{ margin: '5px 0 0 0', fontSize: '36px', color: '#333' }}>₹{totalRevenue}</h3>
                  </div>
                  <div style={{ fontSize: '40px' }}>💰</div>
                </div>
                <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderLeft: '8px solid #007bff' }}>
                  <div>
                    <p style={{ margin: 0, color: '#888', fontWeight: 'bold', fontSize: '14px', textTransform: 'uppercase' }}>Total Orders</p>
                    <h3 style={{ margin: '5px 0 0 0', fontSize: '36px', color: '#333' }}>{totalOrders} Pizzas</h3>
                  </div>
                  <div style={{ fontSize: '40px' }}>📦</div>
                </div>
              </div>
              
              {/* NATIVE Doughnut Chart (No library needed) */}
              <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', width: '300px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <p style={{ margin: '0 0 15px 0', color: '#555', fontWeight: 'bold' }}>Order Status Breakdown</p>
                <div style={{ 
                  width: '180px', 
                  height: '180px', 
                  borderRadius: '50%', 
                  background: totalOrders === 0 ? '#eee' : conicGradient,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: 'inset 0 0 10px rgba(0,0,0,0.1)'
                }}>
                  {/* The inner white circle to make it a Doughnut */}
                  <div style={{ width: '110px', height: '110px', backgroundColor: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontSize: '24px' }}>🍕</span>
                  </div>
                </div>
                {/* Legend */}
                <div style={{ display: 'flex', gap: '10px', marginTop: '20px', flexWrap: 'wrap', justifyContent: 'center', fontSize: '11px', fontWeight: 'bold', color: '#555' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><span style={{ width: '10px', height: '10px', backgroundColor: '#ff9800', borderRadius: '50%' }}></span> Received</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><span style={{ width: '10px', height: '10px', backgroundColor: '#17a2b8', borderRadius: '50%' }}></span> Kitchen</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><span style={{ width: '10px', height: '10px', backgroundColor: '#6f42c1', borderRadius: '50%' }}></span> Out</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><span style={{ width: '10px', height: '10px', backgroundColor: '#28a745', borderRadius: '50%' }}></span> Delivered</div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ORDERS GRID */}
          <h3 style={{ color: '#444', marginBottom: '20px', borderBottom: '2px solid #ddd', paddingBottom: '10px' }}>Recent Orders</h3>
          {loading ? (
            <div style={{ textAlign: 'center', fontSize: '18px', color: '#666', marginTop: '50px' }}>Loading live orders... 🔄</div>
          ) : orders.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '50px', backgroundColor: 'white', borderRadius: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
              <h3 style={{ color: '#555' }}>No active orders right now! 😴</h3>
            </div>
          ) : (
            <motion.div variants={containerVariants} initial="hidden" animate="visible" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '25px' }}>
              {orders.map((order) => (
                <motion.div 
                  key={order._id} 
                  variants={itemVariants}
                  style={{ 
                    backgroundColor: 'white', 
                    borderRadius: '16px', 
                    padding: '25px', 
                    boxShadow: '0 8px 25px rgba(0,0,0,0.08)',
                    borderTop: `6px solid ${getStatusColor(order.status)}`,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
                      <div>
                        <span style={{ fontSize: '12px', color: '#888', fontWeight: 'bold' }}>ORDER #{order._id.slice(-6).toUpperCase()}</span>
                        <h4 style={{ margin: '5px 0 0 0', color: '#222', fontSize: '18px' }}>
                          {order.user ? order.user.name : 'Unknown User'}
                        </h4>
                        <div style={{ fontSize: '13px', color: '#666' }}>{order.user ? order.user.email : 'No email'}</div>
                      </div>
                      <div style={{ fontWeight: '900', color: '#28a745', fontSize: '20px' }}>
                        ₹{order.totalAmount}
                      </div>
                    </div>

                    <div style={{ backgroundColor: '#f8f9fa', padding: '15px', borderRadius: '10px', marginBottom: '20px' }}>
                      <div style={{ fontWeight: 'bold', color: '#444', marginBottom: '8px', fontSize: '14px' }}>🍕 Order Details:</div>
                      <div style={{ fontSize: '14px', color: '#555', lineHeight: '1.6' }}>
                        <strong>Base:</strong> {order.pizzaDetails?.base || 'N/A'} <br/>
                        <strong>Sauce:</strong> {order.pizzaDetails?.sauce || 'N/A'} <br/>
                        <strong>Cheese:</strong> {order.pizzaDetails?.cheese || 'N/A'} <br/>
                        <strong>Veggies:</strong> {order.pizzaDetails?.veggies && order.pizzaDetails.veggies.length > 0 ? order.pizzaDetails.veggies.join(', ') : 'None'}
                      </div>
                      <hr style={{ borderTop: '1px dashed #ccc', margin: '10px 0' }}/>
                      <div style={{ fontSize: '13px', color: '#666' }}>
                        <strong>📍 To:</strong> {order.deliveryAddress}
                      </div>
                      <div style={{ fontSize: '13px', color: '#666', marginTop: '5px' }}>
                        <strong>💳 Payment:</strong> {order.paymentStatus}
                      </div>
                    </div>
                  </div>

                  {/* Status Updater Dropdown */}
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', color: '#555', marginBottom: '8px' }}>Update Status:</label>
                    <select 
                      value={order.status}
                      onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                      style={{ 
                        width: '100%', 
                        padding: '12px', 
                        borderRadius: '8px', 
                        border: `2px solid ${getStatusColor(order.status)}`, 
                        backgroundColor: `${getStatusColor(order.status)}10`,
                        color: getStatusColor(order.status),
                        fontWeight: 'bold',
                        fontSize: '15px',
                        cursor: 'pointer',
                        outline: 'none',
                        transition: 'all 0.3s'
                      }}
                    >
                      <option value="Order Received" style={{ color: 'black' }}>🟠 Order Received</option>
                      <option value="In the Kitchen" style={{ color: 'black' }}>🔵 In the Kitchen</option>
                      <option value="Out for Delivery" style={{ color: 'black' }}>🟣 Out for Delivery</option>
                      <option value="Delivered" style={{ color: 'black' }}>🟢 Delivered</option>
                    </select>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </>
  );
}

export default AdminDashboard;