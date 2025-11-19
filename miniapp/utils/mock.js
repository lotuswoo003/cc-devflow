/**
 * Mock Data Provider for Development Phase
 * This file will be replaced with real API in RM-011
 *
 * @file mock.js
 * @description Provides mock service data for frontend development
 * @see data-model.md for data structure specification
 * @see contracts/api-contract.json for API contract
 */

const MOCK_SERVICES = [
  {
    id: 'srv_001',
    name: '王者荣耀陪玩',
    description: '专业上分，稳定不坑，段位：王者50星，擅长打野和中单位置',
    price: 30.00,
    imageUrl: '/images/services/game_wzry.jpg',
    category: '游戏陪玩',
    status: 'active'
  },
  {
    id: 'srv_002',
    name: '语音聊天陪伴',
    description: '温柔甜美，解压聊天，让你快乐每一天，支持唱歌和讲故事',
    price: 20.00,
    imageUrl: '/images/services/voice_chat.jpg',
    category: '语音陪玩',
    status: 'active'
  },
  {
    id: 'srv_003',
    name: '吃鸡陪玩',
    description: '高胜率，枪法精准，带你轻松吃鸡，支持四排和双排模式',
    price: 35.00,
    imageUrl: '/images/services/game_pubg.jpg',
    category: '游戏陪玩',
    status: 'active'
  }
];

/**
 * Get all services
 * @returns {Object} Response object with code, data, message
 */
function getServices() {
  return {
    code: 0,
    data: MOCK_SERVICES.filter(s => s.status === 'active'),
    message: '获取服务列表成功'
  };
}

/**
 * Get service by ID
 * @param {String} id - Service ID
 * @returns {Object} Response object with code, data, message
 */
function getServiceById(id) {
  const service = MOCK_SERVICES.find(s => s.id === id);

  if (service) {
    return {
      code: 0,
      data: service,
      message: '获取服务详情成功'
    };
  } else {
    return {
      code: 404,
      data: null,
      message: '服务不存在'
    };
  }
}

/**
 * Simulate error response (for testing error handling)
 * @returns {Object} Error response
 */
function simulateError() {
  return {
    code: 500,
    data: null,
    message: '服务器内部错误'
  };
}

module.exports = {
  getServices,
  getServiceById,
  simulateError
};
