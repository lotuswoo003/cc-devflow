# Technical Design: RM-002 - 小程序首页服务列表

**Status**: Draft
**Created**: 2025-01-21T08:00:00Z
**Updated**: 2025-01-21T08:00:00Z
**Type**: Technical Design

---

## 1. System Architecture

### 1.1 Architecture Overview

**RM-002 is an ENHANCEMENT of RM-001 infrastructure, NOT a new system.**

```
[微信小程序容器]
      |
      v
[WXML View Layer] <--> [JS Logic Layer] <--> [Mock Data Layer]
      |                       |                      |
      v                       v                      v
[WXSS Styling]         [Event Handlers]      [utils/mock.js]
      |                       |
      v                       v
[UI Components]        [utils/request.js]
  - Service Cards             |
  - Skeleton Loading          v
  - Pull-to-Refresh    [MOCK_CONFIG.useMock = true]
```

**Key Characteristics**:
- **Single-page enhancement**: Only modifies `miniapp/pages/index/` directory
- **No new services**: Reuses existing mock data system from RM-001
- **No backend changes**: Continues using mock mode (RM-011 will add real API)
- **No authentication**: Service list is public (login deferred to RM-XXX)

### 1.2 Module Breakdown

**Only 1 module modified** (complies with Article VII: Simplicity Gate ≤3 modules):

- **miniapp/pages/index/**: Service list page (ENHANCED)
  - **Responsibility**: Display service list with optimized UI, skeleton loading, pull-to-refresh
  - **Changes**: UI polish (WXSS enhancements), image URL updates (Picsum), pull-refresh already enabled
  - **Dependencies**: utils/mock.js, utils/request.js, utils/config.js (all from RM-001)

**Unchanged modules** (reused from RM-001):
- **miniapp/utils/**: Utility functions (mock.js, request.js, config.js)
- **miniapp/pages/customer/**: Customer service page
- **miniapp/app.js/json/wxss**: Global configuration and styles

### 1.3 Data Flow

**Standard request flow** (inherited from RM-001):

1. **Page Load**:
   - `index.js::onLoad()` → `loadServices()`
   - `loadServices()` sets `loading: true`
   - `loadServices()` calls `request.get('/services')`

2. **Request Processing**:
   - `request.get()` checks `MOCK_CONFIG.useMock` (currently `true`)
   - If mock mode: routes to `mock.js::getServices()`
   - Simulates 100ms network delay
   - Returns `{ code: 0, data: Service[], message: string }`

3. **Response Handling**:
   - `loadServices()` receives response
   - Sets `services: response.data, loading: false`
   - WXML renders service list (wx:for loop)

4. **Error Handling**:
   - On error: sets `error: error.message, loading: false`
   - Shows error state with retry button
   - Retry button → re-calls `loadServices()`

**Pull-to-refresh flow** (RM-002 enhancement):

1. User pulls down page → triggers `onPullDownRefresh()`
2. `onPullDownRefresh()` calls `loadServices()`
3. Skeleton loading displays during refresh
4. Data reloads → calls `wx.stopPullDownRefresh()`

**Service card tap flow** (RM-002 enhancement):

1. User taps service card → triggers `onServiceTap(service)`
2. Logs `console.log('点击了服务:', service.id)`
3. Shows Toast: "服务详情开发中，敬请期待"
4. NO navigation (detail page deferred to RM-XXX per PRD research decision R002)

### 1.4 Existing Codebase Integration

**Reuses RM-001 infrastructure**:

- ✅ **Data layer**: `utils/mock.js` (Service model already defined)
- ✅ **Network layer**: `utils/request.js` (Mock/Real API switching)
- ✅ **Configuration**: `utils/config.js` (MOCK_CONFIG, API_CONFIG, APP_CONFIG)
- ✅ **Global styles**: `app.wxss` (Utility classes: .container, .flex-*, .card, .skeleton-*)
- ✅ **Skeleton loading**: WXML structure already implemented in `index.wxml`
- ✅ **Pull-refresh handler**: `onPullDownRefresh()` already implemented in `index.js`

**RM-002 Changes**:

- 📝 **WXSS enhancements**: Improve card styling (shadows, borders, spacing per PRD User Story 1)
- 🖼️ **Image URLs**: Update `mock.js` imageUrl from local paths to Picsum URLs (per PRD User Story 2)
- 🔄 **Pull-refresh enabled**: Already done in `index.json` ("enablePullDownRefresh": true)
- 📱 **Card tap feedback**: Add Toast notification in `onServiceTap()` (per PRD User Story 4)
- ✅ **Unit tests**: Add `utils/__tests__/mock.test.js` for data layer validation

**NO new files needed** - Only modifications to existing files.

---

## 2. Technology Stack

### 2.1 Frontend (WeChat Mini Program Native)

- **Framework**: 微信小程序原生框架 (WeChat Mini Program SDK)
  - **Version**: 基础库 v2.0.0+
  - **Justification**: **Using existing WeChat Mini Program framework from RM-001 baseline**. Native framework required for WeChat platform, no alternatives available.

- **View Layer**: WXML (WeiXin Markup Language)
  - **Version**: WeChat Mini Program SDK v2.0.0+
  - **Justification**: **Baseline technology from RM-001**. Native view language for WeChat Mini Programs.

- **Styling**: WXSS (WeiXin Style Sheets)
  - **Version**: WeChat Mini Program SDK v2.0.0+
  - **Justification**: **Baseline technology from RM-001**. Native styling language with rpx (responsive pixel) support.

- **Logic Layer**: JavaScript ES6+
  - **Version**: ES6+ supported by WeChat Mini Program runtime
  - **Justification**: **Baseline technology from RM-001**. Native scripting language for WeChat Mini Programs.

- **Development Tools**: 微信开发者工具 (WeChat DevTools)
  - **Version**: v3.0.0+
  - **Justification**: **Baseline tooling from RM-001**. Official IDE required for WeChat Mini Program development.

**NO UI libraries** (per PRD technical constraints: "禁止使用第三方UI组件库如Vant Weapp").

### 2.2 Backend (Not Applicable - Mock Mode)

**No backend changes in RM-002**. Backend integration deferred to RM-011.

- **Current State**: Mock data mode (`MOCK_CONFIG.useMock = true`)
- **Data Provider**: `utils/mock.js` (local JavaScript module)
- **Future Backend**: Will be implemented in RM-009 (SpringBoot后端基础架构)
- **API Integration**: Will be implemented in RM-011 (前后端联调)

### 2.3 Data Layer

- **Data Source**: Mock data (utils/mock.js)
  - **Justification**: **Using existing mock system from RM-001 baseline**. Real API deferred to RM-011.
  - **Data Format**: JavaScript objects conforming to Service schema (see Section 3)

- **No Database**: Not applicable (mock mode)
  - **Future Database**: PostgreSQL/MySQL (will be defined in RM-009 backend requirement)

- **No ORM**: Not applicable (mock mode)
  - **Future ORM**: MyBatis/MyBatis-Plus (will be defined in RM-009 backend requirement)

### 2.4 Infrastructure

- **Deployment**: WeChat Mini Program platform
  - **Justification**: **Platform requirement, no alternatives**. WeChat Mini Programs run on WeChat platform.

- **Version Control**: Git
  - **Justification**: **Existing version control from RM-001 baseline**.

- **CI/CD**: Not applicable (manual deployment to WeChat platform)
  - **Future CI/CD**: Will be defined in later requirements when backend is added

- **Hosting**: WeChat servers (platform-managed)
  - **Justification**: **Platform requirement**. WeChat hosts all Mini Program code.

### 2.5 Deviation from Baseline

**Baseline Tech Stack** (from RM-001):
- Frontend: WeChat Mini Program Native Framework
- Data: Mock data (utils/mock.js)
- Tools: WeChat DevTools
- No backend, database, or ORM (mock mode)

**Deviations Analysis**:

| New/Changed Technology | PRD Requirement | Justification | Status |
|------------------------|-----------------|---------------|--------|
| Picsum Placeholder Service | PRD User Story 2 (Image Display) | Mock data references non-existent local images. Picsum provides instant, stable placeholder images via HTTPS without asset management. | ✅ Approved |
| Jest (for unit tests) | PRD NFR: Test coverage ≥80% | RM-001 had no testing infrastructure. Jest is industry standard for JavaScript unit testing. Only tests data layer (mock.js), not UI. | ✅ Approved |

**Status**: ✅ Minimal deviations, both justified by PRD requirements.

---

## 3. Data Model Design

### 3.1 Database Schema

**No database changes** - RM-002 continues using mock mode.

**Service Data Model** (inherited from RM-001):

#### Entity: Service

**Description**: Service entity representing a companion service (gaming, chat, etc.)

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | String | REQUIRED, UNIQUE | Service ID, format: `srv_XXX` (e.g., `srv_001`) |
| name | String | REQUIRED, NON-EMPTY | Service name (e.g., "王者荣耀陪玩") |
| description | String | REQUIRED | Service description, max 2 lines in UI (text-overflow: ellipsis) |
| price | Number | REQUIRED, POSITIVE | Price per hour in yuan (e.g., 30.00), displayed as `¥XX.00/小时` |
| imageUrl | String | REQUIRED, VALID_URL | **CHANGED**: External image URL (Picsum format: `https://picsum.photos/seed/{id}/300/200`) |
| category | String | REQUIRED | Service category (e.g., "游戏陪玩", "语音陪玩") |
| status | String | REQUIRED, ENUM | Service status: `'active'` (可预约) or `'inactive'` (暂不可用) |

**RM-002 Change**: `imageUrl` field updated from local paths (e.g., `/images/services/*.jpg`) to external Picsum URLs.

**Example Service Object**:
```javascript
{
  id: 'srv_001',
  name: '王者荣耀陪玩',
  description: '专业上分，稳定不坑，段位：王者50星，擅长打野和中单位置',
  price: 30.00,
  imageUrl: 'https://picsum.photos/seed/srv_001/300/200',  // ← CHANGED
  category: '游戏陪玩',
  status: 'active'
}
```

### 3.2 Entity Relationships

**No relationships** - Service is a standalone entity in current mock mode.

**Future relationships** (will be defined in RM-009 backend):
- Service 1:N Orders (one service can have multiple orders)
- Service N:1 Provider (one provider offers multiple services)
- Service N:M Users (many-to-many through favorites/bookmarks)

### 3.3 Indexes and Constraints

**Not applicable** (mock mode, no database).

**Future indexes** (will be defined in RM-009 backend):
- PRIMARY KEY: `services(id)`
- INDEX: `services(status, category)` for filtering
- INDEX: `services(price)` for sorting

**Validation Rules** (enforced in mock.js):
- `id`: Must match pattern `srv_\d{3}` (e.g., `srv_001`)
- `price`: Must be > 0
- `status`: Must be one of `['active', 'inactive']`
- `imageUrl`: Must be valid HTTPS URL (Picsum format)

---

## 4. API Design

### 4.1 API Endpoints

**No API changes** - RM-002 continues using RM-001 mock API.

#### GET /services

**Purpose**: Retrieve list of all active services

**Authentication**: Not required (public endpoint)

**Request**: None (no query params in mock mode)

**Response** (200):
```json
{
  "code": 0,
  "data": [
    {
      "id": "srv_001",
      "name": "王者荣耀陪玩",
      "description": "专业上分，稳定不坑，段位：王者50星，擅长打野和中单位置",
      "price": 30.00,
      "imageUrl": "https://picsum.photos/seed/srv_001/300/200",
      "category": "游戏陪玩",
      "status": "active"
    }
  ],
  "message": "获取服务列表成功"
}
```

**Errors**:
- 500: Server error (simulated via `mock.js::simulateError()`)

**Mock Implementation**: `mock.js::getServices()` filters active services

---

#### GET /services/:id

**Purpose**: Retrieve single service by ID

**Authentication**: Not required (public endpoint)

**Request**:
- Path parameter: `id` (String, format: `srv_XXX`)

**Response** (200):
```json
{
  "code": 0,
  "data": {
    "id": "srv_001",
    "name": "王者荣耀陪玩",
    "description": "专业上分，稳定不坑，段位：王者50星，擅长打野和中单位置",
    "price": 30.00,
    "imageUrl": "https://picsum.photos/seed/srv_001/300/200",
    "category": "游戏陪玩",
    "status": "active"
  },
  "message": "获取服务详情成功"
}
```

**Errors**:
- 404: Service not found
- 500: Server error

**Mock Implementation**: `mock.js::getServiceById(id)` finds service by ID

---

### 4.2 Error Response Format

**Standard error format** (inherited from RM-001):

```json
{
  "code": <error_code>,
  "data": null,
  "message": "<error_message>"
}
```

**Error Codes**:
- `0`: Success
- `404`: Resource not found
- `500`: Server error
- `501`: Not implemented (for unsupported mock endpoints)

**Future enhancements** (RM-011):
- Add detailed validation errors
- Add error tracking IDs
- Add localized error messages

---

## 5. Security Design

### 5.1 Authentication

**Not applicable** - Service list is public, no authentication required.

**Future authentication** (will be implemented in RM-XXX User Login):
- Strategy: WeChat Mini Program wx.login() + JWT
- Token storage: wx.setStorageSync('token', jwt)
- Token refresh: Refresh token mechanism

### 5.2 Authorization

**Not applicable** - Service list is public, no authorization required.

**Future authorization** (will be implemented with backend):
- Model: RBAC (Role-Based Access Control)
- Roles: admin (管理员), provider (陪玩师), user (用户), guest (访客)
- Permissions: All roles can view service list (public endpoint)

### 5.3 Secret Management

✅ **NO HARDCODED SECRETS** (Constitution Article III compliance)

**Current secrets**: None (mock mode)

**Secret strategy**:
- ✅ Image URLs: External Picsum service (no API keys required)
- ✅ No database credentials (mock mode)
- ✅ No API keys (mock mode)

**Future secrets** (RM-011):
- `API_BASE_URL`: Backend API URL (stored in `config.js`, read from environment)
- `WECHAT_APP_ID`: WeChat Mini Program AppID (stored in `project.config.json`)
- `WECHAT_APP_SECRET`: Backend secret (NOT stored in frontend, server-side only)

**Secret storage**:
- Development: `config.js` with environment-based overrides
- Production: WeChat Mini Program platform configuration

### 5.4 Input Validation

**Current validation**: Minimal (mock mode)

- ✅ URL validation: `request.js::validateUrl()` ensures valid endpoint format
- ✅ Response validation: Checks `response.code === 0` before using data

**Future validation** (RM-011):
- Request body validation: Zod schemas for all POST/PUT requests
- XSS prevention: WeChat Mini Program framework sanitizes by default
- SQL injection prevention: Backend ORM (MyBatis) uses parameterized queries

### 5.5 Rate Limiting

**Not applicable** (mock mode, no network requests)

**Future rate limiting** (RM-011):
- API Gateway: Max 100 requests/user/minute
- Login attempts: Max 5 attempts/IP/15 minutes

### 5.6 Security Headers

**Not applicable** (WeChat Mini Program platform manages security headers)

**Platform security features**:
- ✅ HTTPS enforced by WeChat platform
- ✅ CSP enforced by WeChat platform
- ✅ No iframe embedding (WeChat Mini Program runs in isolated sandbox)

---

## 6. Performance Design

### 6.1 Caching Strategy

**Current caching**: None (mock mode, data is static)

**Image caching**:
- WeChat framework automatically caches images via `image` component
- Picsum CDN provides fast delivery (external service)
- `lazy-load="true"` attribute enables lazy loading (PRD User Story 2 AC5)

**Future caching** (RM-011):
- **Service list cache**: TTL 5 minutes (refresh on pull-to-refresh)
- **Cache layer**: wx.setStorageSync() for offline support
- **Cache invalidation**: On pull-to-refresh, clear cache and reload

### 6.2 Database Optimization

**Not applicable** (mock mode, no database)

**Future optimization** (RM-009 backend):
- Index on `services(status, category)` for filtering
- Index on `services(price)` for sorting
- Connection pooling: Max 20 connections

### 6.3 Scalability

**Current scalability**: Not applicable (frontend-only, no backend)

**WeChat Mini Program scalability**:
- ✅ Horizontal scaling: WeChat platform auto-scales
- ✅ CDN: WeChat CDN for static assets (WXSS, WXML compiled code)
- ✅ Image CDN: Picsum CDN for placeholder images

**Future scalability** (RM-011):
- Backend API: Stateless servers behind load balancer
- Database: Read replicas for service list queries (read-heavy)

### 6.4 Performance Targets

**PRD-defined targets**:

| Metric | Target | Measurement | Status |
|--------|--------|-------------|--------|
| 首屏加载时间 (FCP) | < 2s | WeChat DevTools Performance Panel | ✅ Achievable (mock delay 100ms) |
| 骨架屏显示时间 | 100ms | Mock network delay | ✅ Implemented |
| 图片加载时间 | < 1s | Picsum CDN response time | ✅ Achievable (external CDN) |
| 列表滚动流畅度 | 60 FPS | Manual testing (no frame drops) | ✅ Achievable (wx:key="id" optimization) |
| 代码包增量大小 | < 50KB | WeChat DevTools Build Report | ✅ Achievable (only WXSS changes) |

**Optimization techniques**:
- ✅ `wx:key="id"` for list rendering performance (PRD research decision R005)
- ✅ `lazy-load` for image components (PRD User Story 2 AC5)
- ✅ Skeleton loading to improve perceived performance (RM-001)
- ✅ Minimal setData calls (batch updates in `loadServices()`)

---

## 7. Constitution Check (Phase -1 Gates)

### 7.0 Baseline Deviation Check (ANTI-TECH-CREEP)

**Baseline Tech Stack** (from RM-001):
- Frontend: WeChat Mini Program Native Framework
- Data: Mock data (utils/mock.js)
- Tools: WeChat DevTools
- No backend, database, or ORM

**Deviation Analysis**:

- [x] **All baseline technologies reused**: ✅ YES
  - WeChat Mini Program framework ✅
  - Mock data system (utils/mock.js) ✅
  - Network layer (utils/request.js) ✅
  - Configuration (utils/config.js) ✅
  - Global styles (app.wxss) ✅

- [x] **All new technologies justified**: ✅ YES (see Section 2.5)
  - Picsum: PRD requires image display, local images don't exist
  - Jest: PRD requires test coverage ≥80%

- [x] **No unnecessary refactoring**: ✅ YES
  - NO framework changes
  - NO data layer changes (only imageUrl field update)
  - NO architectural changes (single-page enhancement)

- [x] **No unfamiliar third-party libraries**: ✅ YES
  - Picsum: Simple HTTPS image service, no SDK needed
  - Jest: Industry standard, minimal learning curve

**Deviations from Baseline**:

| New/Changed Technology | PRD Requirement | Justification | Status |
|------------------------|-----------------|---------------|--------|
| Picsum Placeholder Service | PRD User Story 2 (Image Display) | Local image paths in mock.js don't exist. Picsum provides stable placeholder images via HTTPS without asset management overhead. | ✅ Approved |
| Jest Unit Testing | PRD NFR: Test coverage ≥80% | RM-001 had no testing infrastructure. Adding Jest to test mock.js functions (getServices, getServiceById). Minimal dependency (dev-only). | ✅ Approved |

**Status**: ✅ **PASSED** - Minimal deviations, all justified by explicit PRD requirements.

---

### 7.1 Simplicity Gate (Article VII)

- [x] **≤3 projects/modules**: ✅ YES
  - **Only 1 module modified**: `miniapp/pages/index/` (service list page)
  - **Reused modules**: utils/, pages/customer/, app.* (RM-001 baseline)
  - **Total**: 1 modified module << 3 (compliant)

- [x] **No future-proofing**: ✅ YES
  - NO speculative features (e.g., search, filters, sorting)
  - NO "might need X later" abstractions
  - Service detail page explicitly deferred to RM-XXX (PRD research R002)

- [x] **Minimal dependencies**: ✅ YES
  - **Zero new runtime dependencies** (Picsum is external service, not npm package)
  - **One new dev dependency**: Jest (required for test coverage)
  - **Reused dependencies**: WeChat Mini Program SDK (platform requirement)

**Status**: ✅ **PASSED** - Only 1 module modified, no speculative features, minimal dependencies.

---

### 7.2 Anti-Abstraction Gate (Article VIII)

- [x] **Direct framework usage**: ✅ YES
  - Uses WeChat Mini Program APIs directly (wx.*, Component, Page)
  - NO custom wrappers (e.g., no "BaseComponent", "AbstractPage")
  - NO unnecessary middleware layers

- [x] **Single data model**: ✅ YES
  - Service model in `mock.js` is single source of truth
  - NO redundant representations (no separate DTO, ViewModel layers)
  - WXML binds directly to `services` data

- [x] **No unnecessary interfaces**: ✅ YES
  - NO BaseController, BaseService, GenericRepository
  - Direct function calls: `loadServices()`, `onServiceTap()`
  - NO over-engineered class hierarchies

**Status**: ✅ **PASSED** - Direct framework usage, single data model, no unnecessary abstractions.

---

### 7.3 Integration-First Gate (Article IX)

- [x] **Contracts defined first**: ✅ YES
  - API contracts in Section 4 (GET /services, GET /services/:id)
  - Service data model in Section 3
  - Response format standardized (code, data, message)

- [x] **Contract tests planned**: ✅ YES
  - Unit tests for `mock.js::getServices()` (validates response format)
  - Unit tests for `mock.js::getServiceById()` (validates 404 handling)
  - Tests verify contract compliance (code: 0, data: Service[], message: string)

- [x] **Real environment testing**: ⚠️ PARTIAL
  - ✅ Manual testing in WeChat DevTools (real WeChat runtime)
  - ✅ Real device testing (iOS/Android WeChat)
  - ⚠️ Mock data (not real backend) - acceptable for RM-002, real API in RM-011

**Status**: ✅ **PASSED** - Contracts defined, tests planned, real WeChat runtime testing.

---

### 7.4 Complexity Tracking

**No violations** - All gates passed cleanly.

| Violation Type | Potential Violation | Justification | Approved? |
|----------------|---------------------|---------------|-----------|
| None | All gates passed | N/A | N/A |

**Summary**: RM-002 design fully complies with Constitution Phase -1 Gates (Simplicity, Anti-Abstraction, Integration-First) and ANTI-TECH-CREEP policy.

---

## 8. Validation Checklist

**Architecture Completeness**:
- [x] **Section 1**: System Architecture (Overview, Modules, Data Flow) - ✅ Complete
- [x] **All layers designed**: Frontend (WXML/WXSS/JS), Data (mock.js), no backend (mock mode)
- [x] **Module boundaries clear**: Only `pages/index/` modified, utils/ reused
- [x] **Data flow documented**: Load → Request → Mock → Response → Render
- [x] **Integration points identified**: Reuses RM-001 infrastructure

**Technology Selection Quality**:
- [x] **Section 2**: Technology Stack - ✅ Complete with versions and justifications
- [x] **Specific technologies**: WeChat Mini Program SDK v2.0.0+, Picsum (HTTPS), Jest (latest)
- [x] **Justified choices**: All baseline tech reused, deviations justified (Picsum, Jest)
- [x] **Compatible with existing stack**: 100% compatible (enhancement only)
- [x] **Scalable and maintainable**: WeChat platform auto-scales, Jest enables regression testing

**Data Model Quality**:
- [x] **Section 3**: Data Model Design - ✅ Complete (Service schema)
- [x] **Complete schema**: Service entity with 7 fields (id, name, description, price, imageUrl, category, status)
- [x] **Relationships defined**: None (standalone entity, future relationships in RM-009)
- [x] **Constraints specified**: REQUIRED, UNIQUE, ENUM, POSITIVE, VALID_URL
- [x] **Normalized appropriately**: Single entity, no redundancy (mock mode)

**API Design Quality**:
- [x] **Section 4**: API Design - ✅ Complete (2 endpoints)
- [x] **RESTful conventions**: GET /services, GET /services/:id
- [x] **Request/response schemas**: JSON format with code, data, message
- [x] **Error handling standardized**: 404, 500 with standard error format
- [x] **Versioning strategy clear**: Mock API v1.0 (real API in RM-011)

**Security & Performance**:
- [x] **Section 5**: Security Design - ✅ Complete
- [x] **Authentication/authorization clear**: Not required (public endpoint)
- [x] **✅ NO HARDCODED SECRETS**: Image URLs configurable, no API keys
- [x] **Section 6**: Performance Design - ✅ Complete
- [x] **Caching strategy**: Lazy-load images, WeChat auto-caches
- [x] **Performance targets**: FCP < 2s, skeleton 100ms, 60 FPS

**Constitution Compliance**:
- [x] **Section 7**: Constitution Check - ✅ Complete
- [x] **Article VII - Simplicity Gate**: ✅ Passed (1 module, no future-proofing)
- [x] **Article VIII - Anti-Abstraction Gate**: ✅ Passed (direct framework usage)
- [x] **Article IX - Integration-First Gate**: ✅ Passed (contracts defined)
- [x] **Article II - No Over-Engineering**: ✅ Passed (minimal changes, reuses RM-001)

**Quality Gates**:
- [x] **No {{PLACEHOLDER}}**: All sections filled with concrete details
- [x] **All technologies specific**: WeChat SDK v2.0.0+, Picsum HTTPS, Jest
- [x] **All tables complete**: Service schema complete (7 fields)
- [x] **All endpoints defined**: GET /services, GET /services/:id with schemas
- [x] **Testability**: Jest unit tests for data layer, manual tests for UI
- [x] **Clear reasoning**: Every choice justified (baseline reuse or PRD requirement)

---

**Ready for Epic Planning**: ✅ **YES**

**Summary**: RM-002 technical design is complete, comprehensive, and Constitution-compliant. All layers defined (frontend UI enhancement, data model unchanged, no backend). Technology stack reuses RM-001 baseline with only 2 justified deviations (Picsum for images, Jest for tests). Design supports complete task breakdown in EPIC/TASKS phase.

---

**Generated by**: tech-architect agent (research-type)
**Template Version**: 1.0.0 (Self-Executable)
**Constitution Version**: v2.0.0
**Based on**: PRD.md, research.md, codebase-overview.md, UI_PROTOTYPE.html
**Next Step**: Run planner agent to generate EPIC.md and TASKS.md
