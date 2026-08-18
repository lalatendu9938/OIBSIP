import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

function Dashboard() {
  const [user, setUser] = useState(null);
  const [base, setBase] = useState('');
  const [sauce, setSauce] = useState('');
  const [cheese, setCheese] = useState('');
  const [veggies, setVeggies] = useState([]);
  
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (!storedUser || !token) {
      navigate('/login');
    } else {
      setUser(JSON.parse(storedUser));
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const toggleVeggie = (topping) => {
    setVeggies(prev => 
      prev.includes(topping) ? prev.filter(v => v !== topping) : [...prev, topping]
    );
  };

  const handleProceedToSummary = (e) => {
    e.preventDefault();
    if (!base || !sauce || !cheese) {
      alert('Please select a base, sauce, and cheese to continue!');
      return;
    }
    const pizzaDetails = { base, sauce, cheese, veggies };
    navigate('/order-summary', { state: { pizzaDetails } });
  };

  if (!user) return <div style={{ textAlign: 'center', marginTop: '50px' }}>Loading Menu... 🍕</div>;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  const selectStyle = {
    width: '100%', 
    padding: '16px', 
    marginTop: '10px', 
    borderRadius: '12px', 
    border: '2px solid #f0e6d2', 
    fontSize: '16px',
    backgroundColor: 'rgba(255, 255, 255, 0.95)', // Thoda aur solid kiya taaki text padhne me aasaani ho
    cursor: 'pointer',
    outline: 'none',
    transition: 'all 0.3s',
    boxShadow: '0 4px 10px rgba(0,0,0,0.02)',
    position: 'relative',
    zIndex: 2 // Isko watermark ke upar laane ke liye
  };

  const toppingsList = ['Onions', 'Capsicum', 'Mushrooms', 'Jalapenos', 'Paneer', 'Chicken Strips'];

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9f6f0', paddingBottom: '60px', fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}>
      
      {/* Navigation Bar */}
      <nav style={{ backgroundColor: 'white', padding: '15px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', position: 'sticky', top: 0, zIndex: 100 }}>
        <h1 style={{ margin: 0, color: '#e63946', fontSize: '26px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          🍕 Oasis Pizza
        </h1>
        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
          <span style={{ fontWeight: '600', color: '#555', marginRight: '10px' }}>Hi, {user.name}</span>
          <button 
            onClick={() => navigate('/my-orders')} 
            style={{ padding: '10px 20px', backgroundColor: '#ff9800', color: 'white', border: 'none', borderRadius: '25px', cursor: 'pointer', fontSize: '14px', fontWeight: 'bold', boxShadow: '0 4px 10px rgba(255,152,0,0.2)' }}>
            🛒 My Orders
          </button>
          <button 
            onClick={handleLogout} 
            style={{ padding: '10px 20px', backgroundColor: '#f1f3f5', color: '#333', border: 'none', borderRadius: '25px', cursor: 'pointer', fontSize: '14px', fontWeight: 'bold' }}>
            Logout
          </button>
        </div>
      </nav>

      {/* Hero Banner */}
      <div style={{ 
        textAlign: 'center', 
        padding: '100px 20px 140px', 
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.7)), url('https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')`, 
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        color: 'white' 
      }}>
        <motion.h2 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} style={{ fontSize: '48px', margin: '0 0 10px 0', letterSpacing: '1px', textShadow: '2px 2px 8px rgba(0,0,0,0.5)' }}>
          Build Your Dream Pizza
        </motion.h2>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3, duration: 0.6 }} style={{ fontSize: '20px', margin: 0, opacity: 0.9, textShadow: '1px 1px 5px rgba(0,0,0,0.5)' }}>
          Handcrafted crusts. Signature sauces. Fresh toppings.
        </motion.p>
      </div>

      {/* Main Order Form Card with Background Graphics */}
      <motion.form 
        onSubmit={handleProceedToSummary} 
        variants={containerVariants} 
        initial="hidden" 
        animate="visible"
        style={{ 
          maxWidth: '850px', 
          margin: '-80px auto 0', 
          background: 'linear-gradient(135deg, #ffffff 0%, #fff9f0 100%)', 
          padding: '50px', 
          borderRadius: '24px', 
          boxShadow: '0 15px 40px rgba(0,0,0,0.12)', 
          position: 'relative', 
          zIndex: 10,
          overflow: 'hidden', 
          border: '1px solid rgba(255, 152, 0, 0.1)'
        }}
      >
        {/* OPACITY BADHA DI HAI YAHAN (0.15 aur 0.10 kar diya hai) */}
        <div style={{ position: 'absolute', top: '-10px', right: '-20px', fontSize: '180px', opacity: 0.15, pointerEvents: 'none', transform: 'rotate(15deg)', userSelect: 'none' }}>🍕</div>
        <div style={{ position: 'absolute', bottom: '-20px', left: '-30px', fontSize: '150px', opacity: 0.15, pointerEvents: 'none', transform: 'rotate(-20deg)', userSelect: 'none' }}>🍅</div>
        <div style={{ position: 'absolute', top: '40%', left: '45%', fontSize: '100px', opacity: 0.10, pointerEvents: 'none', transform: 'rotate(45deg)', userSelect: 'none' }}>🧀</div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '35px', position: 'relative', zIndex: 2 }}>
          
          <motion.div variants={itemVariants}>
            <label style={{ fontWeight: '800', color: '#444', fontSize: '17px', position: 'relative', zIndex: 2 }}>🥖 1. Base / Crust</label>
            <select value={base} onChange={(e) => setBase(e.target.value)} style={selectStyle}>
              <option value="">-- Select Base --</option>
              <option value="Thin Crust">Thin Crust</option>
              <option value="Thick Crust">Thick Crust</option>
              <option value="Cheese Burst">Cheese Burst</option>
              <option value="Whole Wheat">Whole Wheat</option>
              <option value="Gluten Free">Gluten Free</option>
            </select>
          </motion.div>

          <motion.div variants={itemVariants}>
            <label style={{ fontWeight: '800', color: '#444', fontSize: '17px', position: 'relative', zIndex: 2 }}>🍅 2. Signature Sauce</label>
            <select value={sauce} onChange={(e) => setSauce(e.target.value)} style={selectStyle}>
              <option value="">-- Select Sauce --</option>
              <option value="Tomato Basil">Tomato Basil</option>
              <option value="Spicy Garlic Sauce">Spicy Garlic Sauce</option>
              <option value="BBQ Sauce">BBQ Sauce</option>
              <option value="Pesto">Pesto</option>
              <option value="Alfredo">Alfredo</option>
            </select>
          </motion.div>

          <motion.div variants={itemVariants}>
            <label style={{ fontWeight: '800', color: '#444', fontSize: '17px', position: 'relative', zIndex: 2 }}>🧀 3. Cheese Type</label>
            <select value={cheese} onChange={(e) => setCheese(e.target.value)} style={selectStyle}>
              <option value="">-- Select Cheese --</option>
              <option value="Mozzarella">Mozzarella</option>
              <option value="Cheddar">Cheddar</option>
              <option value="Parmesan">Parmesan</option>
              <option value="Vegan Cheese">Vegan Cheese</option>
            </select>
          </motion.div>
        </div>

        <motion.div variants={itemVariants} style={{ marginTop: '40px', position: 'relative', zIndex: 2 }}>
          <label style={{ fontWeight: '800', color: '#444', fontSize: '17px', display: 'block', marginBottom: '15px' }}>
            🥬 4. Fresh Veggies & Proteins
          </label>
          <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
            {toppingsList.map(topping => {
              const isSelected = veggies.includes(topping);
              return (
                <motion.div
                  key={topping}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => toggleVeggie(topping)}
                  style={{
                    padding: '12px 24px',
                    backgroundColor: isSelected ? '#e63946' : 'rgba(255, 255, 255, 0.95)',
                    color: isSelected ? 'white' : '#555',
                    borderRadius: '30px',
                    cursor: 'pointer',
                    fontWeight: '600',
                    border: isSelected ? '2px solid #e63946' : '2px solid #f0e6d2',
                    boxShadow: isSelected ? '0 6px 15px rgba(230, 57, 70, 0.3)' : '0 2px 5px rgba(0,0,0,0.02)',
                    transition: 'all 0.2s',
                    userSelect: 'none'
                  }}
                >
                  {topping} {isSelected && '✓'}
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        <motion.div variants={itemVariants} style={{ marginTop: '50px', textAlign: 'center', position: 'relative', zIndex: 2 }}>
          <button 
            type="submit" 
            style={{ 
              padding: '18px 45px', 
              backgroundColor: '#28a745', 
              color: 'white', 
              border: 'none', 
              borderRadius: '35px', 
              cursor: 'pointer', 
              fontSize: '18px', 
              fontWeight: 'bold',
              boxShadow: '0 8px 25px rgba(40,167,69,0.35)',
              width: '100%',
              maxWidth: '400px',
              transition: 'transform 0.2s'
            }}
            onMouseOver={(e) => e.target.style.transform = 'translateY(-3px)'}
            onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
          >
            💳 Proceed to Checkout
          </button>
        </motion.div>
      </motion.form>
    </div>
  );
}

export default Dashboard;