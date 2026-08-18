import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      // Send data to our backend
      await axios.post('https://oasis-pizza.onrender.com/api/auth/register', {
        name,
        email,
        password,
        role: 'user' // By default, new accounts are normal users
      });
      setMessage('Registration successful! Redirecting to login...');
      setTimeout(() => navigate('/login'), 2000); // Send them to login after 2 seconds
    } catch (error) {
      setMessage(error.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: '0 auto' }}>
      <h2 style={{ textAlign: 'center' }}>Register for Oasis Pizza</h2>
      {message && <p style={{ color: 'blue', textAlign: 'center' }}>{message}</p>}
      
      <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <input 
          type="text" placeholder="Full Name" required
          value={name} onChange={(e) => setName(e.target.value)} 
          style={{ padding: '10px' }}
        />
        <input 
          type="email" placeholder="Email Address" required
          value={email} onChange={(e) => setEmail(e.target.value)} 
          style={{ padding: '10px' }}
        />
        <input 
          type="password" placeholder="Password" required
          value={password} onChange={(e) => setPassword(e.target.value)} 
          style={{ padding: '10px' }}
        />
        <button type="submit" style={{ padding: '10px', backgroundColor: '#28a745', color: 'white', border: 'none', cursor: 'pointer' }}>
          Register
        </button>
      </form>
      
      <div style={{ textAlign: 'center', marginTop: '15px' }}>
        <Link to="/login">Already have an account? Login</Link>
      </div>
    </div>
  );
}

export default Register;