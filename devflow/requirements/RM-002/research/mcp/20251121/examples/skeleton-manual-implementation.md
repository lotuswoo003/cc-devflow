# Building Skeleton Screens in Mini Programs: A Complete Guide

**Source**: https://segmentfault.com/a/1190000015876164
**Retrieved**: 2025-11-21
**Topic**: Manual skeleton screen implementation strategies

---

## Overview

A skeleton screen serves as "a blank version of a page into which information is gradually loaded." This technique improves user experience by displaying a loading placeholder before actual content arrives.

## Two Primary Approaches

**Approach 1: Manual HTML/CSS**
Hand-coding skeleton screens for each page is straightforward but requires maintenance updates whenever layout changes occur.

**Approach 2: Pre-rendering**
Using tools to render pages, extract DOM nodes and styles, preserve structure, overlay gray blocks on content, then generate HTML/CSS bundles. This reduces maintenance overhead.

## Key Implementation Challenges for Mini Programs

1. **Pre-rendering**: Mini programs lack built-in server-side rendering. Solutions involve initializing data + templates to create base structures.

2. **Node Acquisition**: Using WeChat's APIs (available since v1.4.0), developers can retrieve node information by applying specific CSS classes like `skeleton-rect` and `skeleton-radius`.

## Code Example

```javascript
// index.js
Page({
    data: {
        motto: 'Hello World',
        userInfo: {
            avatarUrl: 'https://wx.qlogo.cn/...',
            nickName: 'jay'
        },
        lists: ['item1', 'item2', 'item3'],
        showSkeleton: true
    },
    onLoad: function () {
        const that = this;
        setTimeout(() => {
            that.setData({showSkeleton: false})
        }, 3000)
    }
})
```

```xml
<!-- index.wxml -->
<view class="container">
    <view class="userinfo">
        <image class="userinfo-avatar skeleton-radius"
               src="{{userInfo.avatarUrl}}" mode="cover"/>
        <text class="userinfo-nickname skeleton-rect">
            {{userInfo.nickName}}
        </text>
    </view>
    <view style="margin: 20px 0">
        <view wx:for="{{lists}}" class="lists">
            <icon type="success" size="20" class="list skeleton-radius"/>
            <text class="skeleton-rect">{{item}}</text>
        </view>
    </view>
</view>
```

## Implementation Strategy

Mark target elements with `skeleton-rect` (rectangular placeholders) or `skeleton-radius` (circular placeholders). Extract `top`, `left`, `width`, and `height` properties using the API, then draw skeleton elements accordingly.

## Trade-offs

Runtime rendering provides flexibility but requires default data to scaffold page structure and manual class annotations. Pre-built webpack plugins offer better performance but demand running Mini Programs on Chrome, which current tools no longer support reliably.

---

**Document Classification**: Example/Tutorial
**Relevance to RM-002**: ⚠️ Medium - Alternative approach, but RM-001 already uses simpler method
**Key Takeaway**: Manual approach requires skeleton-rect/skeleton-radius classes, but built-in generator is easier
