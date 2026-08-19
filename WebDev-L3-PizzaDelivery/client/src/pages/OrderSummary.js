import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

// Ye function Razorpay ki script ko dynamically load karega
const loadScript = (src) => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = () => { resolve(true); };
    script.onerror = () => { resolve(false); };
    document.body.appendChild(script);
  });
};

function OrderSummary() {
  const location = useLocation();
  const navigate = useNavigate();
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cod'); 
  
  const pizzaDetails = location.state?.pizzaDetails;
  
  const basePrice = 299;
  const toppingsPrice = (pizzaDetails?.veggies?.length || 0) * 30;
  const totalAmount = basePrice + toppingsPrice;

  // Database mein order save karne ka function alag nikal liya
  const saveOrderToDatabase = async (user) => {
    try {
      const response = await fetch('https://oasis-pizza.onrender.com/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          user: user.id,
          pizzaDetails: pizzaDetails,
          deliveryAddress: address,
          totalAmount: totalAmount,
          paymentMethod: paymentMethod,
          status: 'Order Received'
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.log("Backend Error:", errorData);
        throw new Error(errorData.message || 'Failed to save order in DB');
      }
      return true;
    } catch (error) {
      console.error("DB Save Error:", error);
      return false;
    }
  };

  const handlePayment = async () => {
    if (!address) {
      alert('Please enter your delivery address to proceed!');
      return;
    }

    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      alert('Please login first');
      navigate('/login');
      return;
    }
    const user = JSON.parse(storedUser);

    if (paymentMethod === 'online') {
      // --- RAZORPAY ONLINE PAYMENT FLOW ---
      const res = await loadScript('https://checkout.razorpay.com/v1/checkout.js');
      if (!res) {
        alert('Razorpay SDK failed to load. Are you offline?');
        return;
      }

      try {
        // 1. Backend se Razorpay order ID mangwa
        const result = await fetch('https://oasis-pizza.onrender.com/api/payment/razorpay', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ amount: totalAmount })
        });
        const data = await result.json();

        // 2. Razorpay ka popup khol
        const options = {
          key: "rzp_test_YOUR_KEY_HERE", // 🚨 IMPORTANT: YAHAN APNI RAZORPAY KEY_ID PASTE KAR 🚨
          amount: data.amount,
          currency: data.currency,
          name: "🍕 Oasis Pizza",
          description: "Premium Pizza Delivery",
          order_id: data.id,
          handler: async function (response) {
            // 3. Payment Success hone ke baad hi Database mein order daalenge
            const isSaved = await saveOrderToDatabase(user);
            if (isSaved) {
              alert(`Payment Successful! Transaction ID: ${response.razorpay_payment_id}`);
              navigate('/my-orders');
            } else {
              alert('Payment successful, but failed to save order to database.');
            }
          },
          prefill: {
            name: user.name || "Customer",
            email: user.email || "",
          },
          theme: {
            color: "#e63946", // Tera mast red color
          },
        };

        const paymentObject = new window.Razorpay(options);
        paymentObject.open();

      } catch (error) {
        alert('Something went wrong opening Razorpay.');
        console.log("Razorpay Flow Error:", error);
      }

    } else {
      // --- CASH ON DELIVERY FLOW ---
      const isSaved = await saveOrderToDatabase(user);
      if (isSaved) {
        alert('Order Placed Successfully via Cash on Delivery! 🎉🛵');
        navigate('/my-orders');
      } else {
        alert('Failed to place order. Check server.');
      }
    }
  };

  if (!pizzaDetails) {
    return (
      <div style={{ textAlign: 'center', marginTop: '100px', fontFamily: 'sans-serif' }}>
        <h2>No Pizza Selected! 🍕</h2>
        <button onClick={() => navigate('/dashboard')} style={{ padding: '10px 20px', backgroundColor: '#ff9800', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
          Go back to menu
        </button>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9f6f0', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}>
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }} 
        animate={{ opacity: 1, scale: 1, y: 0 }} 
        transition={{ duration: 0.5 }}
        style={{ 
          display: 'flex', 
          flexDirection: 'row', 
          flexWrap: 'wrap',
          background: 'linear-gradient(135deg, #ffffff 0%, #fffdf8 100%)', 
          maxWidth: '1000px', 
          width: '100%', 
          borderRadius: '24px', 
          boxShadow: '0 20px 50px rgba(0,0,0,0.1)', 
          overflow: 'hidden' 
        }}
      >
        {/* Left Side: Pizza Image */}
        <div style={{ 
          flex: '1 1 400px', 
          backgroundImage: "url('https://images.unsplash.com/photo-1579684947550-22e945225d9a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')", 
          backgroundSize: 'cover', 
          backgroundPosition: 'center',
          minHeight: '350px',
          position: 'relative'
        }}>
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '40px 30px', background: 'linear-gradient(transparent, rgba(0,0,0,0.9))', color: 'white' }}>
            <motion.h2 initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.3 }} style={{ margin: '0 0 10px 0', fontSize: '36px', textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>
              Freshly Baked.
            </motion.h2>
            <motion.p initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.4 }} style={{ margin: 0, fontSize: '18px', opacity: 0.9 }}>
              Prepared with love, delivered hot. 🔥
            </motion.p>
          </div>
        </div>

        {/* Right Side: Checkout Form with Watermarks */}
        <div style={{ flex: '1 1 450px', padding: '40px', position: 'relative', overflow: 'hidden' }}>
          
          {/* Subtle Watermark Graphics */}
          <div style={{ position: 'absolute', top: '10%', right: '-10px', fontSize: '120px', opacity: 0.05, pointerEvents: 'none', transform: 'rotate(15deg)' }}>🧾</div>
          <div style={{ position: 'absolute', bottom: '20%', left: '-20px', fontSize: '140px', opacity: 0.04, pointerEvents: 'none', transform: 'rotate(-10deg)' }}>🛵</div>
          <div style={{ position: 'absolute', top: '50%', right: '10%', fontSize: '100px', opacity: 0.03, pointerEvents: 'none', transform: 'rotate(25deg)' }}>💳</div>

          <div style={{ position: 'relative', zIndex: 2 }}>
            <h2 style={{ margin: '0 0 20px 0', color: '#333', fontSize: '28px', borderBottom: '2px solid #eee', paddingBottom: '15px' }}>
              🧾 Order Summary
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '25px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '16px', color: '#666', fontWeight: 'bold' }}>🥖 Base</span>
                <span style={{ fontSize: '16px', color: '#222', fontWeight: '600' }}>{pizzaDetails.base}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '16px', color: '#666', fontWeight: 'bold' }}>🍅 Sauce</span>
                <span style={{ fontSize: '16px', color: '#222', fontWeight: '600' }}>{pizzaDetails.sauce}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '16px', color: '#666', fontWeight: 'bold' }}>🧀 Cheese</span>
                <span style={{ fontSize: '16px', color: '#222', fontWeight: '600' }}>{pizzaDetails.cheese}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <span style={{ fontSize: '16px', color: '#666', fontWeight: 'bold' }}>🥬 Veggies</span>
                <span style={{ fontSize: '15px', color: '#444', textAlign: 'right', maxWidth: '60%', fontWeight: '500' }}>
                  {pizzaDetails.veggies.length > 0 ? pizzaDetails.veggies.join(', ') : 'None'}
                </span>
              </div>
            </div>

            {/* Bill Block */}
            <div style={{ backgroundColor: 'rgba(248, 249, 250, 0.8)', padding: '20px', borderRadius: '12px', marginBottom: '25px', borderLeft: '6px solid #ff9800', backdropFilter: 'blur(5px)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', color: '#555' }}>
                <span>Base Price</span>
                <span>₹{basePrice}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', color: '#555' }}>
                <span>Toppings ({pizzaDetails.veggies.length}x)</span>
                <span>₹{toppingsPrice}</span>
              </div>
              <hr style={{ borderTop: '2px dashed #ddd', margin: '15px 0' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '900', fontSize: '22px', color: '#28a745' }}>
                <span>Total Amount</span>
                <span>₹{totalAmount}</span>
              </div>
            </div>

            {/* Address Input */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '8px', color: '#444' }}>📍 Delivery Address</label>
              <textarea 
                value={address} 
                onChange={(e) => setAddress(e.target.value)} 
                placeholder="Enter your full room/flat no. and street address..."
                style={{ width: '100%', padding: '14px', borderRadius: '10px', border: '1px solid #ccc', minHeight: '80px', fontSize: '15px', outline: 'none', resize: 'vertical', backgroundColor: 'rgba(255,255,255,0.9)', transition: 'border-color 0.3s' }}
                onFocus={(e) => e.target.style.borderColor = '#ff9800'}
                onBlur={(e) => e.target.style.borderColor = '#ccc'}
              />
            </div>

            {/* Payment Mode Selector */}
            <div style={{ marginBottom: '25px' }}>
              <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '10px', color: '#444' }}>💳 Select Payment Method</label>
              <div style={{ display: 'flex', gap: '15px' }}>
                <div 
                  onClick={() => setPaymentMethod('online')}
                  style={{ flex: 1, padding: '12px', textAlign: 'center', border: paymentMethod === 'online' ? '2px solid #e63946' : '2px solid #ddd', borderRadius: '10px', cursor: 'pointer', backgroundColor: paymentMethod === 'online' ? '#fff5f5' : 'white', fontWeight: 'bold', color: paymentMethod === 'online' ? '#e63946' : '#666', transition: 'all 0.2s' }}
                >
                  🌐 Pay with RazoPay
                </div>
                <div 
                  onClick={() => setPaymentMethod('cod')}
                  style={{ flex: 1, padding: '12px', textAlign: 'center', border: paymentMethod === 'cod' ? '2px solid #28a745' : '2px solid #ddd', borderRadius: '10px', cursor: 'pointer', backgroundColor: paymentMethod === 'cod' ? '#f0fff4' : 'white', fontWeight: 'bold', color: paymentMethod === 'cod' ? '#28a745' : '#666', transition: 'all 0.2s' }}
                >
                  🛵 Cash on Delivery
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <motion.button 
              whileHover={{ scale: 1.02, translateY: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={handlePayment} 
              style={{ 
                width: '100%', 
                padding: '18px', 
                backgroundColor: paymentMethod === 'online' ? '#e63946' : '#28a745', 
                color: 'white', 
                border: 'none', 
                borderRadius: '12px', 
                cursor: 'pointer', 
                fontSize: '18px', 
                fontWeight: 'bold',
                boxShadow: paymentMethod === 'online' ? '0 8px 20px rgba(230, 57, 70, 0.3)' : '0 8px 20px rgba(40, 167, 69, 0.3)',
                transition: 'background-color 0.3s'
              }}
            >
              {paymentMethod === 'online' ? `💳 Pay ₹${totalAmount} Online` : `🛵 Confirm COD Order`}
            </motion.button>
            
            <button 
              onClick={() => navigate('/dashboard')} 
              style={{ width: '100%', padding: '12px', marginTop: '15px', backgroundColor: 'transparent', color: '#666', border: 'none', cursor: 'pointer', fontWeight: 'bold', transition: 'color 0.2s' }}
              onMouseOver={(e) => e.target.style.color = '#333'}
              onMouseOut={(e) => e.target.style.color = '#666'}
            >
              ← Back to Menu
            </button>

          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default OrderSummary;