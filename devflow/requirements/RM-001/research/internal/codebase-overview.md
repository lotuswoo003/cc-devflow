# Codebase Overview: 小程序项目初始化

**Generated**: 2025-11-18T15:30:00+08:00
**Requirement**: RM-001 - 小程序项目初始化
**Context**: 这是陪玩服务平台的第一个需求，目标是初始化微信小程序项目框架

---

## 项目现状

### 当前状态
- **项目类型**: 新项目（三端系统）
- **目标**: 陪玩服务平台
- **架构**: 微信小程序 + Vue管理后台 + SpringBoot后端
- **当前阶段**: 项目初始化阶段

### 已有资源
1. **路线图** (devflow/ROADMAP.md)
   - 完整的产品规划
   - 11个路线图项目（RM-001 ~ RM-011）
   - 2个里程碑（M1-Q4-2025, M2-Q1-2026）

2. **架构文档** (devflow/ARCHITECTURE.md)
   - 功能架构图（Feature Architecture）
   - 技术架构图（Technical Architecture）
   - 模块划分图（Module Structure）
   - 需求依赖图（Requirement Dependency）

3. **技术栈** (来自 ARCHITECTURE.md)
   - **微信小程序**: 原生框架, JavaScript/TypeScript
   - **UI组件**: 微信小程序官方组件库
   - **数据Mock**: Mock.js（开发阶段）
   - **网络请求**: wx.request（微信API）

### 目标目录结构
根据架构文档，小程序项目应创建在 `miniapp/` 目录下：

```
miniapp/
├── pages/              # 页面目录
│   ├── index/         # 首页（服务列表）
│   └── customer/      # 客服页面
├── components/         # 组件目录
├── utils/              # 工具函数
│   ├── request.js     # 封装 wx.request
│   └── mock.js        # Mock 数据
├── app.js              # 小程序入口
├── app.json            # 全局配置
├── app.wxss            # 全局样式
├── project.config.json # 项目配置
└── sitemap.json        # 站点地图配置
```

---

## 关键模块与职责

### 1. 小程序入口 (app.js/app.json)
**职责**:
- 小程序全局配置
- 生命周期管理
- 全局数据存储
- 页面路由配置

**关键配置**:
```json
{
  "pages": [
    "pages/index/index",
    "pages/customer/customer"
  ],
  "window": {
    "navigationBarTitleText": "陪玩服务平台",
    "navigationBarBackgroundColor": "#ffffff",
    "navigationBarTextStyle": "black"
  }
}
```

### 2. 首页 (pages/index/)
**职责**:
- 展示服务列表（名称、描述、单价）
- 加载Mock数据
- 跳转到客服页面

**依赖**:
- Mock.js（开发阶段）
- wx.request（未来接口对接）

### 3. 客服入口 (pages/customer/)
**职责**:
- 提供客服联系方式
- 支持电话拨打（wx.makePhoneCall）
- 支持微信客服（button open-type="contact"）

### 4. 工具函数 (utils/)
**职责**:
- 封装网络请求
- 提供Mock数据
- 统一错误处理

---

## 现有测试覆盖情况

**当前**: 无（新项目）

**未来测试需求**:
- 微信小程序没有官方单元测试框架
- 可使用 Jest + miniprogram-simulate 进行组件测试
- 主要依赖真机调试和功能测试

---

## 与本需求直接相关的入口文件

**RM-001的目标是搭建项目框架，因此需要创建以下入口文件**:

1. **miniapp/app.js** - 小程序入口
2. **miniapp/app.json** - 全局配置（定义页面路由）
3. **miniapp/app.wxss** - 全局样式
4. **miniapp/project.config.json** - 微信开发者工具项目配置

---

## 可复用模块

**当前**: 无（新项目）

**未来可复用**:
- RM-002（首页服务列表）会复用 RM-001 的基础框架
- RM-003（客服入口）会复用 RM-001 的工具函数和样式

---

## 潜在扩展点

1. **网络请求层** (utils/request.js)
   - 当前使用Mock数据
   - 未来切换到真实API（RM-010: 后端API开发）
   - 预留接口配置、错误处理、loading状态

2. **全局状态管理**
   - 当前使用小程序全局变量（app.globalData）
   - 未来可引入 MobX 或其他状态管理库

3. **认证模块**
   - 当前无需认证
   - 未来接入微信登录（wx.login）

---

## 技术决策

### 为什么选择微信小程序原生框架？

根据 ARCHITECTURE.md 的 ADR-004（Architecture Decision Record）：

**决策**: 使用微信小程序原生框架，不使用 Uni-App 或 Taro

**理由**:
1. **项目范围单一**: 仅需微信小程序端，无需跨平台
2. **性能最优**: 原生框架性能最佳，无跨平台抽象损耗
3. **官方支持**: 微信官方文档和工具链完善
4. **学习成本低**: 团队可直接使用官方API，无需学习框架封装
5. **避免抽象**: 符合宪法 Article VIII（Anti-Abstraction）原则

**替代方案**:
- Uni-App: 支持跨平台但本项目无此需求
- Taro: React语法但增加学习成本

---

## 主要发现与建议

### 发现
1. **项目处于零基础阶段**: 需要从零搭建小程序框架
2. **清晰的架构指导**: ARCHITECTURE.md 提供了详细的技术栈和目录结构
3. **前端先行策略**: 使用Mock数据快速验证产品价值
4. **明确的依赖关系**: RM-001 是 RM-002 和 RM-003 的前置依赖

### 建议
1. **项目初始化**:
   - 使用微信开发者工具创建新项目
   - 配置基础目录结构（pages, components, utils）
   - 设置全局配置（app.json, project.config.json）

2. **基础框架**:
   - 创建全局样式（app.wxss）：定义颜色、字体、间距等设计系统
   - 封装网络请求工具（utils/request.js）
   - 准备Mock数据结构（utils/mock.js）

3. **页面路由**:
   - 定义首页路由（pages/index/index）
   - 定义客服页面路由（pages/customer/customer）
   - 配置tabBar（如需要）

4. **开发工具**:
   - 安装微信开发者工具
   - 配置项目appId（测试账号或正式账号）
   - 设置ES6转ES5、样式自动补全等编译选项

---

## Constitution 合规性检查

✅ **Article VIII (Anti-Abstraction)**: 使用微信小程序原生框架，无过度抽象
✅ **Article VII (Simplicity Gate)**: 项目结构简单清晰，遵循官方推荐目录结构
✅ **Article I (Quality First)**: 完整实现所有基础配置，无占位符

---

## 下一步

1. 运行外部资料采集（MCP）：搜集微信小程序官方文档和最佳实践
2. 生成研究任务（research/tasks.json）
3. 进入 PRD 生成阶段（/flow-prd）

---

**文档状态**: ✅ 完成
**调研时间**: 2025-11-18T15:30:00+08:00
