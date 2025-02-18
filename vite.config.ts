import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { networkInterfaces } from 'os';

// Get local IP addresses
function getLocalIPs() {
  const interfaces = networkInterfaces();
  const addresses = [];
  
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (!iface.internal && iface.family === 'IPv4') {
        addresses.push(iface.address);
      }
    }
  }
  
  return addresses;
}

export default defineConfig(({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };

  return {
    plugins: [react()],
    server: {
      proxy: {
        '/api': {
          target: 'http://localhost:3000',
          changeOrigin: true,
          secure: false,
        }
      },
      port: parseInt(process.env.PORT || '5173', 10),
      strictPort: false,
      host: true,
      open: true,
      onListening: ({ address, port }) => {
        console.log('\n🚀 Vite dev server running at:\n');
        console.log(`   • Local:   http://localhost:${port}/`);
        getLocalIPs().forEach(ip => {
          console.log(`   • Network: http://${ip}:${port}/`);
        });
        console.log('\n  Ready for development!\n');
      },
    },
    define: {
      'process.env': process.env
    },
    optimizeDeps: {
      include: ['react', 'react-dom', 'react-router-dom', 'lucide-react']
    },
    build: {
      sourcemap: true,
      rollupOptions: {
        output: {
          manualChunks: {
            'react-vendor': ['react', 'react-dom', 'react-router-dom'],
            'ui-vendor': ['lucide-react'],
            'landing': [
              './src/pages/landing/AttorneyLanding.tsx',
              './src/pages/landing/CourtReporterLanding.tsx',
              './src/pages/landing/VideographerLanding.tsx',
              './src/pages/landing/ScopistLanding.tsx'
            ],
            'dashboard': [
              './src/pages/Dashboard.tsx',
              './src/pages/VideographerDashboard.tsx',
              './src/pages/ScopistDashboard.tsx'
            ]
          }
        }
      },
      target: 'esnext',
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true
        }
      },
      cssCodeSplit: true,
      assetsInlineLimit: 4096,
      chunkSizeWarningLimit: 1000
    },
    preview: {
      port: 4173,
      strictPort: true,
      host: true,
      open: true
    }
  };
});