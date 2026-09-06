// lib/adapters/shopify.ts

export async function fetchShopifyFinancials(config: { shopUrl: string; accessToken: string }) {
  const { shopUrl, accessToken } = config;

  // Calculate the date 30 days ago for a rolling monthly baseline
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const formattedDate = thirtyDaysAgo.toISOString();

  // Query Shopify's GraphQL Admin API for recent order totals
  const query = `
    {
      orders(first: 250, query: "created_at:>= '${formattedDate}'") {
        edges {
          node {
            currentTotalPriceSet {
              shopMoney {
                amount
              }
            }
          }
        }
      }
    }
  `;

  try {
    const response = await fetch(`https://${shopUrl.replace(/^https?:\/\//, '')}/admin/api/2024-01/graphql.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': accessToken,
      },
      body: JSON.stringify({ query }),
    });

    const result = await response.json();

    if (result.errors) {
      console.error('[Shopify Adapter API Error]:', result.errors);
      throw new Error('Failed to fetch Shopify order data');
    }

    const orders = result.data.orders.edges;
    
    if (orders.length === 0) {
      return {
        provider: 'shopify',
        total_revenue: 0,
        average_order_value: 0,
        order_count: 0
      };
    }

    // Calculate actual revenue and exact AOV based on hard data
    const totalRevenue = orders.reduce((sum: number, order: any) => {
      return sum + parseFloat(order.node.currentTotalPriceSet.shopMoney.amount);
    }, 0);

    const averageOrderValue = totalRevenue / orders.length;

    return {
      provider: 'shopify',
      total_revenue: parseFloat(totalRevenue.toFixed(2)),
      average_order_value: parseFloat(averageOrderValue.toFixed(2)),
      order_count: orders.length
    };

  } catch (error) {
    console.error('[Shopify Adapter Exception]:', error);
    // Safe fallback so the boardroom dashboard doesn't crash during a live pitch if the token expires
    return {
      provider: 'shopify',
      total_revenue: 0,
      average_order_value: 0,
      order_count: 0,
      error: 'Integration disconnected or unavailable'
    };
  }
}