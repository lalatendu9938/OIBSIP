import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchOrders();
  }, [navigate]);

  const fetchOrders = async () => {
    try {
      const response = await fetch(`https://oasis-pizza.onrender.com/api/orders/user/${user.id}`);
      const data = await response.json();
      setOrders(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Order Received': return '#ff9800'; // Orange
      case 'In the Kitchen': return '#17a2b8'; // Blue
      case 'Out for Delivery': return '#6f42c1'; // Purple
      case 'Delivered': return '#28a745'; // Green
      default: return '#6c757d'; // Grey
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9f6f0', paddingBottom: '60px', fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}>
      
      {/* Navigation */}
      <nav style={{ backgroundColor: 'white', padding: '15px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', position: 'sticky', top: 0, zIndex: 100 }}>
        <h1 style={{ margin: 0, color: '#e63946', fontSize: '26px', display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }} onClick={() => navigate('/dashboard')}>
          🍕 Oasis Pizza
        </h1>
        <button 
          onClick={() => navigate('/dashboard')} 
          style={{ padding: '10px 20px', backgroundColor: '#ff9800', color: 'white', border: 'none', borderRadius: '25px', cursor: 'pointer', fontSize: '14px', fontWeight: 'bold', boxShadow: '0 4px 10px rgba(255,152,0,0.2)' }}>
          ← Back to Menu
        </button>
      </nav>

      <div style={{ maxWidth: '900px', margin: '40px auto', padding: '0 20px' }}>
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h2 style={{ fontSize: '36px', color: '#333', margin: '0 0 10px 0' }}>My Orders 📦</h2>
          <p style={{ color: '#666', fontSize: '16px', margin: 0 }}>Track your cravings and past deliveries.</p>
        </motion.div>

        {loading ? (
          <div style={{ textAlign: 'center', fontSize: '18px', color: '#666' }}>Fetching your hot pizzas... 🍕</div>
        ) : orders.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '50px', backgroundColor: 'white', borderRadius: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
            <h3 style={{ color: '#555' }}>No orders yet! 😢</h3>
            <button onClick={() => navigate('/dashboard')} style={{ padding: '12px 25px', backgroundColor: '#e63946', color: 'white', border: 'none', borderRadius: '30px', cursor: 'pointer', fontWeight: 'bold', marginTop: '15px' }}>Order Now</button>
          </div>
        ) : (
          <motion.div variants={containerVariants} initial="hidden" animate="visible" style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
            {orders.map((order) => (
              <motion.div 
                key={order._id} 
                variants={itemVariants}
                whileHover={{ scale: 1.01 }}
                style={{ 
                  backgroundColor: 'white', 
                  borderRadius: '20px', 
                  padding: '30px', 
                  boxShadow: '0 10px 30px rgba(0,0,0,0.06)',
                  borderLeft: `6px solid ${getStatusColor(order.status)}`,
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                {/* Background Watermark */}
                <div style={{ position: 'absolute', right: '-20px', top: '-10px', fontSize: '100px', opacity: 0.03, userSelect: 'none', pointerEvents: 'none' }}>🧾</div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px dashed #eee', paddingBottom: '15px', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
                  <div>
                    <span style={{ color: '#888', fontSize: '14px', fontWeight: 'bold' }}>ORDER ID</span>
                    <div style={{ color: '#333', fontSize: '15px', fontFamily: 'monospace' }}>#{order._id.slice(-8).toUpperCase()}</div>
                  </div>
                  <div style={{ padding: '8px 16px', backgroundColor: `${getStatusColor(order.status)}20`, color: getStatusColor(order.status), borderRadius: '20px', fontWeight: 'bold', fontSize: '14px' }}>
                    {order.status}
                  </div>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', justifyContent: 'space-between' }}>
                  <div style={{ flex: '1 1 300px' }}>
                    <h4 style={{ margin: '0 0 10px 0', color: '#444' }}>🍕 Pizza Details</h4>
                    <p style={{ margin: '5px 0', color: '#666' }}><strong>Base:</strong> {order.pizzaDetails.base}</p>
                    <p style={{ margin: '5px 0', color: '#666' }}><strong>Sauce:</strong> {order.pizzaDetails.sauce}</p>
                    <p style={{ margin: '5px 0', color: '#666' }}><strong>Cheese:</strong> {order.pizzaDetails.cheese}</p>
                    <p style={{ margin: '5px 0', color: '#666' }}><strong>Veggies:</strong> {order.pizzaDetails.veggies.length > 0 ? order.pizzaDetails.veggies.join(', ') : 'None'}</p>
                  </div>

                  <div style={{ flex: '1 1 250px', backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '15px' }}>
                    <h4 style={{ margin: '0 0 10px 0', color: '#444' }}>💳 Payment Info</h4>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{ color: '#666' }}>Amount Paid:</span>
                      <span style={{ fontWeight: 'bold', color: '#28a745', fontSize: '18px' }}>₹{order.totalAmount}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{ color: '#666' }}>Method:</span>
                      <span style={{ fontWeight: 'bold', color: '#333' }}>{order.paymentStatus}</span>
                    </div>
                    <div style={{ marginTop: '10px', fontSize: '14px', color: '#777' }}>
                      <strong>📍 Delivery:</strong> {order.deliveryAddress}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default MyOrders;