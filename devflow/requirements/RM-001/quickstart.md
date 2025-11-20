# Quick Start Guide: RM-001 - 小程序项目初始化

**Audience**: Frontend developers working on the Companion Service Platform Mini-Program
**Time to Complete**: 15-30 minutes
**Prerequisites**: Basic knowledge of WeChat Mini-Program development

---

## Environment Setup

### Step 1: Install WeChat DevTools

**Download Link**: https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html

**Version Requirement**: ≥ 3.0.0 (Stable Release)

**Installation Steps**:

1. **macOS**:
   - Download `wechat_devtools_*.dmg`
   - Open the `.dmg` file and drag to Applications folder
   - Launch from Applications

2. **Windows**:
   - Download `wechat_devtools_*.exe`
   - Run installer and follow prompts
   - Launch from Start Menu or Desktop shortcut

3. **Linux**:
   - Download `.deb` or `.rpm` package based on your distro
   - Install: `sudo dpkg -i wechat_devtools_*.deb` (Debian/Ubuntu)
   - Or: `sudo rpm -i wechat_devtools_*.rpm` (RedHat/Fedora)
   - Launch from terminal: `wechat-devtools`

**Verify Installation**:
- Open WeChat DevTools
- Check version in Menu → Help → About
- Ensure version is ≥ 3.0.0

### Step 2: Obtain AppID (Optional for Development)

**Option 1: Use Test AppID** (Recommended for RM-001)
- WeChat DevTools provides a test AppID for development
- Limitations: Cannot publish, cannot use some cloud features
- Sufficient for RM-001 framework initialization

**Option 2: Register Real AppID** (For production deployment)
- Visit: https://mp.weixin.qq.com/
- Register a Mini-Program account
- Complete identity verification
- Obtain AppID from Settings → Development Settings
- Time: 1-3 business days for approval

**For RM-001**: Use Test AppID (no registration needed)

---

## Project Setup

### Step 3: Open Project in WeChat DevTools

**Method 1: Import Existing Project** (After implementation)

1. Launch WeChat DevTools
2. Click "+" icon or "Import Project"
3. Select project directory: `[cc-devflow]/miniapp/`
4. Project Name: "陪玩服务平台" (or any name)
5. AppID: Select "Test AppID (no AppID, limited features)"
6. Backend Service: "Do not use cloud service"
7. Click "OK"

**Method 2: Create New Project** (Before implementation)

1. Launch WeChat DevTools
2. Click "+" icon or "Create Project"
3. Project directory: `[cc-devflow]/miniapp/`
4. Project Name: "陪玩服务平台"
5. AppID: Select "Test AppID"
6. Backend Service: "Do not use cloud service"
7. Template: "Do not use template" (we'll create structure manually)
8. Click "OK"

**Expected Result**:
- WeChat DevTools opens with your project
- Left panel: Simulator (shows Mini-Program UI)
- Middle panel: File explorer and editor
- Right panel: Console, debugger, network inspector

### Step 4: Verify Project Structure

**Expected Directory Structure** (After RM-001 implementation):

```
miniapp/
├── pages/
│   ├── index/
│   │   ├── index.js
│   │   ├── index.json
│   │   ├── index.wxml
│   │   └── index.wxss
│   └── customer/
│       ├── customer.js
│       ├── customer.json
│       ├── customer.wxml
│       └── customer.wxss
├── components/
│   └── (empty - reserved for future)
├── utils/
│   ├── request.js
│   └── mock.js
├── app.js
├── app.json
├── app.wxss
└── project.config.json
```

**Verification Command** (Terminal):
```bash
cd [cc-devflow]/miniapp
find . -type f -name "*.js" -o -name "*.json" -o -name "*.wxml" -o -name "*.wxss" | sort
```

**Expected Output** (17 files):
```
./app.js
./app.json
./app.wxss
./pages/customer/customer.js
./pages/customer/customer.json
./pages/customer/customer.wxml
./pages/customer/customer.wxss
./pages/index/index.js
./pages/index/index.json
./pages/index/index.wxml
./pages/index/index.wxss
./project.config.json
./utils/mock.js
./utils/request.js
```

---

## Running the Project

### Step 5: Compile and Preview

**In WeChat DevTools**:

1. **Automatic Compilation**:
   - WeChat DevTools compiles automatically on file save
   - Watch the top toolbar for compilation status
   - "Compilation successful" (编译成功) means ready to test

2. **Manual Compilation** (if needed):
   - Click "Compile" button (编译) in top toolbar
   - Or: Menu → Project → Compile (Ctrl/Cmd + B)

3. **View Simulator**:
   - Left panel shows Mini-Program UI
   - Bottom dropdown: Select device (iPhone, Android, iPad)
   - Zoom: Adjust scale (50%, 100%, 150%)

**Expected Result**:
- Compilation succeeds with no errors
- Simulator displays index page (首页)
- Console shows no errors (bottom panel → Console tab)

### Step 6: Test Basic Navigation

**Test 1: Page Load**
1. Simulator loads index page automatically
2. Verify page displays content (service list placeholder or title)
3. Check Console for errors (should be none)

**Test 2: Page Navigation** (if navigation implemented)
1. In index page, click button/link to customer page
2. Verify navigation to customer page
3. Check page displays customer service content
4. Navigate back using top-left back button

**Test 3: Mock Data Loading** (after RM-002 implementation)
1. Index page loads service list
2. Verify 3 services displayed (王者荣耀陪玩, 语音聊天陪伴, 吃鸡陪玩)
3. Check Console for request logs
4. Verify data format matches API contract

### Step 7: Test Real Device (Optional but Recommended)

**Preview on Real Device**:

1. **Generate QR Code**:
   - Click "Preview" button (预览) in top toolbar
   - WeChat DevTools generates QR code

2. **Scan with WeChat**:
   - Open WeChat app on mobile device
   - Use built-in scanner (Discover → Scan QR Code)
   - Scan QR code from DevTools

3. **Test on Real Device**:
   - Mini-Program opens in WeChat
   - Test all features (navigation, data loading)
   - Check performance (page load time < 1s)

**Limitations with Test AppID**:
- Can only be tested by accounts in developer list
- Cannot share with external users
- Cannot publish to production

---

## Debugging

### Step 8: Use DevTools Debugger

**Console Panel** (Bottom panel → Console):
- View `console.log()` output
- Check for errors (red text)
- Inspect request logs

**Network Panel** (Bottom panel → Network):
- View wx.request() calls (when using real API)
- Check request/response data
- Verify response time

**Storage Panel** (Bottom panel → Storage):
- Inspect wx.setStorageSync() data
- View cached data (when caching implemented)
- Clear storage for testing

**AppData Panel** (Bottom panel → AppData):
- View page data (this.data)
- Inspect component props
- Monitor data changes (setData calls)

**Wxml Panel** (Bottom panel → Wxml):
- Inspect DOM structure
- View element styles
- Identify layout issues

### Step 9: Common Issues and Solutions

**Issue 1: "Compilation failed - app.json not found"**
- **Cause**: Project directory doesn't contain app.json
- **Solution**: Ensure you opened the correct directory (`miniapp/`, not parent directory)

**Issue 2: "Page not found - pages/index/index"**
- **Cause**: Page files missing or not registered in app.json
- **Solution**:
  1. Check `pages/index/` directory exists
  2. Verify app.json includes `"pages/index/index"` in pages array
  3. Ensure all 4 files exist (.js, .json, .wxml, .wxss)

**Issue 3: "Module not found - utils/request.js"**
- **Cause**: Incorrect require() path
- **Solution**: Use relative path from current file:
  - From `pages/index/index.js`: `require('../../utils/request.js')`
  - From `pages/customer/customer.js`: `require('../../utils/request.js')`

**Issue 4: "Simulator shows blank page"**
- **Cause**: JavaScript error preventing page load
- **Solution**:
  1. Open Console panel
  2. Check for errors (red text)
  3. Fix errors in corresponding .js file
  4. Save and recompile

**Issue 5: "Mock data not loading"**
- **Cause**: request.js not calling mock.js, or mock.js error
- **Solution**:
  1. Verify `useMock: true` in request.get() call
  2. Check mock.js exports functions correctly
  3. Verify mock data structure matches contract

---

## Verification Checklist

### Pre-Implementation Checklist

Before starting development (RM-001 TASKS phase):

- [ ] WeChat DevTools installed (version ≥ 3.0.0)
- [ ] Test AppID configured (or decided to use test mode)
- [ ] Project directory created (`miniapp/`)
- [ ] Git repository initialized (if not already)
- [ ] Team members have access to WeChat DevTools

### Post-Implementation Checklist

After completing RM-001 tasks:

**File Structure**:
- [ ] 17 files created (4 core + 8 page files + 2 utils + 3 directories)
- [ ] All pages have 4 files (.js, .json, .wxml, .wxss)
- [ ] utils/ contains request.js and mock.js

**Core Files**:
- [ ] app.js defines application lifecycle
- [ ] app.json registers pages (index, customer)
- [ ] app.wxss defines global styles
- [ ] project.config.json configured with AppID

**Compilation**:
- [ ] Project compiles without errors
- [ ] Compilation time < 5 seconds
- [ ] Code package size < 500 KB

**Functionality**:
- [ ] Index page loads successfully
- [ ] Customer page loads successfully
- [ ] Navigation between pages works
- [ ] Mock data returns 3 services (when called)
- [ ] request.js supports useMock flag

**Code Quality** (Constitution Article I.1):
- [ ] No TODO comments
- [ ] No placeholder code (e.g., "// implement later")
- [ ] No hardcoded secrets (API URLs in config, not hardcoded)
- [ ] All functions documented with comments

**Testing** (to be done in TASKS phase):
- [ ] Manual testing in simulator
- [ ] Real device testing (iOS + Android)
- [ ] All user stories verified against acceptance criteria

---

## Next Steps

After completing RM-001 initialization:

1. **RM-002**: Implement service list display in index page
   - Use mock.js data
   - Display 3 services with name, description, price
   - Add click handling for service details

2. **RM-003**: Implement customer service entry in customer page
   - Add phone call button (wx.makePhoneCall)
   - Add WeChat customer service button (open-type="contact")

3. **RM-009**: Design backend API contracts
   - Replace mock data structure with real API schema
   - Define authentication and authorization

4. **RM-011**: Integrate frontend with real backend API
   - Switch `useMock: false` in request.js
   - Add authentication token handling
   - Test end-to-end flow

---

## Additional Resources

### Official Documentation

- **Mini-Program Framework**: https://developers.weixin.qq.com/miniprogram/dev/framework/
- **API Reference**: https://developers.weixin.qq.com/miniprogram/dev/api/
- **Component Library**: https://developers.weixin.qq.com/miniprogram/dev/component/
- **DevTools Guide**: https://developers.weixin.qq.com/miniprogram/dev/devtools/devtools.html

### Project Documentation

- **PRD**: `devflow/requirements/RM-001/PRD.md` - Product requirements
- **TECH_DESIGN**: `devflow/requirements/RM-001/TECH_DESIGN.md` - Technical design
- **EPIC**: `devflow/requirements/RM-001/EPIC.md` - Epic planning (after /flow-epic)
- **TASKS**: `devflow/requirements/RM-001/TASKS.md` - Task breakdown (after /flow-epic)

### Community Resources

- **WeChat Open Community**: https://developers.weixin.qq.com/community/
- **Stack Overflow**: Tag `wechat-miniprogram`
- **GitHub Examples**: Search "wechat-miniprogram-demo"

---

**Document Status**: Ready for use
**Last Updated**: 2025-11-20
**Generated by**: tech-architect agent
