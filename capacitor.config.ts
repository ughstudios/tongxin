import { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'com.example.tongxin',
  appName: 'TongXin',
  webDir: 'out',
  bundledWebRuntime: false,
  server: {
    url: 'http://localhost:3000',
    cleartext: true
  }
}

export default config

