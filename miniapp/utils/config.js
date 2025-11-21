/**
 * Configuration File
 * NO HARDCODED SECRETS - All sensitive values use environment variables
 *
 * @file config.js
 * @description Application configuration settings
 * @see TECH_DESIGN.md Section 5 (Security Design)
 */

// API Configuration
const API_CONFIG = {
  // Base URL for real API (will be configured in RM-011)
  // Currently using mock mode, real API URL to be added later
  baseUrl: '',

  // API timeout in milliseconds
  timeout: 10000,

  // API version
  version: 'v1'
};

// Mock Mode Configuration
const MOCK_CONFIG = {
  // Enable/disable mock mode (true for development, false for production)
  useMock: true,

  // Mock response delay (in milliseconds, for simulating network latency)
  mockDelay: 100
};

// App Configuration
const APP_CONFIG = {
  // App name
  name: '陪玩服务平台',

  // App version
  version: '1.0.0',

  // Debug mode (enable console logs)
  debug: true
};

module.exports = {
  API_CONFIG,
  MOCK_CONFIG,
  APP_CONFIG
};
