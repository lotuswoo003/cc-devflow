# Data Model: RM-001 - 小程序项目初始化

**Status**: Draft
**Created**: 2025-11-20T00:00:00Z
**Type**: Data Model Specification

---

## Overview

This document defines the **Mock Data Model** for the Companion Service Platform (陪玩服务平台) Mini-Program during the development phase (RM-001 through RM-010). The data structures defined here serve as **API contracts** for future backend implementation in RM-009.

**Important Notes**:
- This is **NOT a database schema** (no database in RM-001)
- These structures represent **Mock API responses** for frontend development
- Real database schema will be designed in RM-009 (后端基础架构)
- Mock data will be replaced with real API in RM-011 (前后端联调)

---

## Entity: Service (服务项目)

### Purpose

Represents a companion service offered on the platform (e.g., gaming companion, voice chat, travel companion, etc.).

### Fields

| Field Name | Type | Required | Constraints | Description | Example |
|------------|------|----------|-------------|-------------|---------|
| `id` | String | Yes | Non-empty, Unique | Service unique identifier (UUID format for future DB) | `"srv_001"` |
| `name` | String | Yes | 1-50 characters | Service display name (Chinese/English) | `"王者荣耀陪玩"` |
| `description` | String | Yes | 1-200 characters | Detailed service description | `"专业上分，稳定不坑，段位：王者50星"` |
| `price` | Number | Yes | ≥ 0, Max 2 decimals | Service price per hour (in CNY) | `30.00` |
| `imageUrl` | String | No | Valid URL or relative path | Service cover image (absolute or relative URL) | `"/images/services/game_wzry.jpg"` |
| `category` | String | No | Max 50 characters | Service category (e.g., "游戏陪玩", "语音陪玩") | `"游戏陪玩"` |
| `status` | String | Yes | Enum: "active", "inactive" | Service availability status | `"active"` |

### Validation Rules

#### Field-Level Validation

**id**:
- Type: String
- Pattern: `^srv_\d{3}$` (for mock data) or UUID v4 (for production)
- Example: `"srv_001"`, `"srv_002"`, `"123e4567-e89b-12d3-a456-426614174000"`

**name**:
- Type: String
- Min Length: 1 character
- Max Length: 50 characters
- Allowed: Chinese, English, numbers, spaces
- Invalid: Empty string, only whitespace

**description**:
- Type: String
- Min Length: 1 character
- Max Length: 200 characters
- Allowed: Chinese, English, numbers, punctuation
- Invalid: Empty string, only whitespace

**price**:
- Type: Number (Float)
- Min Value: 0 (free services allowed)
- Max Value: 9999.99 (reasonable upper limit)
- Decimals: Maximum 2 decimal places
- Invalid: Negative numbers, NaN, Infinity

**imageUrl** (Optional):
- Type: String
- Format: Valid URL (http/https) or relative path (/images/...)
- Example: `"https://example.com/image.jpg"` or `"/images/service.jpg"`
- Default: `""` (empty string if not provided)

**category** (Optional):
- Type: String
- Max Length: 50 characters
- Example: `"游戏陪玩"`, `"语音陪玩"`, `"线下陪伴"`
- Default: `"其他"` (if not provided)

**status**:
- Type: String (Enum)
- Allowed Values: `"active"`, `"inactive"`
- Default: `"active"`
- Invalid: Any other string

#### Entity-Level Validation

1. **Unique ID**: Each service must have a unique `id` within the dataset
2. **Complete Information**: `id`, `name`, `description`, `price`, `status` must all be present
3. **Logical Consistency**: If `status` is `"inactive"`, the service should not appear in public listings (handled by API layer)

### Sample Data (3 Records)

```json
[
  {
    "id": "srv_001",
    "name": "王者荣耀陪玩",
    "description": "专业上分，稳定不坑，段位：王者50星，擅长打野和中单位置",
    "price": 30.00,
    "imageUrl": "/images/services/game_wzry.jpg",
    "category": "游戏陪玩",
    "status": "active"
  },
  {
    "id": "srv_002",
    "name": "语音聊天陪伴",
    "description": "温柔甜美，解压聊天，让你快乐每一天，支持唱歌和讲故事",
    "price": 20.00,
    "imageUrl": "/images/services/voice_chat.jpg",
    "category": "语音陪玩",
    "status": "active"
  },
  {
    "id": "srv_003",
    "name": "吃鸡陪玩",
    "description": "高胜率，枪法精准，带你轻松吃鸡，支持四排和双排模式",
    "price": 35.00,
    "imageUrl": "/images/services/game_pubg.jpg",
    "category": "游戏陪玩",
    "status": "active"
  }
]
```

### TypeScript Interface (Optional - for future TypeScript migration)

```typescript
interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
  category?: string;
  status: 'active' | 'inactive';
}

// API Response wrapper
interface ServiceListResponse {
  code: number;
  data: Service[];
  message: string;
}
```

---

## Mock Data Implementation

### File Location

```
miniapp/utils/mock.js
```

### Implementation Example

```javascript
/**
 * Mock Data Provider for Development Phase
 * This file will be replaced with real API in RM-011
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
```

---

## Future Database Schema (RM-009 Reference)

**Note**: The following is a **reference** for future backend development. This will be implemented in RM-009 (后端基础架构).

### PostgreSQL Schema

```sql
-- Services table (to be created in RM-009)
CREATE TABLE services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(50) NOT NULL,
  description VARCHAR(200) NOT NULL,
  price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
  image_url VARCHAR(255),
  category VARCHAR(50) DEFAULT '其他',
  status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMP -- Soft delete support
);

-- Index for service list queries (active services, filtered by category)
CREATE INDEX idx_services_status_category ON services(status, category) WHERE deleted_at IS NULL;

-- Index for full-text search on name and description (future feature)
CREATE INDEX idx_services_search ON services USING gin(to_tsvector('chinese', name || ' ' || description));
```

### Migration Notes (RM-009)

When migrating from Mock data to real database:

1. **ID Format Change**:
   - Mock: `"srv_001"` (simple string)
   - Database: UUID v4 (e.g., `"123e4567-e89b-12d3-a456-426614174000"`)
   - Frontend impact: None (both are strings)

2. **Timestamp Fields**:
   - Added: `created_at`, `updated_at`, `deleted_at`
   - Frontend: Can ignore or display creation date

3. **Soft Delete**:
   - Database supports soft delete (`deleted_at` field)
   - API will filter out deleted records automatically

4. **Full-Text Search**:
   - Database supports Chinese full-text search
   - API will add search endpoint (not in mock)

---

## Data Flow

### Development Phase (RM-001 to RM-010)

```
Page (onLoad)
  → request.get('/services', { useMock: true })
    → mock.getServices()
      → Returns static JSON data
    → request.js formats response
  → Page receives data
    → setData({ services: data })
      → WXML renders UI
```

### Production Phase (RM-011 onwards)

```
Page (onLoad)
  → request.get('/services', { useMock: false })
    → wx.request({ url: BASE_API_URL + '/services' })
      → HTTP GET to backend API
        → Backend queries PostgreSQL database
        → Backend formats response (same format as mock)
      → Backend returns JSON
    → request.js receives response
  → Page receives data (same format as mock)
    → setData({ services: data })
      → WXML renders UI (no changes needed)
```

**Key Insight**: Same data structure ensures **zero page code changes** when switching from mock to real API.

---

## Validation Implementation

### In utils/request.js

```javascript
/**
 * Validate service data structure
 * @param {Object} service - Service object to validate
 * @returns {Boolean} true if valid, throws Error if invalid
 */
function validateService(service) {
  // Required fields
  if (!service.id || typeof service.id !== 'string') {
    throw new Error('Service ID is required and must be a string');
  }

  if (!service.name || typeof service.name !== 'string' || service.name.length > 50) {
    throw new Error('Service name is required and must be ≤50 characters');
  }

  if (!service.description || typeof service.description !== 'string' || service.description.length > 200) {
    throw new Error('Service description is required and must be ≤200 characters');
  }

  if (typeof service.price !== 'number' || service.price < 0) {
    throw new Error('Service price is required and must be ≥0');
  }

  if (!service.status || !['active', 'inactive'].includes(service.status)) {
    throw new Error('Service status must be "active" or "inactive"');
  }

  // Optional fields
  if (service.imageUrl && typeof service.imageUrl !== 'string') {
    throw new Error('Service imageUrl must be a string');
  }

  if (service.category && typeof service.category !== 'string') {
    throw new Error('Service category must be a string');
  }

  return true;
}

module.exports = {
  validateService
};
```

---

## Testing Checklist

### Unit Tests (to be written in TASKS phase)

- [ ] Validate service object with all required fields
- [ ] Validate service object with optional fields
- [ ] Reject service with missing required fields
- [ ] Reject service with invalid field types
- [ ] Reject service with out-of-range values (e.g., negative price)
- [ ] Validate service list response format
- [ ] Validate error response format

### Integration Tests (to be written in TASKS phase)

- [ ] Mock data returns 3 services
- [ ] All services have valid structure
- [ ] getServiceById() returns correct service
- [ ] getServiceById() returns 404 for invalid ID
- [ ] simulateError() returns error response

---

**Generated by**: tech-architect agent
**Based on**: TECH_DESIGN.md Section 3
**Status**: Ready for implementation (TASKS phase)
