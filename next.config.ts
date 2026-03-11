// @ts-check
import withSerwistInit from "@serwist/next";

const withSerwist = withSerwistInit({
    swSrc: "app/sw.ts",
    swDest: "public/sw.js",
    register: true,
    disable: process.env.NODE_ENV === "development",
});

const nextConfig = {
    turbopack: {},
};

export default withSerwist(nextConfig);
