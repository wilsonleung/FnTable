import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import dts from 'vite-plugin-dts';
import path from 'node:path';

// reference:
// 
// https://dev.to/nicolaserny/create-a-react-component-library-with-vite-and-typescript-1ih9

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // plugin to generate type definitions
    dts({
      insertTypesEntry: true,
    }),
  ],
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/lib/index.ts'),
      name: 'MyLib',
      formats: ['es', 'umd'],
      fileName: (format) => `my-lib.${format}.js`,
    },
    rollupOptions: {
      // externalize dependencies and not want to bundle into the library
      external: ['react', 'react-dom'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
        },
      },
    },
  },
})
