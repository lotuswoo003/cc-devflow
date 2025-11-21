# Data Model: RM-004 - Vue管理后台框架

**Generated**: 2025-11-21T17:10:00+08:00
**Source**: Extracted from TECH_DESIGN.md Section 3
**Purpose**: Entity definitions for planner and database tools

---

## Entity Definitions

### 1. User Entity (用户实体)

**Table Name**: `users` (Backend responsibility - RM-010)

**TypeScript Interface** (Frontend):

```typescript
interface User {
  id: string                          // UUID
  username: string                    // 4-16 chars, alphanumeric + underscore
  email: string                       // Valid email format
  phone?: string                      // Optional, E.164 format
  avatar?: string                     // Optional, URL
  roles: Role[]                       // Array of roles
  status: UserStatus                  // Enum: active | inactive | locked | deleted
  createdAt: string                   // ISO 8601 timestamp
  updatedAt: string                   // ISO 8601 timestamp
  lastLoginAt?: string                // Optional, ISO 8601 timestamp
}

enum UserStatus {
  Active = 'active',
  Inactive = 'inactive',
  Locked = 'locked',
  Deleted = 'deleted'
}
```

**Validation Rules**:
- `username`: Required, 4-16 characters, `/^[a-zA-Z0-9_]{4,16}$/`
- `email`: Required, valid email format
- `password`: Required (not in entity, only in create/update), 6-20 characters, SHA256 encrypted
- `status`: Required, default='active'

**State Machine**:
```
inactive → active (激活)
active → locked (锁定)
locked → active (解锁)
active → deleted (软删除)
```

---

### 2. Role Entity (角色实体)

**Table Name**: `roles` (Backend responsibility - RM-010)

**TypeScript Interface** (Frontend):

```typescript
interface Role {
  id: string                          // UUID
  name: string                        // Display name (e.g., "管理员")
  code: string                        // Unique code (e.g., "ROLE_ADMIN")
  permissions: Permission[]           // Array of permissions
  description?: string                // Optional description
}
```

**Predefined Roles**:
- `ROLE_ADMIN`: 管理员 (所有权限)
- `ROLE_OPERATOR`: 运营人员 (服务管理、客服配置)
- `ROLE_VIEWER`: 查看者 (只读权限)

**Validation Rules**:
- `name`: Required, 2-20 characters
- `code`: Required, unique, `/^ROLE_[A-Z_]+$/`

---

### 3. Permission Entity (权限实体)

**Table Name**: `permissions` (Backend responsibility - RM-010)

**TypeScript Interface** (Frontend):

```typescript
interface Permission {
  id: string                          // UUID
  resource: string                    // Resource identifier (e.g., "service", "user")
  action: PermissionAction            // Enum: read | write | delete | execute
  code: string                        // Unique code (e.g., "service:read")
}

enum PermissionAction {
  Read = 'read',
  Write = 'write',
  Delete = 'delete',
  Execute = 'execute'
}
```

**Permission Format**: `{resource}:{action}`

**Examples**:
- `service:read`: 查看服务列表
- `service:write`: 创建/编辑服务
- `user:read`: 查看用户列表
- `user:delete`: 删除用户
- `*:*:*`: 所有权限 (Admin only)

---

### 4. MenuItem Entity (菜单实体)

**Table Name**: `menus` (Backend responsibility - RM-010)

**TypeScript Interface** (Frontend):

```typescript
interface MenuItem {
  id: string                          // UUID
  parentId?: string                   // Parent menu ID (null for root)
  path: string                        // Route path (e.g., "/dashboard")
  name: string                        // Route name (e.g., "Dashboard")
  component: string                   // Component path (e.g., "views/dashboard/index.vue")
  redirect?: string                   // Redirect path (optional)
  meta: MenuMeta                      // Metadata
  children?: MenuItem[]               // Child menus
  sort: number                        // Sort order (ascending)
}

interface MenuMeta {
  title: string                       // Display title
  icon?: string                       // Icon name (Element Plus icon)
  hidden: boolean                     // Hide from menu (default: false)
  alwaysShow: boolean                 // Always show root menu (default: false)
  noCache: boolean                    // Disable keep-alive (default: false)
  breadcrumb: boolean                 // Show in breadcrumb (default: true)
  activeMenu?: string                 // Active menu path (for detail pages)
  roles?: string[]                    // Allowed roles (empty = all roles)
  permissions?: string[]              // Allowed permissions (empty = all permissions)
}
```

**Tree Structure Example**:
```json
[
  {
    "id": "1",
    "parentId": null,
    "path": "/",
    "name": "Layout",
    "component": "layout/index.vue",
    "redirect": "/dashboard",
    "meta": { "title": "主页", "icon": "home", "hidden": false },
    "sort": 1,
    "children": [
      {
        "id": "2",
        "parentId": "1",
        "path": "/dashboard",
        "name": "Dashboard",
        "component": "views/dashboard/index.vue",
        "meta": { "title": "Dashboard", "icon": "dashboard", "hidden": false },
        "sort": 1
      }
    ]
  }
]
```

---

## Relationships

### User → Role (Many-to-Many)

**Join Table**: `user_roles` (Backend)

```
users (1) ←→ (N) user_roles (N) ←→ (1) roles
```

**TypeScript**:
```typescript
interface User {
  roles: Role[]  // Populated from join table
}
```

### Role → Permission (Many-to-Many)

**Join Table**: `role_permissions` (Backend)

```
roles (1) ←→ (N) role_permissions (N) ←→ (1) permissions
```

**TypeScript**:
```typescript
interface Role {
  permissions: Permission[]  // Populated from join table
}
```

### MenuItem → MenuItem (Self-Referencing Tree)

**Parent-Child Relationship**:

```
MenuItem (parent) ←→ (N) MenuItem (children)
```

**TypeScript**:
```typescript
interface MenuItem {
  parentId?: string         // Nullable foreign key
  children?: MenuItem[]     // Recursive structure
}
```

---

## API Request/Response Types

### Authentication

```typescript
// POST /api/v1/auth/login
interface LoginRequest {
  username: string          // Username or email
  password: string          // SHA256 encrypted
  captcha?: string          // Optional
  remember?: boolean        // Optional, affects token expiry
}

interface LoginResponse {
  token: string             // JWT Access Token
  refreshToken?: string     // Optional Refresh Token
  user: User                // User info
  permissions: string[]     // Flattened permissions (e.g., ["service:read", "user:write"])
  expiresIn: number         // Token expiry time (seconds)
}
```

### Pagination

```typescript
// GET /api/v1/users?page=1&size=20&sort=createdAt&order=desc
interface PageRequest {
  page: number              // Page number (1-indexed)
  size: number              // Page size (default: 20)
  sort?: string             // Sort field
  order?: 'asc' | 'desc'    // Sort order
  [key: string]: any        // Additional filters (e.g., status, keyword)
}

interface PageResponse<T> {
  list: T[]                 // Data list
  total: number             // Total records
  page: number              // Current page
  size: number              // Page size
  pages: number             // Total pages
}
```

### Standard Response

```typescript
interface ApiResponse<T = any> {
  code: number              // Business status code (200=success, 401=unauthorized, etc.)
  data: T                   // Business data
  message: string           // Message
  timestamp: number         // Timestamp (milliseconds)
}
```

---

## State Management Models (Pinia)

### UserState

```typescript
interface UserState {
  token: string | null              // JWT Token
  refreshToken: string | null       // Refresh Token (optional)
  userInfo: User | null             // Current user info
  roles: string[]                   // Role codes (e.g., ["ROLE_ADMIN"])
  permissions: string[]             // Permission codes (e.g., ["service:read", "user:write"])
}
```

**LocalStorage Keys**:
- `token`: Access Token
- `refreshToken`: Refresh Token (if supported)

### AppState

```typescript
interface AppState {
  sidebar: {
    opened: boolean                 // Sidebar expanded (default: true)
    withoutAnimation: boolean       // Disable animation (default: false)
  }
  device: 'desktop' | 'mobile'      // Device type
  language: string                  // Language (default: "zh-CN")
  size: 'default' | 'large' | 'small'  // Element Plus component size
}
```

**LocalStorage Keys**:
- `sidebarStatus`: Sidebar state
- `language`: Language preference
- `size`: Component size preference

### PermissionState

```typescript
interface PermissionState {
  routes: RouteRecordRaw[]          // All routes (static + dynamic)
  dynamicRoutes: RouteRecordRaw[]   // Dynamic routes (filtered by permissions)
  isRoutesGenerated: boolean        // Routes generation status
}
```

---

## Frontend-Only Models (No Backend Equivalent)

### Form Models

```typescript
// Login Form
interface LoginFormState {
  username: string
  password: string          // Plain text (will be encrypted before submission)
  remember: boolean
}

// User Edit Form
interface UserFormState {
  id?: string               // Optional (null for create)
  username: string
  email: string
  phone?: string
  roleIds: string[]         // Array of role IDs
  status: UserStatus
}
```

### Table Models

```typescript
// User List Query
interface UserQuery extends PageRequest {
  keyword?: string          // Search keyword (username/email/phone)
  status?: UserStatus       // Filter by status
  roleId?: string           // Filter by role
}

// Table Row Selection
interface TableSelection<T> {
  selectedRows: T[]         // Selected rows
  selectedRowKeys: string[] // Selected row IDs
}
```

---

## Data Flow Summary

```
Component (View)
    ↓
Form Validation (Vee-validate / Element Plus rules)
    ↓
Pinia Store Action
    ↓
API Service Layer
    ↓
Axios Request (with interceptor)
    ↓
[Development] Mock Data (vite-plugin-mock)
[Production] Backend API (SpringBoot)
    ↓
ApiResponse<T>
    ↓
Axios Response Interceptor
    ↓
Pinia Store State Update
    ↓
Component Re-render (Vue Reactivity)
```

---

**Generated By**: CC-DevFlow
**Reference**: TECH_DESIGN.md Section 3
**Usage**: This document will be used by planner agent to generate EPIC and TASKS
