import { defineConfig, presetUno } from 'unocss';

export default defineConfig({
  // shortcuts: [{ box: 'max-w-7xl mx-auto bg-gray-100 rounded-md shadow-sm p-4' }],
  presets: [presetUno()],
  envMode: 'build',
  rules: [[/^wh-(\d+)$/, ([, d]) => ({ width: `${d}px`, height: `${d}px` })]],
});
