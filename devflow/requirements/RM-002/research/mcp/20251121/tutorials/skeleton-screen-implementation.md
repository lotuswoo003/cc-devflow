# WeChat Mini Program Skeleton Screen Implementation Guide

**Source**: https://juejin.cn/post/7101453399240998949
**Retrieved**: 2025-11-21
**Topic**: Practical tutorial for implementing skeleton screens

---

## What is a Skeleton Screen?

A skeleton screen serves as a loading optimization technique. When an application requests data via AJAX, there's a gap where content hasn't loaded yet. Rather than showing a blank space, a skeleton screen provides a placeholder that mimics the page layout, improving perceived performance.

## Implementation Steps

### 1. Generate the Skeleton

The WeChat Developer Tools include a built-in skeleton screen generator. Right-click on a page and select the option to generate a skeleton. This creates two files in your page directory with usage instructions included.

### 2. Apply the Skeleton Screen

**In your .wxml file:**
```wxml
<import src="person.skeleton.wxml"/>
<template is="skeleton" wx:if="{{loading}}" />
```

**In your .wxss file:**
```wxss
@import "./person.skeleton.wxss";
```

**Control the skeleton in your request callback:**
```javascript
var set = setInterval(function () {
    clearInterval(set);
    that.setData({
        loading: false, // Stop displaying skeleton
    })
}, 1000)
```

### 3. Usage Considerations

- Update the skeleton whenever page layout changes
- Use `wx:if` on actual content to prevent overlapping with the skeleton:

```wxml
<template is="skeleton" wx:if="{{loading}}" />
<Header customTitle="Personal Center"></Header>
<view class="head" wx:if="{{!isLogin&&!loading}}" bindtap="login">
    <image src="../../images/{{season}}-people.png"></image>
    <view class="head-name">Click to login</view>
</view>
```

### 4. Optimized Approach: Function Encapsulation

To avoid repeating skeleton logic across pages, create a utility function:

**In utils/util.js:**
```javascript
const loadScreen = (that, time) => {
    var set = setInterval(function () {
        clearInterval(set);
        that.setData({
            loading: false,
            hidden: false
        })
    }, time)
}
```

**In your page:**
```javascript
let util = require('../../utils/util.js')
let that = this;
util.loadScreen(that, 1500)
```

This approach ensures consistent implementation across your application while maintaining cleaner code.

---

**Document Classification**: Tutorial
**Relevance to RM-002**: ✅ High - RM-001 already implemented skeleton, this provides best practices
**Key Takeaway**: Use built-in generator + encapsulate logic for reusability
