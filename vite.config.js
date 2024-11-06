import path from "path";

import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default ({ mode }) => {
    process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };

    const proxy_url =
        process.env.VITE_DEV_REMOTE === "remote"
            ? process.env.VITE_BACKEND_SERVER
            : "http://localhost:3000/";

    const config = {
        plugins: [react()],
        build: {
            outDir: "dist",
            rollupOptions: {
                output: {
                    manualChunks: undefined,
                },
            },
        },
        resolve: {
            base: "/",
            alias: {
                "@": path.resolve(__dirname, "src"),
            },
        },
        server: {
            proxy: {
                "/api": {
                    target: proxy_url,
                    // changeOrigin: true,
                    // secure: false,
                },
            },
        },
    };
    return defineConfig(config);
};
