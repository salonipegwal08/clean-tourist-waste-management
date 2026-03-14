import { useState, useEffect } from 'react';
import { motion, useSpring, useTransform, animate } from 'framer-motion';

const AnimatedCounter = ({ value, duration = 2 }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    // Strip non-numeric characters for the animation logic
    const numericValue = parseInt(value.toString().replace(/,/g, '').replace(/\+/g, '').replace(/K/g, '000')) || 0;
    
    const controls = animate(0, numericValue, {
      duration: duration,
      onUpdate: (latest) => {
        setDisplayValue(Math.floor(latest));
      },
    });

    return () => controls.stop();
  }, [value, duration]);

  // Determine suffix (e.g., +, K)
  const suffix = value.toString().includes('+') ? '+' : value.toString().includes('K') ? 'K' : '';
  
  const formattedValue = displayValue >= 1000 && value.toString().includes('K') 
    ? (displayValue / 1000).toFixed(displayValue % 1000 === 0 ? 0 : 1) 
    : displayValue.toLocaleString();

  return (
    <span>{formattedValue}{suffix}</span>
  );
};

export default AnimatedCounter;
