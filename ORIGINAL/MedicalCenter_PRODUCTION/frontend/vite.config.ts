import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: { proxy: { '/api': 'https://5000-im508t39sv51uy7g9ygxt-df2635a1.manusvm.computer' },  port: 5175, host: true, watch: { usePolling: true }, hmr: { protocol: 'ws', host: '5175-im508t39sv51uy7g9ygxt-df2635a1.manusvm.computer' } },
  build: { outDir: "dist", sourcemap: false },
  base: "/"
});