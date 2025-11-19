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
  // Base URL for real API (will be used in RM-011)
  // Use environment variable or default to empty string
  baseUrl: process.env.API_BASE_URL || '',

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
