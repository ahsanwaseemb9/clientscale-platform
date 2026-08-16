// lib/adapters/stripe.ts
import Stripe from 'stripe';

export async function fetchStripeFinancials(config: any) {
  const { secretKey } = config || {};
  
  if (!secretKey) {
    throw new Error('Missing Stripe secret key in tenant integration configuration.');
  }

  // 1. Initialize Stripe using the SPECIFIC tenant's key
  // This ensures data is pulled from the client's account, not a global test account.
const stripe = new Stripe(secretKey, {
    apiVersion: '2024-04-10' as any, 
  });
  // 2. Fetch recent charges for this specific tenant
  const charges = await stripe.charges.list({ limit: 100 });
  
  // 3. Filter out failed or refunded payments to get an accurate baseline
  const successfulCharges = charges.data.filter(charge => charge.paid && !charge.refunded);

  if (successfulCharges.length === 0) {
    return {
      provider: 'stripe',
      total_revenue: 0,
      average_order_value: 0,
      total_orders_analyzed: 0,
      currency: 'USD',
    };
  }

  // 4. Calculate Financials
  const totalRevenueCents = successfulCharges.reduce((acc, charge) => acc + charge.amount, 0);
  const totalOrders = successfulCharges.length;
  
  // Stripe returns amounts in cents, so we divide by 100 for true currency value
  const totalRevenue = totalRevenueCents / 100;
  const aov = totalRevenue / totalOrders;

  return {
    provider: 'stripe',
    total_revenue: totalRevenue,
    average_order_value: aov,
    total_orders_analyzed: totalOrders,
    currency: successfulCharges[0]?.currency?.toUpperCase() || 'USD',
  };
}