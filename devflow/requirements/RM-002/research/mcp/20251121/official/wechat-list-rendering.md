# WeChat Mini Program List Rendering (wx:for)

**Source**: https://developers.weixin.qq.com/miniprogram/dev/reference/wxml/list.html
**Retrieved**: 2025-11-21
**Topic**: Official documentation for wx:for list rendering

---

## Core Syntax

The `wx:for` directive binds an array to a component, rendering it repeatedly for each item. "The default array's current item index variable name defaults to `index`, and the array current item variable name defaults to `item`."

**Basic Example:**
```wxml
<view wx:for="{{array}}">
  {{index}}: {{item.message}}
</view>
```

```javascript
Page({
  data: {
    array: [{message: 'foo'}, {message: 'bar'}]
  }
})
```

## Custom Variable Names

Use `wx:for-item` and `wx:for-index` to specify custom variable names:

```wxml
<view wx:for="{{array}}" wx:for-index="idx" wx:for-item="itemName">
  {{idx}}: {{itemName.message}}
</view>
```

## Nesting Support

`wx:for` supports nested loops. The documentation provides a multiplication table example demonstrating nested iteration across two arrays.

## Block Elements

Apply `wx:for` to `<block/>` tags to render multi-node structures without adding extra DOM elements.

## Key Management (wx:key)

"If list item positions change dynamically or new items are added, use `wx:key` to specify unique identifiers" to preserve component state and improve rendering efficiency.

**Two formats:**
1. String property name (must be unique and immutable per item)
2. Reserved keyword `*this` (item itself must be unique)

**Key benefit:** Framework reorders components rather than recreating them, preserving internal state like input values.

*Framework warns if `wx:key` is omitted, though it's optional for static lists.*

## Best Practices

1. **Always use wx:key for dynamic lists**
   - Improves performance
   - Preserves component state
   - Prevents unnecessary re-renders

2. **Use block for multi-node structures**
   - Cleaner DOM
   - Better performance

3. **Custom variable names for clarity**
   - Use descriptive names in nested loops
   - Avoid naming conflicts

---

**Document Classification**: Official Documentation
**Relevance to RM-002**: ✅ High - Core技术for service list rendering
**Key Takeaway**: wx:key是必须的 for dynamic service lists
