// lib/adapters/stripe.ts
import Stripe from 'stripe';

export async function fetchStripeFinancials(config: { secretKey: string }) {
  const { secretKey } = config;
  
  if (!secretKey) {
    throw new Error('Missing Stripe secret key in tenant integration configuration.');
  }

  // 1. Initialize Stripe using the SPECIFIC tenant's key
  const stripe = new Stripe(secretKey, {
    apiVersion: '2024-04-10' as any, 
  });

  try {
    // 2. Fetch recent charges for this specific tenant
    const charges = await stripe.charges.list({ limit: 100 });
    
    // 3. Categorize successful vs. failed payments
    const successfulCharges = charges.data.filter(charge => charge.paid && !charge.refunded);
    const failedCharges = charges.data.filter(charge => charge.status === 'failed');

    // 4. Calculate Baseline Financials (The Moat)
    const totalRevenueCents = successfulCharges.reduce((acc, charge) => acc + charge.amount, 0);
    const totalOrders = successfulCharges.length;
    
    const totalRevenue = totalRevenueCents / 100;
    const aov = totalOrders > 0 ? (totalRevenue / totalOrders) : 0;

    // 5. Calculate Revenue Leakage (The Bleed)
    const totalFailedCents = failedCharges.reduce((acc, charge) => acc + charge.amount, 0);
    const totalFailedRevenue = totalFailedCents / 100;

    return {
      provider: 'stripe',
      total_revenue: parseFloat(totalRevenue.toFixed(2)),
      average_order_value: parseFloat(aov.toFixed(2)),
      total_orders_analyzed: totalOrders,
      // NEW: Pass the actual failed revenue up to the dashboard
      failed_revenue: parseFloat(totalFailedRevenue.toFixed(2)),
      failed_transactions: failedCharges.length,
      currency: charges.data[0]?.currency?.toUpperCase() || 'USD',
    };

  } catch (error) {
    console.error('[Stripe Adapter Exception]:', error);
    // Safe fallback to prevent dashboard crashes during a live presentation
    return {
      provider: 'stripe',
      total_revenue: 0,
      average_order_value: 0,
      total_orders_analyzed: 0,
      failed_revenue: 0,
      failed_transactions: 0,
      currency: 'USD',
      error: 'Integration disconnected or unauthorized'
    };
  }
}