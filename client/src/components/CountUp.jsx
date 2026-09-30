import React, { useEffect, useState } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';

const CountUp = ({ value = 0, duration = 1.4, prefix = '', suffix = '', decimals = 0 }) => {
  const numericVal = typeof value === 'number' ? value : parseFloat(value) || 0;
  const spring = useSpring(0, { duration: duration * 1000, bounce: 0 });
  const display = useTransform(spring, (current) => {
    return `${prefix}${current.toLocaleString('en-IN', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    })}${suffix}`;
  });

  const [displayValue, setDisplayValue] = useState(`${prefix}0${suffix}`);

  useEffect(() => {
    spring.set(numericVal);
    const unsubscribe = display.on('change', (latest) => {
      setDisplayValue(latest);
    });
    return () => unsubscribe();
  }, [numericVal, spring, display, prefix, suffix]);

  return <span>{displayValue}</span>;
};

export default CountUp;
