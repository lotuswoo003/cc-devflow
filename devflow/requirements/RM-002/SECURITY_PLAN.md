# Security Plan for RM-002: 小程序首页服务列表

**Status**: Approved
**Created**: 2025-01-21T18:00:00Z
**Requirement**: RM-002 - 小程序首页服务列表
**Phase**: Pre-Implementation (Security Planning)
**Platform**: 微信小程序 (WeChat Mini Program)

---

## Executive Summary

RM-002 implements a **read-only service list display** with minimal attack surface. The requirement enhances UI presentation, adds image display via external CDN, and enables pull-to-refresh functionality. Security analysis indicates **LOW RISK** profile with no user input, no authentication, and no sensitive data handling.

**Key Security Characteristics**:
- Read-only data display (no mutations)
- No user authentication required
- No sensitive data (public service catalog)
- External image resources (Picsum CDN via HTTPS)
- WeChat Mini Program platform security sandbox

**Primary Security Focus**:
1. NO HARDCODED SECRETS (Constitution Article III.1)
2. External resource security (Picsum HTTPS validation)
3. XSS prevention (WeChat platform enforcement)
4. Secure by default (HTTPS, platform CSP)

---

## 1. Security Requirements Analysis

### 1.1 Attack Surface Assessment

Based on PRD.md and TECH_DESIGN.md Section 5 (Security Design), RM-002 has a **minimal attack surface**:

**Data Flow Analysis**:
```
[User Interaction]
    |
    v
[Page Load: index.js::onLoad()]
    |
    v
[Request: utils/request.js::get('/services')]
    |
    v
[Mock Data: utils/mock.js::getServices()]
    |
    v
[Response: {code: 0, data: Service[], message: string}]
    |
    v
[Render: index.wxml with wx:for binding]
    |
    v
[Image Load: <image src="{{item.imageUrl}}" lazy-load />]
    |
    v
[External Request: https://picsum.photos/seed/{id}/300/200]
```

**Attack Surface Inventory**:

| Surface | Risk Level | Exposure | Mitigation |
|---------|-----------|----------|------------|
| External Image URLs (Picsum) | LOW | HTTPS CDN, no user control | Platform enforces HTTPS, CSP blocks non-HTTPS |
| Mock Data (mock.js) | NONE | Static local data, no user input | Code review for hardcoded secrets |
| Configuration (config.js) | LOW | Environment variables, no secrets | NO HARDCODED SECRETS validation |
| Page Logic (index.js) | LOW | No user input, read-only operations | No validation needed (no input) |
| View Template (index.wxml) | LOW | WeChat sanitizes data binding | Platform XSS protection |
| Pull-to-Refresh | NONE | Built-in WeChat API | Platform-managed, no custom code |

**Security-Sensitive Areas** (Priority for Review):

1. **Configuration Management** (config.js):
   - API_CONFIG.baseUrl: Empty string for mock mode (no secrets)
   - MOCK_CONFIG.useMock: Boolean flag (no secrets)
   - NO sensitive credentials or API keys

2. **External Resources** (mock.js imageUrl):
   - Picsum.photos CDN (HTTPS enforced)
   - Seed-based deterministic URLs (no random external calls)
   - No user-controlled URL parameters

3. **Data Rendering** (index.wxml):
   - WeChat {{}} binding (platform sanitizes automatically)
   - No innerHTML or dangerouslySetInnerHTML equivalents
   - No user-provided HTML rendering

---

### 1.2 OWASP Top 10 Analysis (2021)

**Risk Assessment for RM-002**:

| OWASP Category | Status | Justification | Action Required |
|----------------|--------|---------------|-----------------|
| **A01: Broken Access Control** | N/A | No authentication, service list is public | None - Intentionally public |
| **A02: Cryptographic Failures** | N/A | No sensitive data (public service catalog) | None - No encryption needed |
| **A03: Injection** | N/A | No user input, no SQL, no templates with user data | None - Read-only static data |
| **A04: Insecure Design** | MITIGATED | Mock mode, no real API yet | Validated - Design appropriate for scope |
| **A05: Security Misconfiguration** | MITIGATED | WeChat enforces secure defaults (HTTPS, CSP, sandbox) | Validated - Platform enforces |
| **A06: Vulnerable Components** | N/A | No external dependencies (native WeChat SDK only) | None - Zero npm packages |
| **A07: Identification Failures** | N/A | No authentication or user identification | None - Public endpoint |
| **A08: Software/Data Integrity** | MITIGATED | WeChat code signing, platform-managed integrity | Validated - Platform enforces |
| **A09: Security Logging Failures** | LOW | console.log in dev mode only (no production logs yet) | Acceptable - Future RM-011 will add logging |
| **A10: Server-Side Request Forgery (SSRF)** | N/A | No server-side components (frontend-only, mock mode) | None - SSRF not applicable |

**Summary**: 7 categories N/A (no applicable vectors), 3 categories MITIGATED (platform enforcement).

---

### 1.3 Constitution Article III Compliance

**Article III: Security First** - Mandatory security gates:

**III.1 - NO HARDCODED SECRETS** ⚠️ CRITICAL:
- Target files: config.js, mock.js, index.js
- Validation method: Regex scan for patterns:
  - API keys: `(api[_-]?key|apikey|api_secret)`
  - Tokens: `(token|jwt|bearer)`
  - Passwords: `(password|passwd|pwd)`
  - URLs with credentials: `https?://[^:]+:[^@]+@`
- Expected result: ZERO matches
- Constitution requirement: MUST PASS before merge

**III.2 - Input Validation**:
- Current scope: NO user input in RM-002
- Future scope: When RM-XXX adds user forms (search, booking), require:
  - Client-side validation (WeChat form rules)
  - Server-side validation (RM-011 backend)
  - XSS sanitization (platform default)

**III.3 - Least Privilege**:
- WeChat permissions: Only network access (no location, camera, contacts)
- API permissions: Public read-only endpoint (no authentication)
- Future: When authentication added (RM-XXX), enforce role-based access

**III.4 - Secure by Default**:
- HTTPS: WeChat platform enforces HTTPS for all network requests
- CORS: Managed by WeChat platform
- CSP: WeChat enforces Content Security Policy
- Sandbox: All Mini Programs run in isolated sandbox

---

## 2. Security Testing Strategy

### 2.1 Automated Security Scans

**Pre-Implementation Scans** (Before code changes):

1. **Secrets Scan** (Constitution Article III.1):
   ```bash
   # Scan for hardcoded secrets
   grep -r -E "(api[_-]?key|apikey|api_secret|token|jwt|bearer|password|passwd|pwd)" \
     miniapp/utils/config.js \
     miniapp/utils/mock.js \
     miniapp/pages/index/index.js

   # Expected: No matches (exit code 1)
   # If matches found: BLOCK merge, require remediation
   ```

2. **HTTPS Validation** (External resources):
   ```bash
   # Verify all imageUrl use HTTPS
   grep -r "imageUrl" miniapp/utils/mock.js | grep -v "https://"

   # Expected: No matches (all URLs start with https://)
   # If matches found: Update to HTTPS or remove
   ```

3. **XSS Vector Scan** (Data binding):
   ```bash
   # Check for dangerous HTML rendering
   grep -r -E "(innerHTML|dangerouslySetInnerHTML|v-html)" miniapp/pages/index/

   # Expected: No matches (use {{}} binding only)
   # If matches found: Replace with safe WeChat binding
   ```

**Post-Implementation Scans** (After code changes):

4. **Code Review Checklist**:
   - [ ] No new hardcoded secrets introduced
   - [ ] All external URLs use HTTPS
   - [ ] No user input without validation
   - [ ] No dangerous HTML rendering
   - [ ] WeChat API usage follows best practices

5. **WeChat DevTools Security Audit**:
   - Run built-in security checker in WeChat DevTools
   - Verify no CSP violations
   - Check network requests (should only be Picsum HTTPS)

---

### 2.2 Manual Security Testing

**Test Plan for RM-002**:

**Test Case 1: External Resource Security**
```gherkin
Given the service list loads successfully
When I inspect network requests in DevTools
Then all image URLs should use HTTPS (https://picsum.photos/...)
And no insecure HTTP requests should be made
And Picsum CDN should return 200 OK status
```

**Test Case 2: NO HARDCODED SECRETS Validation**
```gherkin
Given I open config.js in code editor
When I search for "api_key", "token", "password"
Then no matches should be found
And API_CONFIG.baseUrl should be empty string or env variable
And no credentials should be visible in source code
```

**Test Case 3: XSS Prevention**
```gherkin
Given the service list displays mock data
When I inspect rendered HTML in DevTools
Then all service names should be plain text (no HTML tags)
And all descriptions should be escaped
And no <script> tags should be present in DOM
```

**Test Case 4: Pull-to-Refresh Security**
```gherkin
Given I perform pull-to-refresh gesture
When the page reloads service data
Then it should call the same mock API (no external calls)
And no error should expose stack traces or internal paths
And refresh should complete within 2 seconds
```

**Test Case 5: Image Loading Error Handling**
```gherkin
Given Picsum CDN is unavailable (simulated via DevTools offline)
When I load the service list page
Then images should display placeholder (gray background)
And no JavaScript errors should occur
And error should be logged to console (dev mode only)
```

---

### 2.3 Security Testing Tools

**Tools for RM-002 Security Validation**:

1. **WeChat DevTools** (Built-in):
   - Security audit panel
   - Network inspector (HTTPS validation)
   - Console (error monitoring)
   - Storage inspector (no sensitive data storage)

2. **Git Pre-Commit Hook** (Automated):
   ```bash
   # .git/hooks/pre-commit (to be created in RM-011)
   #!/bin/bash
   # Scan staged files for secrets
   git diff --cached --name-only | grep -E '\.(js|json)$' | while read file; do
     grep -E "(api[_-]?key|token|password)" "$file" && exit 1
   done
   ```

3. **Manual Code Review**:
   - Checklist-based review (see Section 4)
   - Focus on config.js, mock.js, index.js
   - Verify Constitution Article III compliance

---

## 3. Security Implementation Guidelines

### 3.1 Secure Coding Practices

**For RM-002 Implementation**:

1. **NO HARDCODED SECRETS** (Highest Priority):
   ```javascript
   // ❌ BAD - Hardcoded API key
   const API_KEY = "sk_live_abc123xyz789";

   // ✅ GOOD - Use environment variable
   const API_KEY = process.env.API_KEY || '';

   // ✅ GOOD - Mock mode requires no secrets
   const MOCK_CONFIG = { useMock: true };
   ```

2. **External Resource Security**:
   ```javascript
   // ❌ BAD - HTTP URLs (insecure)
   imageUrl: 'http://example.com/image.jpg'

   // ❌ BAD - User-controlled URLs (SSRF risk)
   imageUrl: req.query.imageUrl

   // ✅ GOOD - HTTPS CDN with deterministic seed
   imageUrl: 'https://picsum.photos/seed/srv_001/300/200'
   ```

3. **Error Handling (No Information Disclosure)**:
   ```javascript
   // ❌ BAD - Exposes stack trace to user
   .catch(error => {
     wx.showToast({ title: error.stack, icon: 'none' });
   });

   // ✅ GOOD - Generic error message
   .catch(error => {
     wx.showToast({ title: '加载失败，请重试', icon: 'none' });
     console.error('Service load error:', error); // Dev only
   });
   ```

4. **Safe Data Binding (XSS Prevention)**:
   ```wxml
   <!-- ❌ BAD - Dangerous if WeChat allowed innerHTML (it doesn't) -->
   <!-- <view innerHTML="{{service.description}}"></view> -->

   <!-- ✅ GOOD - WeChat {{}} binding (auto-sanitized) -->
   <text>{{service.description}}</text>
   ```

---

### 3.2 Security Configuration Checklist

**Pre-Implementation Validation**:

- [x] **config.js validation**:
  - [x] API_CONFIG.baseUrl uses process.env.API_BASE_URL (empty for mock)
  - [x] No hardcoded API keys, tokens, or passwords
  - [x] All sensitive values use environment variables

- [x] **mock.js validation**:
  - [x] imageUrl uses HTTPS URLs only (Picsum CDN)
  - [x] No hardcoded credentials or secrets
  - [x] All mock data is static (no dynamic external calls)

- [x] **index.json validation**:
  - [x] enablePullDownRefresh: true (safe, platform-managed)
  - [x] No custom navigationBarBackgroundColor with hardcoded tokens
  - [x] No usingComponents from untrusted sources

- [x] **app.json validation**:
  - [x] No permission scope beyond network access
  - [x] No cloud function calls (not applicable for RM-002)
  - [x] No plugin dependencies from untrusted sources

**Post-Implementation Validation**:

- [ ] Run secrets scan (Section 2.1 Test 1)
- [ ] Run HTTPS validation (Section 2.1 Test 2)
- [ ] Run XSS vector scan (Section 2.1 Test 3)
- [ ] Manual code review (Section 4)
- [ ] WeChat DevTools security audit

---

## 4. Security Code Review Checklist

**For Security Reviewer** (Post-Implementation):

### 4.1 Configuration Files

**File: miniapp/utils/config.js**
- [ ] No hardcoded API keys (grep "apikey|api_key|api_secret")
- [ ] No hardcoded tokens (grep "token|jwt|bearer")
- [ ] No hardcoded passwords (grep "password|passwd|pwd")
- [ ] API_CONFIG.baseUrl is empty string or env variable
- [ ] All sensitive values use process.env.*

**File: miniapp/utils/mock.js**
- [ ] All imageUrl start with "https://" (no HTTP)
- [ ] No hardcoded credentials or API keys
- [ ] Mock data matches Service schema (TECH_DESIGN.md Section 3)
- [ ] No external API calls (only static return values)

**File: miniapp/app.json**
- [ ] "permission" object only includes necessary scopes
- [ ] No "cloud" configuration with hardcoded env IDs
- [ ] No "plugins" from untrusted sources

---

### 4.2 Page Logic Files

**File: miniapp/pages/index/index.js**
- [ ] No user input fields (read-only page)
- [ ] Error handling doesn't expose stack traces to UI
- [ ] console.log only used in dev mode (acceptable for RM-002)
- [ ] No eval() or Function() constructor usage
- [ ] No dynamic require() with user-controlled paths

**File: miniapp/pages/index/index.wxml**
- [ ] All data binding uses {{}} syntax (WeChat auto-sanitizes)
- [ ] No innerHTML or dangerouslySetInnerHTML equivalents
- [ ] No user-provided HTML rendering
- [ ] Image src uses {{item.imageUrl}} binding (safe)

**File: miniapp/pages/index/index.wxss**
- [ ] No external @import with untrusted URLs
- [ ] No url() in CSS with HTTP URLs (only HTTPS or local)

---

### 4.3 Constitution Compliance

**Article III: Security First**
- [ ] III.1 - NO HARDCODED SECRETS: Verified (zero matches)
- [ ] III.2 - Input Validation: N/A (no user input in RM-002)
- [ ] III.3 - Least Privilege: Verified (no unnecessary permissions)
- [ ] III.4 - Secure by Default: Verified (HTTPS enforced by platform)

**Security Gates Status**:
- [ ] Secrets scan: PASSED (no matches)
- [ ] HTTPS validation: PASSED (all external URLs use HTTPS)
- [ ] XSS scan: PASSED (no dangerous HTML rendering)
- [ ] Code review: PENDING (to be completed by reviewer)

---

## 5. Security Quality Gates

**RM-002 MUST PASS all gates before merge**:

### Gate 1: NO HARDCODED SECRETS (BLOCKING)
```bash
# Run this command in project root
grep -r -E "(api[_-]?key|apikey|api_secret|token|jwt|bearer|password|passwd|pwd|secret)" \
  miniapp/utils/config.js \
  miniapp/utils/mock.js \
  miniapp/pages/index/index.js \
  --exclude-dir=node_modules

# Expected: Exit code 1 (no matches found)
# If matches found: REJECT merge until fixed
```

### Gate 2: HTTPS Enforcement (BLOCKING)
```bash
# Verify all external URLs use HTTPS
grep -r "imageUrl" miniapp/utils/mock.js | grep -v "https://"

# Expected: Exit code 1 (no HTTP URLs)
# If HTTP found: Update to HTTPS or remove
```

### Gate 3: XSS Prevention (BLOCKING)
```bash
# Check for dangerous HTML rendering
grep -r -E "(innerHTML|dangerouslySetInnerHTML)" miniapp/pages/index/

# Expected: Exit code 1 (no dangerous patterns)
# If matches found: Replace with safe {{}} binding
```

### Gate 4: WeChat DevTools Audit (WARNING)
- Open project in WeChat DevTools
- Run "Security Audit" panel
- Expected: Zero high/critical issues
- If warnings found: Review and document justification

### Gate 5: Manual Code Review (BLOCKING)
- Reviewer completes checklist (Section 4)
- All checkboxes marked as reviewed
- No unresolved security concerns
- Constitution Article III compliance verified

---

## 6. Security Risk Register

**Identified Risks for RM-002**:

| Risk ID | Risk Description | Likelihood | Impact | Mitigation | Owner |
|---------|------------------|------------|--------|------------|-------|
| SEC-001 | Picsum CDN unavailable (service disruption) | MEDIUM | LOW | Graceful fallback to placeholder, no functionality loss | Frontend Dev |
| SEC-002 | Hardcoded secrets committed (Constitution violation) | LOW | CRITICAL | Pre-commit hook (future), manual code review (now) | Security Reviewer |
| SEC-003 | HTTP image URLs (MitM attack vector) | LOW | MEDIUM | WeChat blocks HTTP, enforce HTTPS validation | Frontend Dev |
| SEC-004 | Information disclosure via error messages | LOW | LOW | Generic error messages to users, detailed logs in console | Frontend Dev |
| SEC-005 | Future API integration without auth (RM-011) | N/A | N/A | Deferred to RM-011, require JWT authentication | Backend Dev |

**Risk Acceptance**:
- SEC-001: Accepted (low impact, CDN downtime rare)
- SEC-002: Mitigated (manual code review required)
- SEC-003: Mitigated (platform enforces HTTPS)
- SEC-004: Mitigated (generic error messages)
- SEC-005: Deferred (future requirement scope)

---

## 7. Security Recommendations

### 7.1 For RM-002 Implementation

**MUST DO** (Required for merge):
1. Verify NO HARDCODED SECRETS in all files (run Gate 1 scan)
2. Ensure all imageUrl use HTTPS (run Gate 2 scan)
3. Complete manual code review checklist (Section 4)
4. Pass WeChat DevTools security audit

**SHOULD DO** (Best practices):
1. Add error handling for Picsum CDN failures (placeholder fallback)
2. Add console.log only in debug mode (check APP_CONFIG.debug)
3. Document security decisions in code comments

**FUTURE** (RM-011 scope):
1. Add API authentication (JWT tokens)
2. Add input validation for user forms
3. Set up automated secrets scanning (pre-commit hook)
4. Add security logging and monitoring

---

### 7.2 For Future Requirements

**When adding authentication (RM-XXX)**:
- Use WeChat wx.login() + backend JWT generation
- Store tokens in wx.setStorageSync() (encrypted by platform)
- Implement token refresh mechanism
- Add role-based access control (RBAC)

**When adding user input (RM-XXX)**:
- Client-side validation (WeChat form rules)
- Server-side validation (never trust client)
- XSS sanitization (platform default + backend validation)
- SQL injection prevention (ORM parameterized queries)

**When integrating real API (RM-011)**:
- HTTPS enforcement (certificate pinning optional)
- API authentication (Bearer tokens)
- Rate limiting (backend + API gateway)
- Security logging (request tracking, error monitoring)

---

## 8. Compliance and Standards

### 8.1 Constitution v2.0.0 Compliance

**Article III: Security First** - Full compliance required:

| Article | Requirement | RM-002 Status | Evidence |
|---------|-------------|---------------|----------|
| III.1 | NO HARDCODED SECRETS | ✅ COMPLIANT | config.js uses process.env, mock.js has no secrets |
| III.2 | Input Validation | ✅ N/A | No user input in RM-002 (read-only page) |
| III.3 | Least Privilege | ✅ COMPLIANT | No unnecessary WeChat permissions requested |
| III.4 | Secure by Default | ✅ COMPLIANT | HTTPS enforced by WeChat platform |

**Validation Method**: Manual code review + automated scans (Section 2.1)

---

### 8.2 WeChat Mini Program Security Guidelines

**Platform Security Features** (Automatic):
- HTTPS enforcement (all network requests)
- Content Security Policy (CSP)
- Sandbox isolation (no DOM access)
- Code signing (integrity verification)

**Developer Responsibilities** (RM-002 scope):
- [x] No hardcoded secrets or credentials
- [x] Use HTTPS for all external resources
- [x] Follow WeChat API best practices
- [x] Implement graceful error handling

---

## 9. Approval and Sign-Off

**Security Plan Status**: APPROVED ✅

**Approval Criteria**:
- [x] All sections completed (no placeholders)
- [x] Attack surface assessed (minimal risk)
- [x] OWASP Top 10 analysis completed (7 N/A, 3 mitigated)
- [x] Constitution Article III compliance validated
- [x] Security testing strategy defined
- [x] Quality gates specified (5 gates)
- [x] Risk register documented (5 risks, all mitigated/accepted)

**Next Steps**:
1. Implementation team proceeds with code changes (following guidelines in Section 3)
2. After implementation, security reviewer generates SECURITY_REPORT.md
3. Security reviewer validates all quality gates (Section 5)
4. If all gates pass, approve merge; if any gate fails, reject and require remediation

**Sign-Off**:
- Security Planner: Claude Code (security-reviewer agent)
- Date: 2025-01-21T18:00:00Z
- Status: APPROVED for implementation

---

**Generated by**: security-reviewer agent (Phase 1: Pre-Implementation)
**Template Version**: 1.0.0
**Constitution Version**: v2.0.0
**Based on**: PRD.md, TECH_DESIGN.md Section 5, Constitution Article III
**Next Step**: Implementation → Post-Implementation SECURITY_REPORT.md generation
