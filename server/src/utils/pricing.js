/**
 * Centralized Transparent Pricing Logic
 */
const calculateOrderTotals = (items) => {
  // items: [{ price, quantity }]
  const subtotal = items.reduce((acc, item) => {
    return acc + Number(item.price) * Number(item.quantity);
  }, 0);

  const platformFeeRate = parseFloat(process.env.PLATFORM_FEE_PERCENT || '3.0') / 100;
  const platformFee = Math.round(subtotal * platformFeeRate * 100) / 100;

  // Dynamic delivery fee rule: Flat rate of 70 INR, free for orders above 2500 INR
  const baseDeliveryFee = parseFloat(process.env.DEFAULT_DELIVERY_FEE || '70');
  const deliveryFee = subtotal >= 2500 || subtotal === 0 ? 0 : baseDeliveryFee;

  const totalAmount = Math.round((subtotal + platformFee + deliveryFee) * 100) / 100;

  return {
    subtotal,
    platformFee,
    deliveryFee,
    totalAmount,
    feePercentage: parseFloat(process.env.PLATFORM_FEE_PERCENT || '3.0'),
  };
};

module.exports = {
  calculateOrderTotals,
};
