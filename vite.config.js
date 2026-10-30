import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';
import path from 'path'; // <--- TAMBAHKAN BARIS INI

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/js/app.jsx'],
            refresh: true,
        }),
        react(),
    ],
    resolve: {
        alias: {
         '@': path.resolve(__dirname, 'resources/js'), // Alias @ mengarah ke resources/js 
        },
    },
    server: {
        host: '0.0.0.0',
        port: 5177,
        strictPort: true,
        cors: true, // Mengaktifkan header Access-Control-Allow-Origin
        origin: 'http://32.236.168.110:5177', // Memastikan origin aset mengarah ke IP & port Vite
        hmr: {
            host: '32.236.168.110',
            port: 5177,
        },
        watch: {
            ignored: ['**/vendor/**', '**/node_modules/**'],
        },
    },
});
