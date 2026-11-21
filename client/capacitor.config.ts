import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.megamart.app',
  appName: 'MegaMart',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    cleartext: true,
  },
  plugins: {
    StatusBar: {
      backgroundColor: '#059669',
      style: 'DARK',
    },
  },
};

export default config;
