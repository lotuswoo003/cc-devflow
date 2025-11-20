# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**cc-devflow** is a comprehensive development workflow system built exclusively on Claude Code's sub-agents, hooks, and settings mechanisms. It provides a complete automated workflow from PRD generation to code delivery through slash commands.

## Architecture

### Execution Model: Dual-Layer System

**Research Agents (11 specialized agents)**:
- Read-only analysis and planning
- Output Markdown documents only
- No code execution privileges
- Tools: Read, Grep, Glob only

**Main Agent (Claude)**:
- Owns complete project context
- Executes all code modifications
- Coordinates research agents
- Tools: Edit, Write, Bash, Git

**Critical**: Research agents analyze and plan; main agent implements. Never bypass this separation.

### Sub-Agents

Located in `.claude/agents/`:
- `prd-writer` - PRD generation (uses PRD_TEMPLATE)
- `ui-designer` - HTML prototype generation
- `tech-architect` - Technical design (Anti-Tech-Creep enforcement)
- `planner` - EPIC & TASKS breakdown (uses EPIC_TEMPLATE, TASKS_TEMPLATE)
- `qa-tester` - Test plan + Test report (called twice: before and after implementation)
- `security-reviewer` - Security plan + Security report (called twice: before and after implementation)
- `consistency-checker` - Document and implementation verification
- `release-manager` - Release planning
- `bug-analyzer` - BUG analysis and fix strategy
- `impact-analyzer` - PRD change impact analysis
- `compatibility-checker` - Backward compatibility analysis

### Directory Structure

```
cc-devflow/
├── .claude/                      # Claude Code configuration (DO NOT MODIFY)
│   ├── agents/                   # Sub-agent definitions
│   ├── commands/                 # Slash commands (39 commands)
│   ├── constitution/             # Constitution System v2.0.0
│   ├── docs/templates/           # Self-executable templates
│   ├── guides/                   # Workflow and technical guides
│   ├── hooks/                    # PreToolUse, PostToolUse, UserPromptSubmit, Stop
│   ├── rules/                    # Core patterns and conventions
│   ├── scripts/                  # Unified infrastructure scripts
│   ├── skills/                   # Skills system
│   └── tests/                    # Test suites (100% coverage)
│
├── devflow/                      # Generated workspace (gitignored)
│   ├── ROADMAP.md                # Product roadmap (from /core-roadmap)
│   ├── ARCHITECTURE.md           # System architecture (from /core-architecture)
│   ├── BACKLOG.md                # Requirement backlog
│   └── requirements/REQ-XXX/     # Requirement workspaces
│       ├── PRD.md
│       ├── EPIC.md
│       ├── TASKS.md
│       ├── EXECUTION_LOG.md
│       ├── TEST_PLAN.md
│       ├── TEST_REPORT.md
│       ├── SECURITY_PLAN.md
│       ├── SECURITY_REPORT.md
│       └── RELEASE_PLAN.md
│
└── docs/                         # External documentation
    ├── commands/                 # Detailed command docs
    └── guides/                   # User guides
```

## Constitutional Governance (v2.0.0)

**Location**: `.claude/constitution/project-constitution.md`

All development MUST comply with 10 Constitutional Articles:

### Critical Articles

**Article I: Quality First**
- NO partial implementations (no TODOs, no placeholders)
- Complete implementation or no implementation
- Mandatory test coverage ≥80%

**Article IV: Test-First Development (TDD)**
- Tests MUST be written before implementation
- TEST VERIFICATION CHECKPOINT enforced in TASKS.md
- Tests must fail first, then pass

**Article VI: Anti-Abstraction**
- NO BaseController, AbstractService, GenericRepository
- Trust frameworks (Express, FastAPI) - use directly
- ONE model representation per entity

**Article VII: Simplicity Gate**
- Maximum 3 projects/modules per requirement
- No future-proofing abstractions
- YAGNI strictly enforced

**Article X: Requirement Boundary**
- Implement ONLY what's requested
- Mark ambiguities with [NEEDS CLARIFICATION]
- No speculative features

**Enforcement**:
```bash
# Validate Constitutional compliance
bash .claude/scripts/validate-constitution.sh
```

## Common Development Tasks

### Starting New Requirement Development

**One-Command Flow** (Complete PRD → Code → Test → Release):
```bash
/flow-new "REQ-123|User Authentication|https://docs.example.com/auth"
```

**Stage-by-Stage Flow**:
```bash
# Stage 1: Initialize requirement directory structure
/flow-init "REQ-123|User Authentication"

# Stage 2: Generate PRD from plan sources
/flow-prd "REQ-123"

# Stage 3: Generate EPIC and TASKS breakdown
/flow-epic "REQ-123"

# Stage 4: Execute development (TDD enforced)
/flow-dev "REQ-123"

# Stage 5: Quality assurance and security review
/flow-qa "REQ-123"

# Stage 6: Create PR and release
/flow-release "REQ-123"
```

### Project-Level Commands (Execute once per project)

```bash
# Generate product roadmap (6-stage interactive dialogue)
/core-roadmap

# Generate system architecture with 4 diagrams
/core-architecture

# Generate project guidelines (frontend/backend)
/core-guidelines
```

### Recovery and Status

```bash
# Resume interrupted development
/flow-restart "REQ-123"

# Check development progress
/flow-status REQ-123

# Verify document consistency
/flow-verify "REQ-123"
```

### Bug Fix Workflow

```bash
/flow-fix "BUG-001|Login returns 500 error"
```

## Testing

**Test Coverage**: 100% for all scripts

```bash
# Run all tests
bash .claude/tests/run-all-tests.sh --scripts

# Run specific test suite
bash .claude/tests/scripts/test_check_prerequisites.sh

# Run Constitution tests (38 tests)
bash .claude/tests/constitution/run_all_constitution_tests.sh
```

## Hooks System

**Location**: `.claude/hooks/`

Four hook types configured in `.claude/settings.json`:

1. **UserPromptSubmit**: Intelligently recommends relevant Skills
2. **PreToolUse**: Blocks non-compliant operations (TDD violations, hardcoded secrets)
3. **PostToolUse**: Automatically records file changes to EXECUTION_LOG.md
4. **Stop**: Provides error handling hints

**Skip Guardrails** (when necessary):
```bash
# Method 1: File marker
echo "@skip-tdd-check" >> devflow/requirements/REQ-123/TASKS.md

# Method 2: Environment variable
export SKIP_TDD_ENFORCER=1
```

## Key Scripts

Located in `.claude/scripts/`:

```bash
# Prerequisites validation
bash .claude/scripts/check-prerequisites.sh

# Task status management
bash .claude/scripts/check-task-status.sh --verbose
bash .claude/scripts/mark-task-complete.sh T001

# Constitution management
bash .claude/scripts/manage-constitution.sh show --article I

# Status reporting
bash .claude/scripts/generate-status-report.sh --format markdown

# Workflow recovery
bash .claude/scripts/recover-workflow.sh REQ-123
```

## Critical Workflows

### Standard Development Flow

**Phase 1: Research & Planning**
1. prd-writer → PRD.md (uses PRD_TEMPLATE)
2. ui-designer → UI_PROTOTYPE.html (conditional)
3. tech-architect → TECH_DESIGN.md
4. planner → EPIC.md + TASKS.md (uses EPIC_TEMPLATE, TASKS_TEMPLATE)

**Phase 2: Pre-Implementation Quality**
5. consistency-checker → CONSISTENCY_ANALYSIS.md
6. qa-tester → TEST_PLAN.md
7. security-reviewer → SECURITY_PLAN.md

**Phase 3: Implementation**
8. Main agent implements code based on TASKS.md (TDD order enforced)

**Phase 4: Post-Implementation Quality**
9. qa-tester → TEST_REPORT.md
10. security-reviewer → SECURITY_REPORT.md
11. consistency-checker → FINAL_CONSISTENCY_REPORT.md

**Phase 5: Release**
12. release-manager → RELEASE_PLAN.md
13. Main agent creates PR and manages release

### TDD Enforcement

**Mandatory Sequence in TASKS.md**:
```markdown
## User Story 1: User Authentication

### TEST TASKS
- [ ] T001: Write contract tests for /auth/login endpoint
- [ ] T002: Write integration tests for user authentication flow
- [ ] T003: Write unit tests for password hashing

### TEST VERIFICATION CHECKPOINT
→ ALL tests above MUST fail before proceeding

### IMPLEMENTATION TASKS
- [ ] T004: Implement /auth/login endpoint
- [ ] T005: Implement password hashing service
```

**Enforcement**: PreToolUse hook blocks IMPLEMENTATION tasks if TEST tasks incomplete.

### Quality Gates (Pre-Push Guard)

All code must pass before push:
```bash
# Automated via pre-push-guard.sh
- TypeScript type checking
- Test execution (coverage ≥80%)
- Linting (ESLint)
- Security scan
- Build validation
```

## Document Templates

**Location**: `.claude/docs/templates/`

All templates are **self-executable** and contain:
- YAML frontmatter with metadata
- Constitutional compliance checklists
- Phase gates (Phase -1: Simplicity, Anti-Abstraction, Integration-First)
- Structured sections with validation rules

**Critical Templates**:
- `PRD_TEMPLATE.md` - Anti-Expansion Rules enforcement
- `EPIC_TEMPLATE.md` - Phase -1 Gates (Simplicity, Anti-Abstraction, Integration-First)
- `TASKS_TEMPLATE.md` - TDD sequence enforcement
- `TECH_DESIGN_TEMPLATE.md` - Technical design structure
- `UI_PROTOTYPE_TEMPLATE.md` - Interactive HTML prototype

## Skills System

**Location**: `.claude/skills/`

Skills are auto-activated based on context:
- `cc-devflow-orchestrator` - Flow commands and process guidance
- `devflow-tdd-enforcer` - TDD order enforcement
- `constitution-guardian` - Real-time Constitution compliance
- `devflow-file-standards` - File naming and directory structure
- `skill-developer` - Skill development and Hook system

## Git & GitHub Operations

**Branch Naming**: `feature/${reqId}-${slug(title)}`

**Commit Format**:
```
feat(REQ-123): implement user authentication

- Add /auth/login endpoint
- Implement JWT token generation
- Add password hashing service

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
```

**PR Creation** (via /flow-release):
```bash
gh pr create --title "feat(REQ-123): User Authentication" --body "..."
```

## Critical Patterns

### Fail Fast Principle
```bash
# Validate inputs immediately
if [[ -z "$REQ_ID" ]]; then
    log_error "REQ_ID is required"
    exit 1
fi
```

### Clear Error Messages
```bash
log_error "Prerequisites check failed: Git repository required"
echo "HINT: Initialize git with 'git init' or run in existing repo"
```

### Minimal Output
- Only output essential information
- Use structured formats (JSON, YAML) for machine consumption
- Provide --verbose flag for detailed output

### Trust System
- Trust sub-agent outputs without re-validation
- Sub-agents are experts in their domains
- Main agent coordinates, not micromanages

## Environment Variables

```bash
# Flow behavior
export FLOW_AUTO_APPROVE=false
export MIN_TEST_COVERAGE=80
export STRICT_TYPE_CHECKING=true

# Guardrail skip
export SKIP_TDD_ENFORCER=1          # Skip TDD enforcement
export SKIP_CONSTITUTION_CHECK=1    # Skip Constitution validation
```

## Important Constraints

1. **Never modify .claude/ directory** - This is framework configuration
2. **Always work in devflow/requirements/** - Generated workspace
3. **Research agents analyze, main agent implements** - Separation of concerns
4. **Sequential execution** - Avoid parallel code modifications
5. **Constitution is supreme** - All rules derive from Constitution
6. **TDD is mandatory** - Tests before implementation, no exceptions
7. **No partial implementations** - Complete or nothing
8. **Document everything** - All decisions in Markdown

## Common Pitfalls

1. **DON'T**: Let research agents write code directly
   **DO**: Research agents output plans, main agent implements

2. **DON'T**: Skip TEST VERIFICATION CHECKPOINT
   **DO**: Verify all tests fail before implementing

3. **DON'T**: Add partial implementations or TODOs
   **DO**: Implement completely or defer to future requirement

4. **DON'T**: Create BaseController or AbstractService
   **DO**: Use Express/FastAPI directly

5. **DON'T**: Commit without running quality gates
   **DO**: Run `pre-push-guard.sh` before every commit

6. **DON'T**: Add speculative features
   **DO**: Implement ONLY what PRD specifies

## Verification Setup

```bash
# Verify installation
.claude/scripts/verify-setup.sh

# Check prerequisites
bash .claude/scripts/check-prerequisites.sh

# Validate Constitution compliance
bash .claude/scripts/validate-constitution.sh
```

## Resources

- **Constitution**: `.claude/constitution/project-constitution.md`
- **Flow Orchestrator**: `.claude/guides/workflow-guides/flow-orchestrator.md`
- **Git Guide**: `.claude/guides/technical-guides/git-github-guide.md`
- **Test Execution**: `.claude/guides/technical-guides/test-execution-guide.md`
- **Command Docs**: `docs/commands/`
- **Contributing**: `CONTRIBUTING.md`

---

**Remember**: This is a workflow system, not a code library. Use slash commands to trigger workflows. Research agents plan, main agent implements. Constitution is law.
