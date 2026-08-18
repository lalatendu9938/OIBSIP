import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginType, setLoginType] = useState('customer');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('[https://oasis-pizza.onrender.com](https://oasis-pizza.onrender.com)/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));

        if (loginType === 'admin') {
          if (data.user.role !== 'admin') {
            alert('Access Denied! You are not authorized as an Admin in the Database.');
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            return;
          }
          navigate('/admin');
        } else {
          if (data.user.role === 'admin') {
             alert('You are an Admin! Please login from the Admin tab.');
             localStorage.removeItem('token');
             localStorage.removeItem('user');
             return;
          }
          navigate('/dashboard');
        }
      } else {
        alert(data.message || 'Login failed');
      }
    } catch (error) {
      alert('Error logging in. Please check your backend server.');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      /* Ekdum premium dark pizza background */
      backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.8)), url('https://images.unsplash.com/photo-1590947132387-155cc02f3212?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      padding: '20px'
    }}>
      
      <motion.div 
        initial={{ opacity: 0, y: 30 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.6, ease: "easeOut" }}
        style={{ 
          width: '100%', 
          maxWidth: '450px', 
          /* Glassmorphism Effect */
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.85) 100%)',
          backdropFilter: 'blur(10px)',
          padding: '40px', 
          borderRadius: '24px', 
          boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Subtle Watermark Graphics */}
        <div style={{ position: 'absolute', top: '-10px', right: '-20px', fontSize: '100px', opacity: 0.05, pointerEvents: 'none', transform: 'rotate(15deg)', userSelect: 'none' }}>🍕</div>
        <div style={{ position: 'absolute', bottom: '-20px', left: '-20px', fontSize: '100px', opacity: 0.05, pointerEvents: 'none', transform: 'rotate(-20deg)', userSelect: 'none' }}>🔐</div>

        <div style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <h1 style={{ margin: '0 0 10px 0', color: '#e63946', fontSize: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
              🍕 Oasis Pizza
            </h1>
            <p style={{ margin: 0, color: '#555', fontSize: '16px', fontWeight: '500' }}>Welcome back! Log in to satisfy your cravings.</p>
          </div>

          {/* Premium iOS-style Toggle Button */}
          <div style={{ display: 'flex', gap: '10px', marginBottom: '30px', background: '#f1f3f5', padding: '6px', borderRadius: '16px' }}>
            <button
              onClick={() => setLoginType('customer')}
              style={{ 
                flex: 1, 
                padding: '12px 20px', 
                backgroundColor: loginType === 'customer' ? 'white' : 'transparent', 
                color: loginType === 'customer' ? '#e63946' : '#666', 
                border: 'none', 
                borderRadius: '12px', 
                cursor: 'pointer', 
                fontWeight: 'bold',
                boxShadow: loginType === 'customer' ? '0 4px 10px rgba(0,0,0,0.08)' : 'none',
                transition: 'all 0.3s'
              }}>
              👤 Customer
            </button>
            <button
              onClick={() => setLoginType('admin')}
              style={{ 
                flex: 1, 
                padding: '12px 20px', 
                backgroundColor: loginType === 'admin' ? '#e63946' : 'transparent', 
                color: loginType === 'admin' ? 'white' : '#666', 
                border: 'none', 
                borderRadius: '12px', 
                cursor: 'pointer', 
                fontWeight: 'bold',
                boxShadow: loginType === 'admin' ? '0 4px 10px rgba(230, 57, 70, 0.3)' : 'none',
                transition: 'all 0.3s'
              }}>
              🛡️ Admin
            </button>
          </div>

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#444', fontSize: '14px' }}>Email Address</label>
              <input
                type="email"
                placeholder={loginType === 'admin' ? "admin@oasis.com" : "e.g. foodie@pizza.com"}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{ width: '100%', boxSizing: 'border-box', padding: '14px', borderRadius: '12px', border: '1px solid #ddd', fontSize: '15px', outline: 'none', transition: 'border-color 0.3s, box-shadow 0.3s', backgroundColor: 'rgba(255,255,255,0.8)' }}
                onFocus={(e) => { e.target.style.borderColor = '#e63946'; e.target.style.boxShadow = '0 0 0 3px rgba(230, 57, 70, 0.1)'; }}
                onBlur={(e) => { e.target.style.borderColor = '#ddd'; e.target.style.boxShadow = 'none'; }}
              />
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#444', fontSize: '14px' }}>Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ width: '100%', boxSizing: 'border-box', padding: '14px', borderRadius: '12px', border: '1px solid #ddd', fontSize: '15px', outline: 'none', transition: 'border-color 0.3s, box-shadow 0.3s', backgroundColor: 'rgba(255,255,255,0.8)' }}
                onFocus={(e) => { e.target.style.borderColor = '#e63946'; e.target.style.boxShadow = '0 0 0 3px rgba(230, 57, 70, 0.1)'; }}
                onBlur={(e) => { e.target.style.borderColor = '#ddd'; e.target.style.boxShadow = 'none'; }}
              />
            </div>

            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit" 
              style={{ 
                padding: '16px', 
                backgroundColor: loginType === 'admin' ? '#333' : '#ff9800', 
                color: 'white', 
                border: 'none', 
                borderRadius: '12px', 
                cursor: 'pointer', 
                fontSize: '16px', 
                fontWeight: 'bold', 
                marginTop: '10px',
                boxShadow: loginType === 'admin' ? '0 6px 15px rgba(0,0,0,0.2)' : '0 6px 15px rgba(255, 152, 0, 0.3)',
                transition: 'background-color 0.3s'
              }}
            >
              {loginType === 'admin' ? 'Login to Dashboard 🚀' : 'Sign In & Order 🍕'}
            </motion.button>
          </form>
          
          <p style={{ textAlign: 'center', marginTop: '25px', color: '#666', fontSize: '15px' }}>
            Don't have an account? <Link to="/register" style={{ color: '#e63946', textDecoration: 'none', fontWeight: 'bold' }}>Register here</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export default Login;