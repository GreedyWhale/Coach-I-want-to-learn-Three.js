/*
 * @Description: https://cn.vitejs.dev/config/#configuring-vite
 * @Author: MADAO
 * @Date: 2023-12-22 10:31:17
 * @LastEditors: MADAO
 * @LastEditTime: 2024-01-09 11:14:12
 */
import { resolve } from 'path';
import { defineConfig } from 'vite';

import { getInputs } from './build/getInputs';

export default defineConfig({
  root: resolve(__dirname, './src'),
  build: {
    outDir: resolve(__dirname, './dist'),
    rollupOptions: {
      input: getInputs(),
    }
  },
  resolve: {
    alias: {
      '~': resolve(__dirname, './src'),
    },
  }
});
