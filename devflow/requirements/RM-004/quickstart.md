# Quickstart Guide: RM-004 - Vue管理后台框架

**Generated**: 2025-11-21T17:10:00+08:00
**Purpose**: Environment setup, test commands, and verification steps for RM-004

---

## Table of Contents

1. [Prerequisites](#1-prerequisites)
2. [Environment Setup](#2-environment-setup)
3. [Development Workflow](#3-development-workflow)
4. [Testing](#4-testing)
5. [Building](#5-building)
6. [Verification Checklist](#6-verification-checklist)
7. [Troubleshooting](#7-troubleshooting)

---

## 1. Prerequisites

### Required Software

| Software | Minimum Version | Recommended Version | Verification Command |
|----------|-----------------|---------------------|----------------------|
| **Node.js** | 18.0.0 | 18.20.0+ (LTS) | `node --version` |
| **npm** | 9.0.0 | 9.8.0+ | `npm --version` |
| **Git** | 2.30.0 | 2.42.0+ | `git --version` |

**Optional但推荐**:
- **pnpm** (≥8.0.0): 更快的包管理器，`npm install -g pnpm`
- **VS Code**: 推荐IDE，配合以下扩展:
  - Volar (Vue Language Features)
  - TypeScript Vue Plugin (Volar)
  - ESLint
  - Prettier

### System Requirements

- **OS**: Windows 10+, macOS 12+, Linux (Ubuntu 20.04+)
- **RAM**: 最低4GB，推荐8GB+
- **Disk**: 500MB+ 可用空间 (node_modules)
- **Browser**: Chrome 90+, Edge 90+, Firefox 90+

---

## 2. Environment Setup

### Step 1: Clone Repository (如果尚未克隆)

```bash
# Clone the repository
git clone https://github.com/your-org/vue-admin.git
cd vue-admin
```

### Step 2: Install Dependencies

```bash
# Using npm (default)
npm install

# Or using pnpm (faster)
pnpm install

# Expected output:
# ✔ Dependencies installed successfully
# ✔ Total time: ~30 seconds (npm) / ~15 seconds (pnpm)
```

**Troubleshooting** (If installation fails):

```bash
# Clear cache and retry
npm cache clean --force
rm -rf node_modules package-lock.json
npm install

# Or switch npm registry (China mainland)
npm config set registry https://registry.npmmirror.com
npm install
```

### Step 3: Configure Environment Variables

```bash
# Create .env.development file (if not exists)
cat > .env.development <<EOF
VITE_APP_TITLE=陪玩服务平台-管理后台
VITE_API_BASE_URL=http://localhost:8080/api/v1
VITE_MOCK_ENABLED=true
EOF

# Create .env.production file (if not exists)
cat > .env.production <<EOF
VITE_APP_TITLE=陪玩服务平台-管理后台
VITE_API_BASE_URL=https://api.example.com/api/v1
VITE_MOCK_ENABLED=false
EOF

# Verify environment files
ls -la .env.*
```

### Step 4: Verify TypeScript Configuration

```bash
# Check TypeScript version
npx tsc --version
# Expected: Version 5.8.x

# Run type check (should have no errors in a fresh setup)
npm run type-check
# Expected output: No type errors found
```

### Step 5: Verify ESLint/Prettier Configuration

```bash
# Lint source files
npm run lint
# Expected: ✔ No linting errors

# Format source files
npm run format
# Expected: ✔ Files formatted successfully
```

---

## 3. Development Workflow

### Start Development Server

```bash
# Start Vite dev server
npm run dev

# Expected output:
# VITE v7.0.0  ready in 500 ms
#
# ➜  Local:   http://localhost:5173/
# ➜  Network: http://192.168.1.100:5173/
# ➜  press h + enter to show help
```

**Access Points**:
- **Local**: http://localhost:5173
- **Network**: http://192.168.1.100:5173 (可从局域网其他设备访问)

**Hot Module Replacement (HMR)**:
- Edit any `.vue`, `.ts`, `.scss` file → Browser auto-refreshes
- **Fast Refresh**: Changes appear in <200ms

### Login Credentials (Mock Data)

| Username | Password | Role | Permissions |
|----------|----------|------|-------------|
| `admin` | `123456` | 管理员 | All (*:*:*) |
| `operator` | `123456` | 运营人员 | service:read, service:write, user:read |
| `viewer` | `123456` | 查看者 | *:read |

**Note**: 前端会自动使用SHA256加密密码后再发送

### Development Commands

```bash
# Start dev server
npm run dev

# Start dev server with specific port
npm run dev -- --port 3000

# Start dev server and open browser
npm run dev -- --open

# Clear cache and restart
rm -rf node_modules/.vite
npm run dev
```

---

## 4. Testing

### Test Matrix

| Test Type | Tool | Coverage Target | Command |
|-----------|------|----------------|---------|
| **Unit Tests** | Vitest | ≥80% | `npm run test` |
| **Integration Tests** | Vitest + Vue Test Utils | ≥80% | `npm run test` |
| **Type Check** | vue-tsc | 0 errors | `npm run type-check` |
| **Linting** | ESLint | 0 errors | `npm run lint` |
| **E2E Tests** | Playwright | N/A (RM-011) | `npm run test:e2e` |

### Run Unit Tests

```bash
# Run all tests (watch mode)
npm run test

# Run all tests once (CI mode)
npm run test -- --run

# Run specific test file
npm run test -- tests/unit/utils/validate.spec.ts

# Run tests with UI
npm run test:ui
# Opens Vitest UI at http://localhost:51204
```

**Expected Output**:

```
✓ tests/unit/utils/validate.spec.ts (12 tests) 15ms
  ✓ isValidUsername (4)
  ✓ isValidEmail (4)
  ✓ isValidPassword (4)

✓ tests/unit/stores/user.spec.ts (8 tests) 25ms
  ✓ login successfully
  ✓ logout and clear state
  ✓ check if user has permission

Test Files  2 passed (2)
     Tests  20 passed (20)
  Start at  17:10:00
  Duration  150ms
```

### Generate Coverage Report

```bash
# Run tests with coverage
npm run test:coverage

# Expected output:
# Coverage report generated in coverage/
#
# File                | % Stmts | % Branch | % Funcs | % Lines |
# --------------------|---------|----------|---------|---------|
# All files           |   85.2  |   82.5   |   88.1  |   85.2  |
#  utils/validate.ts  |   100   |   100    |   100   |   100   |
#  stores/user.ts     |   90.5  |   85.0   |   92.3  |   90.5  |
#
# ✅ Coverage threshold met: 85.2% ≥ 80%
```

**View HTML Report**:

```bash
# Open coverage report in browser
open coverage/index.html  # macOS
xdg-open coverage/index.html  # Linux
start coverage/index.html  # Windows
```

### TDD Workflow Example

```markdown
## Story 1: 项目初始化与基础配置

### TEST TASKS
- [ ] T001: Write unit tests for environment variable loading

### TEST VERIFICATION CHECKPOINT
→ Run: npm run test -- tests/unit/env.spec.ts
→ Expected: ❌ All tests FAIL (functions not implemented yet)

### IMPLEMENTATION TASKS
- [ ] T003: Configure environment variables

### TEST VERIFICATION CHECKPOINT
→ Run: npm run test -- tests/unit/env.spec.ts
→ Expected: ✅ All tests PASS
```

**Commands**:

```bash
# Step 1: Write test (T001)
# Edit: tests/unit/env.spec.ts

# Step 2: Run test (Verify FAIL)
npm run test -- tests/unit/env.spec.ts
# Expected: ❌ FAIL (functions not implemented)

# Step 3: Implement code (T003)
# Edit: src/config/env.ts

# Step 4: Run test (Verify PASS)
npm run test -- tests/unit/env.spec.ts
# Expected: ✅ PASS
```

---

## 5. Building

### Production Build

```bash
# Build for production
npm run build

# Expected output:
# vite v7.0.0 building for production...
# ✓ 125 modules transformed.
# dist/index.html                    0.45 kB │ gzip:   0.30 kB
# dist/assets/index-abc123.css      52.30 kB │ gzip:  12.50 kB
# dist/assets/index-def456.js      195.20 kB │ gzip:  65.40 kB
# dist/assets/element-plus-ghi789.js 145.60 kB │ gzip:  48.20 kB
# dist/assets/vue-vendor-jkl012.js   98.40 kB │ gzip:  36.80 kB
# dist/assets/utils-mno345.js        48.70 kB │ gzip:  16.50 kB
#
# ✓ built in 8.5s
#
# Total size (gzipped): 550 KB ✅ (< 2.5MB target)
```

### Analyze Bundle Size

```bash
# Generate bundle analysis report
npm run build
# Opens dist/stats.html in browser

# Check gzip sizes
du -sh dist/*
```

### Preview Build

```bash
# Preview production build locally
npm run preview

# Expected output:
# ➜  Local:   http://localhost:4173/
# ➜  press h + enter to show help

# Access: http://localhost:4173
# Login with: admin / 123456
```

### Build Verification Checklist

```bash
# 1. Type check passes
npm run type-check
# ✓ No type errors

# 2. Linting passes
npm run lint
# ✓ No linting errors

# 3. All tests pass
npm run test -- --run
# ✓ All tests passed

# 4. Coverage ≥80%
npm run test:coverage
# ✓ Coverage: 85.2% ≥ 80%

# 5. Build succeeds
npm run build
# ✓ Built successfully

# 6. Bundle size < 2.5MB (gzipped)
du -sh dist/assets/*.gz
# ✓ Total: 550 KB
```

---

## 6. Verification Checklist

### Functional Verification

| Feature | Verification Steps | Expected Result |
|---------|-------------------|-----------------|
| **Login** | 1. Navigate to http://localhost:5173/login<br>2. Enter: admin / 123456<br>3. Click "登录" | Redirect to /dashboard, show user info in navbar |
| **Logout** | 1. Click user dropdown in navbar<br>2. Click "退出登录" | Redirect to /login, clear token |
| **Sidebar Toggle** | 1. Click hamburger icon<br>2. Sidebar collapses (200px → 64px) | Smooth animation, icons remain visible |
| **Routing** | 1. Click sidebar menu items<br>2. Navigate to different pages | URL changes, page content updates, breadcrumb updates |
| **Permission** | 1. Login as "operator"<br>2. Try to access /users | Redirect to 403 or menu item hidden (depending on role config) |
| **Mock API** | 1. Open DevTools Network tab<br>2. Login<br>3. Check network requests | POST /api/v1/auth/login intercepted by Mock, returns 200 |

### Performance Verification

```bash
# 1. Lighthouse Audit (Chrome DevTools)
# Open: http://localhost:5173
# DevTools → Lighthouse → Run Audit

# Expected scores:
# Performance: ≥ 90
# Accessibility: ≥ 85
# Best Practices: ≥ 90
# SEO: ≥ 80

# 2. Bundle Size Check
npm run build
du -sh dist/assets/*.js dist/assets/*.css | awk '{sum+=$1} END {print sum " KB"}'
# Expected: < 2500 KB (gzipped)

# 3. Initial Load Time (Chrome DevTools)
# Network tab → Throttle: Fast 3G
# Reload page
# Check: DOMContentLoaded < 2s

# 4. HMR Speed
# Edit src/views/dashboard/index.vue
# Check: Update appears in < 300ms
```

### Security Verification

```bash
# 1. No hardcoded secrets
grep -r "sk-" src/
grep -r "API_KEY" src/ | grep -v "import.meta.env"
# Expected: No matches

# 2. Password encryption
# Check: src/views/login/components/LoginForm.vue
# Verify: Password is encrypted with SHA256 before POST

# 3. XSS Prevention
# Check: All user inputs use {{ }} interpolation (auto-escaped)
# Verify: No v-html without DOMPurify.sanitize()

# 4. Token in Authorization Header
# DevTools → Network → Select any API request
# Check: Authorization: Bearer {token}
```

### Constitution Compliance Verification

```bash
# Article I: Quality First
npm run test:coverage
# ✓ Coverage ≥ 80%
grep -r "TODO" src/
# ✓ No TODOs in production code

# Article III: Security Standards
grep -r "sk-" src/  # ✓ No hardcoded secrets
grep -r "password.*=" src/ | grep -v "encryptPassword"  # ✓ No plain passwords

# Article IV: TDD
# ✓ Tests written before implementation (check TASKS.md)

# Article VI: Anti-Abstraction
grep -r "BaseController\|AbstractService\|GenericRepository" src/
# ✓ No matches (direct framework usage)

# Article VII: Simplicity Gate
# ✓ 3 layers: View → Store → API Service

# Article X: Requirement Boundary
# ✓ Only PRD user stories implemented (no extra features)
```

---

## 7. Troubleshooting

### Issue: `npm install` fails with EACCES error

**Symptom**:
```
npm ERR! code EACCES
npm ERR! syscall access
npm ERR! path /usr/local/lib/node_modules
```

**Solution**:
```bash
# Option 1: Use nvm (recommended)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 18
nvm use 18

# Option 2: Change npm prefix
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
export PATH=~/.npm-global/bin:$PATH
```

### Issue: Vite dev server shows blank page

**Symptom**: Browser shows blank white page at http://localhost:5173

**Solution**:
```bash
# 1. Check console errors
# Open DevTools → Console → Look for errors

# 2. Clear Vite cache
rm -rf node_modules/.vite
npm run dev

# 3. Check if port 5173 is in use
lsof -i :5173  # macOS/Linux
netstat -ano | findstr :5173  # Windows

# 4. Use different port
npm run dev -- --port 3000
```

### Issue: Tests fail with "Cannot find module '@/...'"

**Symptom**:
```
Error: Cannot find module '@/utils/validate'
```

**Solution**:
```bash
# Check vitest.config.ts has correct alias
# Should have:
# resolve: {
#   alias: {
#     '@': fileURLToPath(new URL('./src', import.meta.url))
#   }
# }

# Or run with --no-cache
npm run test -- --no-cache
```

### Issue: TypeScript errors after upgrading dependencies

**Symptom**:
```
error TS2307: Cannot find module 'vue' or its corresponding type declarations
```

**Solution**:
```bash
# Reinstall @vue/runtime-core types
npm install -D @vue/runtime-core@latest

# Clear TypeScript cache
rm -rf node_modules/.vite/tsbuildinfo
npm run type-check
```

### Issue: Mock data not working (API returns 404)

**Symptom**: Network tab shows real API calls instead of Mock intercept

**Solution**:
```bash
# 1. Check VITE_MOCK_ENABLED
cat .env.development
# Should have: VITE_MOCK_ENABLED=true

# 2. Check vite-plugin-mock configuration
# vite.config.ts should have:
# viteMockServe({
#   mockPath: 'src/mock',
#   enable: true
# })

# 3. Restart dev server
npm run dev
```

### Issue: Build fails with "out of memory"

**Symptom**:
```
FATAL ERROR: Ineffective mark-compacts near heap limit Allocation failed - JavaScript heap out of memory
```

**Solution**:
```bash
# Increase Node.js memory limit
export NODE_OPTIONS=--max_old_space_size=4096
npm run build

# Or edit package.json:
# "build": "NODE_OPTIONS=--max_old_space_size=4096 vite build"
```

### Issue: ESLint shows "Parsing error"

**Symptom**:
```
Parsing error: 'import' and 'export' may appear only with 'sourceType: module'
```

**Solution**:
```bash
# Check .eslintrc.cjs has:
# parserOptions: {
#   ecmaVersion: 'latest',
#   sourceType: 'module'
# }

# Clear ESLint cache
rm -rf node_modules/.cache/eslint
npm run lint
```

---

## Quick Reference Card

```bash
# 🚀 Start Development
npm run dev                  # Start dev server (http://localhost:5173)

# 🧪 Testing
npm run test                 # Run tests (watch mode)
npm run test:coverage        # Run tests with coverage report

# 🔍 Quality Checks
npm run type-check           # TypeScript type checking
npm run lint                 # ESLint + auto-fix

# 🏗️  Building
npm run build                # Build for production (dist/)
npm run preview              # Preview production build

# 🔧 Utilities
npm run format               # Format code with Prettier
npm install                  # Install/update dependencies
```

---

**Generated By**: CC-DevFlow
**Last Updated**: 2025-11-21T17:10:00+08:00
**For**: QA, Dev, CI shared execution
