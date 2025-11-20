# WeChat Mini-Program Development Overview

**Source**: Web Search Results
**Date**: 2025-11-18
**Requirement**: RM-001 - 小程序项目初始化

---

## Official Documentation References

### Primary Official Resources
- **Official Framework Documentation**: https://developers.weixin.qq.com/miniprogram/en/dev/framework/
- **Getting Started Guide**: https://developers.weixin.qq.com/miniprogram/en/dev/framework/quickstart/getstart.html
- **Directory Structure**: https://developers.weixin.qq.com/miniprogram/dev/framework/structure.html
- **Account Registration**: https://mp.weixin.qq.com/wxopen/waregister?action=step1

---

## Project Directory Structure

### Core Files (Root Directory)

A WeChat Mini-Program requires these core files in the project root:

1. **app.js** - Mini-program entry file (main logic)
   - Application lifecycle management
   - Global data storage
   - Event handlers

2. **app.json** - Global configuration file
   - Page routes configuration
   - Window appearance settings
   - Tab bar configuration
   - Network timeout settings

3. **app.wxss** - Global stylesheet (optional)
   - Common styles shared across all pages
   - Design tokens (colors, fonts, spacing)

4. **project.config.json** - Project configuration file
   - Developer tool settings
   - AppID configuration
   - Compilation options

### Page Structure

Each page consists of 4 files with the same filename but different extensions:

- **.js** - Page script (data and event handlers)
- **.json** - Page configuration (window appearance)
- **.wxml** - Page template structure (markup)
- **.wxss** - Page stylesheet (styles)

### Typical Directory Organization

```
miniapp/
├── pages/              # All page files
│   ├── index/         # Home page
│   │   ├── index.js
│   │   ├── index.json
│   │   ├── index.wxml
│   │   └── index.wxss
│   └── customer/      # Customer service page
│       ├── customer.js
│       ├── customer.json
│       ├── customer.wxml
│       └── customer.wxss
├── components/         # Shared components
├── utils/              # Utility functions
├── app.js              # Application entry
├── app.json            # Global config
├── app.wxss            # Global styles
└── project.config.json # Project config
```

---

## Getting Started Steps

### 1. Account Registration
- Visit: https://mp.weixin.qq.com/wxopen/waregister?action=step1
- Fill in information and submit materials
- Get your Mini Program account
- **Note**: Must be a Chinese company/individual or have a Chinese entity (WFOE)

### 2. Get AppID
- Log in to: https://mp.weixin.qq.com
- Navigate to: Settings → Development Settings
- Find your Mini Program AppID

### 3. Development Tools Setup
- Download WeChat Developer Tools from official website
- Install and launch the toolkit
- Log in by scanning QR code with WeChat
- Ready to develop

### 4. Create First Project
- Open WeChat Developer Tools
- Click "Create Project"
- Choose directory for code storage
- Enter your AppID
- Name your project
- Select "Create a QuickStart Project"
- Click OK to generate initial structure

---

## Technical Stack

### Languages
- **Markup**: WXML (similar to HTML)
- **Styling**: WXSS (similar to CSS)
- **Scripting**: JavaScript (with WeChat APIs)

### Framework
- Proprietary framework provided by WeChat
- Component-based architecture
- Built-in state management
- Access to WeChat native APIs

### APIs Available
- **UI Components**: Button, View, Text, Image, etc.
- **Network**: wx.request for HTTP requests
- **Storage**: wx.setStorage, wx.getStorage
- **Navigation**: wx.navigateTo, wx.redirectTo
- **Media**: wx.chooseImage, wx.playVoice
- **Location**: wx.getLocation
- **Device**: wx.getSystemInfo, wx.makePhoneCall
- **Open Interfaces**: wx.login, wx.getUserInfo

---

## Development Process (2025)

### Phase 1: Preparation
1. Register WeChat Mini Program account
2. Complete verification
3. Set up Official Account (if needed)
4. Get AppID

### Phase 2: Development
1. Install WeChat Developer Tools
2. Create project with QuickStart template
3. Design and develop features
4. Test on simulator and real devices

### Phase 3: Submission
1. Submit for certification
2. Wait for approval (review process)
3. Publish to WeChat ecosystem

---

## Best Practices

### 1. Project Structure
- Keep pages organized in `pages/` directory
- Separate shared components in `components/`
- Centralize utilities in `utils/`
- Use meaningful naming conventions

### 2. Configuration
- Configure all pages in `app.json`
- Set appropriate window titles
- Define tab bar if using multiple tabs
- Set network timeout values

### 3. Development Workflow
- Use "QuickStart Project" template as baseline
- Test frequently on real devices (not just simulator)
- Follow WeChat's design guidelines
- Optimize for performance (package size limits)

### 4. Code Organization
- Separate data and logic in page `.js` files
- Use components for reusable UI elements
- Centralize API calls in `utils/request.js`
- Keep page-specific styles in page `.wxss` files

---

## Key Considerations

### Package Size Limits
- Main package: ≤ 2MB
- Sub-packages: Each ≤ 2MB
- Total size: ≤ 20MB
- Optimize images and code to stay within limits

### Performance
- Minimize network requests
- Use local storage wisely
- Optimize images (compress, lazy load)
- Avoid complex computations on render

### Compliance
- Follow WeChat's content guidelines
- Ensure proper user privacy protection
- Comply with Chinese regulations
- Complete all required certifications

---

## Additional Resources

### Tutorials
- [WeChat Mini Program Development: A 2025 Guide](https://tryon.kivisense.com/blog/wechat-mini-program-development/)
- [A Complete Manual on Wechat Mini Program Development](https://medium.com/@yelin.qiu/a-complete-manual-on-wechat-mini-program-development-8fd28a85ee0d)
- [How to develop a WeChat Mini Program](https://wechatwiki.com/wechat-resources/how-to-make-wechat-mini-program-development-tool-requirements-github/)

### Community
- WeChat Developer Community
- Stack Overflow (wechat-miniprogram tag)
- GitHub repositories with example projects

---

## RM-001 Specific Application

For our "陪玩服务平台" mini-program initialization:

### Required Setup
1. ✅ Create basic project structure (pages, components, utils)
2. ✅ Configure `app.json` with index and customer pages
3. ✅ Set up global styles in `app.wxss`
4. ✅ Prepare Mock.js for development data
5. ✅ Create utility functions for network requests

### Next Steps After RM-001
- **RM-002**: Implement service list page (uses this framework)
- **RM-003**: Implement customer service page (uses this framework)
- **RM-010**: Backend API development
- **RM-011**: Replace Mock data with real API

---

**Status**: ✅ Research completed with WebSearch results
**Note**: Context7 MCP connection failed - will retry for detailed API documentation if needed
