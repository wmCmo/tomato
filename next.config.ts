// @ts-check
import withSerwistInit from "@serwist/next";
import { NextConfig } from "next";

const withSerwist = withSerwistInit({
    swSrc: "app/sw.ts",
    swDest: "public/sw.js",
    register: true,
    disable: process.env.NODE_ENV === "development",
});

const nextConfig: NextConfig = {
    turbopack: {},
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'ayfuiffktqauvuorbwqv.supabase.co',
                pathname: '/storage/v1/object/public/avatars/**',
            },
            {
                protocol: "https",
                hostname: "lh3.googleusercontent.com",
                pathname: "/**"
            }
        ],
    },
};

export default withSerwist(nextConfig);
