# Codebase Overview - RM-002: 小程序首页服务列表

**Generated**: 2025-11-21 15:30:00
**Requirement**: RM-002 - 小程序首页服务列表
**Base Project**: RM-001 (小程序项目初始化) - 已完成 ✅

---

## 1. Project Type & Tech Stack

### Project Type
**微信小程序项目** - C端用户展示平台

### Tech Stack
- **Framework**: 微信小程序原生框架
- **Languages**: JavaScript (ES6+), WXML, WXSS
- **Development Tools**: 微信开发者工具
- **Project Structure**: 标准小程序四文件结构 (js, json, wxml, wxss)

### Configuration Files
- `app.json`: 小程序全局配置
- `project.config.json`: 项目配置（AppID: touristappid）
- `sitemap.json`: 索引配置

---

## 2. Existing Code Structure

### 2.1 Core Modules

#### Application Entry (app.js)
```javascript
Location: miniapp/app.js
Responsibilities:
  - Application lifecycle management (onLaunch, onShow, onHide)
  - Update检测和自动更新
  - Global data storage (userInfo, systemInfo)
```

**Key Features**:
- ✅ Update manager configured
- ✅ Debug mode support (APP_CONFIG.debug)
- ✅ Global data: `globalData.userInfo`, `globalData.systemInfo`

#### Global Styles (app.wxss)
```wxss
Location: miniapp/app.wxss
Responsibilities:
  - CSS variables for theming
  - Utility classes (flexbox, spacing, text)
  - Common component styles (card, button)
```

**Available Utility Classes**:
- `.container`, `.flex-row`, `.flex-column`, `.flex-between`
- `.text-primary`, `.text-secondary`, `.text-muted`
- `.mt-*`, `.mb-*`, `.mr-*`, `.ml-*` (spacing: 10/20/30/40)
- `.card`, `.btn-primary`, `.btn-secondary`

---

### 2.2 Existing Pages

#### Page 1: index (Service List)
```
Location: miniapp/pages/index/
Status: ✅ Basic structure exists
Current Implementation:
  - Service list display with skeleton loading
  - Mock data integration via request.js
  - Customer service button navigation
  - Pull-down refresh support
```

**Page Features**:
- Loading state with skeleton screens (US-001 from RM-001)
- Error handling and retry
- Service card UI (image, name, description, price, status)
- Empty state handling

**Entry Point**: `pages/index/index.js`
- Data: `services`, `loading`, `error`
- Methods: `loadServices()`, `onServiceTap()`, `onCustomerTap()`, `onPullDownRefresh()`

#### Page 2: customer (Customer Service)
```
Location: miniapp/pages/customer/
Status: ✅ Completed in RM-001
Current Implementation:
  - Service hours display
  - Phone call button (wx.makePhoneCall)
  - WeChat ID copy功能 (wx.setClipboardData)
  - Back to home navigation
```

---

### 2.3 Utility Modules

#### 📦 Module: config.js
```
Location: miniapp/utils/config.js
Responsibilities: Application configuration管理
```

**Configuration Objects**:
1. **API_CONFIG**
   - `baseUrl`: API base URL (currently empty for mock mode)
   - `timeout`: 10000ms
   - `version`: 'v1'

2. **MOCK_CONFIG**
   - `useMock`: true (development mode)
   - `mockDelay`: 100ms (simulate network latency)

3. **APP_CONFIG**
   - `name`: '陪玩服务平台'
   - `version`: '1.0.0'
   - `debug`: true

**Recent Fix** (2025-11-21):
- ✅ Removed `process.env` usage (not supported in WeChat Mini Program)
- ✅ Changed `baseUrl: process.env.API_BASE_URL || ''` → `baseUrl: ''`

---

#### 📦 Module: mock.js
```
Location: miniapp/utils/mock.js
Responsibilities: Mock data provider for development
```

**Mock Data Structure**:
```javascript
MOCK_SERVICES = [
  {
    id: 'srv_001',
    name: '王者荣耀陪玩',
    description: '专业上分，稳定不坑，段位：王者50星...',
    price: 30.00,
    imageUrl: '/images/services/game_wzry.jpg',
    category: '游戏陪玩',
    status: 'active'
  },
  // ... 3 services total
]
```

**Available Functions**:
- `getServices()`: 返回所有active服务
- `getServiceById(id)`: 按ID查询单个服务
- `simulateError()`: 模拟500错误响应

**Response Format**:
```javascript
{
  code: 0,           // 0=success, other=error
  data: <data>,      // Service object or array
  message: '成功消息'
}
```

---

#### 📦 Module: request.js
```
Location: miniapp/utils/request.js
Responsibilities: Network request wrapper with Mock/Real API switching
```

**Key Features**:
- ✅ Mock mode support (controlled by `MOCK_CONFIG.useMock`)
- ✅ Real API mode (wx.request wrapper)
- ✅ Request URL validation
- ✅ Options validation
- ✅ Error handling
- ✅ Timeout configuration
- ✅ Mock network delay simulation

**Available Methods**:
1. **get(url, options)**
   - Supported URLs (mock mode):
     - `/services` → getServices()
     - `/services/:id` → getServiceById(id)
   - Returns: Promise<Response>

2. **post(url, data, options)**
   - Currently not implemented in mock mode
   - Returns: 501 error in mock mode

**Usage Example** (from index.js):
```javascript
const request = require('../../utils/request');

request.get('/services')
  .then(response => {
    // response.data = services array
  })
  .catch(error => {
    // error.message
  });
```

---

## 3. Reusable Components & Patterns

### 3.1 UI Patterns

#### Pattern: Skeleton Loading
```wxml
Location: pages/index/index.wxml (lines 17-27)
Implementation:
  - Display skeleton cards during loading
  - 3 skeleton items (wx:for="{{[1,2,3]}}")
  - Skeleton components: .skeleton-image, .skeleton-content, .skeleton-title, .skeleton-desc, .skeleton-price
```

**CSS Classes** (from app.wxss):
- `.skeleton-item`, `.skeleton-image`, `.skeleton-content`
- `.skeleton-title`, `.skeleton-desc`, `.skeleton-price`

#### Pattern: Error State
```wxml
Location: pages/index/index.wxml (lines 30-33)
Implementation:
  - Display error message
  - Retry button
```

#### Pattern: Empty State
```wxml
Location: pages/index/index.wxml (lines 70-72)
Implementation:
  - Display when services.length === 0
```

#### Pattern: Service Card
```wxml
Location: pages/index/index.wxml (lines 37-67)
Components:
  - .service-image (with lazy-load)
  - .service-info
    - .service-header (.service-name, .service-category)
    - .service-description
    - .service-footer (.service-price, .service-status)
```

---

### 3.2 Utility Functions

#### Function: loadServices()
```javascript
Location: pages/index/index.js (lines 30-62)
Purpose: Load service list from API or mock
Pattern:
  1. Set loading state
  2. Call request.get('/services')
  3. Update data on success
  4. Show error toast on failure
```

**Reusable Pattern**:
```javascript
loadData: function() {
  this.setData({ loading: true, error: null });

  request.get('/endpoint')
    .then(response => {
      this.setData({ data: response.data, loading: false });
    })
    .catch(error => {
      this.setData({ error: error.message, loading: false });
      wx.showToast({ title: error.message, icon: 'none' });
    });
}
```

---

## 4. Related Files for RM-002

### 4.1 Files to Modify

#### ✏️ miniapp/pages/index/index.wxml
**Current Status**: Basic structure exists
**Required Changes** for RM-002:
- ✅ Already has service list rendering
- ✅ Already has skeleton loading
- ⚠️ May need image URL adjustments (currently expects `/images/services/...`)
- ⚠️ May need price formatting improvements

#### ✏️ miniapp/pages/index/index.wxss
**Current Status**: Basic styles exist
**Required Changes** for RM-002:
- ✅ Already has .service-list, .service-item styles
- ⚠️ May need visual enhancements (shadows, borders, colors)
- ⚠️ May need responsive improvements

#### ✏️ miniapp/pages/index/index.js
**Current Status**: Fully functional with mock data
**Required Changes** for RM-002:
- ✅ Already implements loadServices()
- ✅ Already has error handling
- ⚠️ onServiceTap() only logs (detail page not implemented yet - RM-002 scope?)
- ⚠️ May need pull-down refresh enablement in page.json

---

### 4.2 Files to Reference (No Changes Needed)

#### 📖 miniapp/utils/config.js
**Use For**: Configuration constants
**DO NOT MODIFY**: Configuration is stable

#### 📖 miniapp/utils/request.js
**Use For**: Network requests
**DO NOT MODIFY**: Request utility is complete and tested

#### 📖 miniapp/utils/mock.js
**Use For**: Mock data source
**MODIFY IF**: Need to add/modify mock service data

#### 📖 miniapp/app.wxss
**Use For**: Global utility classes
**DO NOT MODIFY**: Global styles are stable

---

## 5. Testing Coverage

### 5.1 Existing Test Patterns

**Location**: No test files found yet
**Status**: ⚠️ Testing infrastructure pending

**Recommended Test Files for RM-002**:
- `miniapp/utils/__tests__/mock.test.js` (unit tests for mock.js)
- `miniapp/utils/__tests__/request.test.js` (unit tests for request.js)
- `miniapp/pages/index/__tests__/index.test.js` (component tests)

---

## 6. API Contracts & Data Models

### 6.1 Service Data Model

**Source**: miniapp/utils/mock.js (lines 11-39)

```javascript
{
  id: String,           // Format: 'srv_XXX'
  name: String,         // Service name
  description: String,  // Service description
  price: Number,        // Price per hour (yuan)
  imageUrl: String,     // Image path (relative or absolute)
  category: String,     // Category name
  status: String        // 'active' | 'inactive'
}
```

**Validation Rules** (inferred):
- `id`: Required, unique
- `name`: Required, non-empty
- `price`: Required, positive number
- `status`: Required, enum ['active', 'inactive']

---

### 6.2 API Response Format

**Source**: miniapp/utils/mock.js (lines 45-50)

```javascript
{
  code: Number,      // 0=success, other=error
  data: Any,         // Response payload
  message: String    // Result message
}
```

**Error Codes**:
- `0`: Success
- `404`: Resource not found
- `500`: Server error
- `501`: Not implemented

---

## 7. Development Workflow

### 7.1 Current Workflow (RM-001 Established)

1. **开发模式**: Mock数据 (`MOCK_CONFIG.useMock = true`)
2. **页面结构**: 四文件结构 (js, json, wxml, wxss)
3. **路由配置**: app.json pages array
4. **全局样式**: app.wxss utility classes
5. **网络请求**: utils/request.js wrapper
6. **数据模拟**: utils/mock.js provider

### 7.2 Recommended Workflow for RM-002

1. **Phase 1: Data Preparation**
   - Review and update mock.js data (if needed)
   - Ensure 3+ services with complete fields

2. **Phase 2: UI Enhancement**
   - Enhance service card UI (index.wxml)
   - Improve styling (index.wxss)
   - Add animations/transitions

3. **Phase 3: Functionality**
   - Implement onServiceTap() navigation (if detail page is in scope)
   - Test pull-down refresh
   - Test error states

4. **Phase 4: Testing**
   - Write unit tests for data layer
   - Manual testing in WeChat DevTools
   - Test on real device

---

## 8. Potential Extension Points

### 8.1 For RM-002 Scope

1. **Service Detail Page** (if required)
   - Create `pages/detail/detail.*`
   - Implement `onServiceTap()` navigation
   - Add service detail UI

2. **Service Filtering/Sorting** (if required)
   - Add category filter dropdown
   - Add price sorting buttons
   - Update loadServices() logic

3. **Image Handling**
   - Add placeholder images
   - Implement lazy loading (already has lazy-load attribute)
   - Add image error handling

### 8.2 For Future Requirements

1. **Search Functionality** (RM-XXX)
   - Add search bar component
   - Implement search API

2. **User Authentication** (RM-XXX)
   - Add wx.getUserProfile()
   - Implement login flow

3. **Real API Integration** (RM-011)
   - Change `MOCK_CONFIG.useMock = false`
   - Configure `API_CONFIG.baseUrl`
   - Test real API endpoints

---

## 9. Key Findings & Recommendations

### ✅ Strengths

1. **Well-structured codebase**
   - Clear separation of concerns (pages, utils)
   - Reusable utility classes (app.wxss)
   - Consistent naming conventions

2. **Mock-first development**
   - Mock/Real API switching is seamless
   - Network delay simulation for realistic testing
   - Complete mock data provider

3. **Error handling**
   - Request validation (validateUrl, validateOptions)
   - Error state UI (error message + retry)
   - Toast notifications for user feedback

4. **UI patterns established**
   - Skeleton loading for better UX
   - Empty state handling
   - Consistent card-based layout

### ⚠️ Areas for Attention

1. **Image Assets Missing**
   - Mock data references `/images/services/*.jpg`
   - Need to provide placeholder images or update imageUrl paths

2. **Service Detail Navigation**
   - `onServiceTap()` currently only logs
   - Decision needed: Implement detail page in RM-002 or later?

3. **Testing Infrastructure**
   - No test files found
   - Should establish testing pattern for RM-002

4. **Pull-down Refresh Configuration**
   - `onPullDownRefresh()` implemented in index.js
   - Need to enable in index.json: `"enablePullDownRefresh": true`

---

## 10. Summary

**Project Maturity**: 🟢 Good Foundation (RM-001 Complete)

**Ready for RM-002**: ✅ YES
- Page structure exists
- Data layer complete
- UI patterns established
- Only需要增强现有UI和功能细节

**Estimated Effort**: ⏱️ Medium
- UI enhancement: 40%
- Image handling: 20%
- Testing: 30%
- Documentation: 10%

**Recommended Next Steps**:
1. Define RM-002 PRD (exact UI requirements)
2. Review mock data (ensure 3+ services)
3. Clarify image asset strategy
4. Decide on service detail page scope
5. Establish testing pattern

---

**Document Status**: ✅ Complete
**Last Updated**: 2025-11-21 15:30:00
**Next Phase**: External research (MCP) →
