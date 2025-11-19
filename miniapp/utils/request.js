/**
 * Network Request Utility
 * Wrapper for wx.request with Mock mode support
 *
 * @file request.js
 * @description Unified network request handler with Mock/Real API switching
 * @see TECH_DESIGN.md Section 4 (API Design)
 * @see TECH_DESIGN.md Section 5 (Security Design)
 */

const { API_CONFIG, MOCK_CONFIG } = require('./config');
const mock = require('./mock');

/**
 * Validate request URL
 * @param {String} url - Request URL
 * @throws {Error} If URL is invalid
 */
function validateUrl(url) {
  if (!url || typeof url !== 'string' || url.trim() === '') {
    throw new Error('Request URL is required and must be a non-empty string');
  }
}

/**
 * Validate request options
 * @param {Object} options - Request options
 * @throws {Error} If options are invalid
 */
function validateOptions(options) {
  if (options && typeof options !== 'object') {
    throw new Error('Request options must be an object');
  }
}

/**
 * GET request
 * @param {String} url - Request URL (e.g., '/services')
 * @param {Object} options - Request options
 * @param {Boolean} options.useMock - Use mock data (default: from config)
 * @returns {Promise<Object>} Response data
 */
function get(url, options = {}) {
  // Input validation
  validateUrl(url);
  validateOptions(options);

  const useMock = options.useMock !== undefined ? options.useMock : MOCK_CONFIG.useMock;

  return new Promise((resolve, reject) => {
    // Mock mode
    if (useMock) {
      // Simulate network delay
      setTimeout(() => {
        try {
          let response;

          // Route to appropriate mock function
          if (url === '/services') {
            response = mock.getServices();
          } else if (url.startsWith('/services/')) {
            const id = url.split('/')[2];
            response = mock.getServiceById(id);
          } else {
            response = {
              code: 404,
              data: null,
              message: `Mock endpoint not found: ${url}`
            };
          }

          // Check response code
          if (response.code === 0) {
            resolve(response);
          } else {
            reject(response);
          }
        } catch (error) {
          reject({
            code: 500,
            data: null,
            message: error.message || '服务器内部错误'
          });
        }
      }, MOCK_CONFIG.mockDelay);
    }
    // Real API mode
    else {
      const fullUrl = API_CONFIG.baseUrl + url;

      wx.request({
        url: fullUrl,
        method: 'GET',
        timeout: API_CONFIG.timeout,
        success: (res) => {
          if (res.statusCode === 200 && res.data.code === 0) {
            resolve(res.data);
          } else {
            reject(res.data || {
              code: res.statusCode,
              data: null,
              message: '请求失败'
            });
          }
        },
        fail: (err) => {
          reject({
            code: 500,
            data: null,
            message: err.errMsg || '网络请求失败'
          });
        }
      });
    }
  });
}

/**
 * POST request
 * @param {String} url - Request URL
 * @param {Object} data - Request body data
 * @param {Object} options - Request options
 * @param {Boolean} options.useMock - Use mock data (default: from config)
 * @returns {Promise<Object>} Response data
 */
function post(url, data = {}, options = {}) {
  // Input validation
  validateUrl(url);
  validateOptions(options);

  const useMock = options.useMock !== undefined ? options.useMock : MOCK_CONFIG.useMock;

  return new Promise((resolve, reject) => {
    // Mock mode (not implemented for POST in current phase)
    if (useMock) {
      reject({
        code: 501,
        data: null,
        message: 'POST requests not supported in mock mode yet'
      });
    }
    // Real API mode
    else {
      const fullUrl = API_CONFIG.baseUrl + url;

      wx.request({
        url: fullUrl,
        method: 'POST',
        data: data,
        timeout: API_CONFIG.timeout,
        header: {
          'content-type': 'application/json'
        },
        success: (res) => {
          if (res.statusCode === 200 && res.data.code === 0) {
            resolve(res.data);
          } else {
            reject(res.data || {
              code: res.statusCode,
              data: null,
              message: '请求失败'
            });
          }
        },
        fail: (err) => {
          reject({
            code: 500,
            data: null,
            message: err.errMsg || '网络请求失败'
          });
        }
      });
    }
  });
}

module.exports = {
  get,
  post
};
