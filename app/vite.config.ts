import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// GitHub Pages: https://windowrainyoon.github.io/audio-system-digital-tween/
export default defineConfig({
  base: '/audio-system-digital-tween/',
  plugins: [react()],
});
