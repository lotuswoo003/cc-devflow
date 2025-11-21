/**
 * Unit Tests for Mock Data Provider
 * @file miniapp/utils/__tests__/mock.test.js
 * @see ../mock.js
 * @see TASKS.md Phase 2 (T007-T011)
 */

const mock = require('../mock');

describe('Mock Data Provider', () => {
  describe('getServices()', () => {
    test('T007: should return success response with code 0', () => {
      const response = mock.getServices();
      expect(response.code).toBe(0);
      expect(response.message).toBe('获取服务列表成功');
    });

    test('T008: should return array of active services', () => {
      const response = mock.getServices();
      expect(Array.isArray(response.data)).toBe(true);
      expect(response.data.length).toBeGreaterThan(0);

      // All returned services should be active
      response.data.forEach(service => {
        expect(service.status).toBe('active');
      });
    });

    test('T009: should return services with all required fields', () => {
      const response = mock.getServices();
      const service = response.data[0];

      // Verify required fields exist
      expect(service).toHaveProperty('id');
      expect(service).toHaveProperty('name');
      expect(service).toHaveProperty('description');
      expect(service).toHaveProperty('price');
      expect(service).toHaveProperty('imageUrl');
      expect(service).toHaveProperty('category');
      expect(service).toHaveProperty('status');
    });

    test('T010: should return services with valid imageUrl format', () => {
      const response = mock.getServices();

      response.data.forEach(service => {
        // ImageUrl should be Picsum URL after implementation
        // This test will FAIL initially (current: /images/services/*.jpg)
        // After T026-T028 (Phase 4), should PASS (Picsum URLs)
        expect(service.imageUrl).toMatch(/^https?:\/\//);
      });
    });

    test('T011: should return services with valid data types', () => {
      const response = mock.getServices();
      const service = response.data[0];

      expect(typeof service.id).toBe('string');
      expect(typeof service.name).toBe('string');
      expect(typeof service.description).toBe('string');
      expect(typeof service.price).toBe('number');
      expect(typeof service.imageUrl).toBe('string');
      expect(typeof service.category).toBe('string');
      expect(typeof service.status).toBe('string');
    });
  });

  describe('getServiceById()', () => {
    test('should return success response for valid ID', () => {
      const response = mock.getServiceById('srv_001');
      expect(response.code).toBe(0);
      expect(response.data).toBeDefined();
      expect(response.data.id).toBe('srv_001');
    });

    test('should return 404 for invalid ID', () => {
      const response = mock.getServiceById('invalid_id');
      expect(response.code).toBe(404);
      expect(response.data).toBeNull();
      expect(response.message).toBe('服务不存在');
    });

    test('should return service with all fields', () => {
      const response = mock.getServiceById('srv_001');
      expect(response.data).toHaveProperty('id');
      expect(response.data).toHaveProperty('name');
      expect(response.data).toHaveProperty('imageUrl');
    });
  });

  describe('simulateError()', () => {
    test('should return 500 error response', () => {
      const response = mock.simulateError();
      expect(response.code).toBe(500);
      expect(response.data).toBeNull();
      expect(response.message).toBe('服务器内部错误');
    });
  });
});
