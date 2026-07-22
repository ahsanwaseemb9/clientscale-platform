// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   env: {
//     NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL!,
//     SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY!,
//   },
// };

// export default nextConfig;

import type { NextConfig } from "next";

// Remove the 'env' object completely. 
// Next.js will now automatically load your .env.local file.
const nextConfig: NextConfig = {};

export default nextConfig;