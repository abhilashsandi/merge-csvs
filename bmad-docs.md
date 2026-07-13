# BMad Method Documentation



## Source: https://docs.bmad-method.org/

[Skip to content](https://docs.bmad-method.org/#_top)

# Welcome to the BMad Method

The BMad Method ( **B** uild **M** ore **A** rchitect **D** reams) is an AI-driven development framework module within the BMad Method Ecosystem that helps you build software through the whole process from ideation and planning all the way through agentic implementation. It provides specialized AI agents, guided workflows, and intelligent planning that adapts to your project’s complexity, whether you’re fixing a bug or building an enterprise platform.

If you’re comfortable working with AI coding assistants like Claude, Cursor, or GitHub Copilot, you’re ready to get started.

## New Here? Start with a Tutorial

[Section titled “New Here? Start with a Tutorial”](https://docs.bmad-method.org/#new-here-start-with-a-tutorial)

The fastest way to understand BMad is to try it.

- **[Get Started with BMad](https://docs.bmad-method.org/tutorials/getting-started/)** — Install and understand how BMad works
- **[Workflow Map](https://docs.bmad-method.org/reference/workflow-map/)** — Visual overview of BMM phases, workflows, and context management

## How to Use These Docs

[Section titled “How to Use These Docs”](https://docs.bmad-method.org/#how-to-use-these-docs)

These docs are organized into four sections based on what you’re trying to do:

| Section | Purpose |
| --- | --- |
| **Tutorials** | Learning-oriented. Step-by-step guides that walk you through building something. Start here if you’re new. |
| **How-To Guides** | Task-oriented. Practical guides for solving specific problems. “How do I customize an agent?” lives here. |
| **Explanation** | Understanding-oriented. Deep dives into concepts and architecture. Read when you want to know _why_. |
| **Reference** | Information-oriented. Technical specifications for agents, workflows, and configuration. |

## Expand and Customize

[Section titled “Expand and Customize”](https://docs.bmad-method.org/#expand-and-customize)

Want to expand BMad with your own agents, workflows, or modules? The **[BMad Builder](https://bmad-builder-docs.bmad-method.org/)** provides the framework and tools for creating custom extensions, whether you’re adding new capabilities to BMad or building entirely new modules from scratch.

## What You’ll Need

[Section titled “What You’ll Need”](https://docs.bmad-method.org/#what-youll-need)

BMad works with any AI coding assistant that supports custom system prompts or project context. Popular options include:

- **[Claude Code](https://code.claude.com/)** — Anthropic’s CLI tool (recommended)
- **[Cursor](https://cursor.sh/)** — AI-first code editor
- **[Codex CLI](https://github.com/openai/codex)** — OpenAI’s terminal coding agent

You should be comfortable with basic software development concepts like version control, project structure, and agile workflows. No prior experience with BMad-style agent systems is required—that’s what these docs are for.

## Join the Community

[Section titled “Join the Community”](https://docs.bmad-method.org/#join-the-community)

Get help, share what you’re building, or contribute to BMad:

- **[Discord](https://discord.gg/gk8jAdXWmj)** — Chat with other BMad users, ask questions, share ideas
- **[GitHub](https://github.com/bmad-code-org/BMAD-METHOD)** — Source code, issues, and contributions
- **[YouTube](https://www.youtube.com/@BMadCode)** — Video tutorials and walkthroughs

## Next Step

[Section titled “Next Step”](https://docs.bmad-method.org/#next-step)

Ready to dive in? **[Get Started with BMad](https://docs.bmad-method.org/tutorials/getting-started/)** and build your first project.


## Source: https://docs.bmad-method.org/tutorials/getting-started/

[Skip to content](https://docs.bmad-method.org/tutorials/getting-started/#_top)

# Getting Started

Build software faster using AI-powered workflows with specialized agents that guide you through planning, architecture, and implementation.

## What You’ll Learn

[Section titled “What You’ll Learn”](https://docs.bmad-method.org/tutorials/getting-started/#what-youll-learn)

- Install and initialize BMad Method for a new project
- Use **BMad-Help** — your intelligent guide that knows what to do next
- Choose the right planning track for your project size
- Progress through phases from requirements to working code
- Use agents and workflows effectively

## Meet BMad-Help: Your Intelligent Guide

[Section titled “Meet BMad-Help: Your Intelligent Guide”](https://docs.bmad-method.org/tutorials/getting-started/#meet-bmad-help-your-intelligent-guide)

**BMad-Help is the fastest way to get started with BMad.** You don’t need to memorize workflows or phases — just ask, and BMad-Help will:

- **Inspect your project** to see what’s already been done
- **Show your options** based on which modules you have installed
- **Recommend what’s next** — including the first required task
- **Answer questions** like “I have a SaaS idea, where do I start?”

### How to Use BMad-Help

[Section titled “How to Use BMad-Help”](https://docs.bmad-method.org/tutorials/getting-started/#how-to-use-bmad-help)

Run it in your AI IDE by invoking the skill:

```
bmad-help
```

Or combine it with a question for context-aware guidance:

```
bmad-help I have an idea for a SaaS product, I already know all the features I want. where do I get started?
```

BMad-Help will respond with:

- What’s recommended for your situation
- What the first required task is
- What the rest of the process looks like

### It Powers Workflows Too

[Section titled “It Powers Workflows Too”](https://docs.bmad-method.org/tutorials/getting-started/#it-powers-workflows-too)

BMad-Help doesn’t just answer questions — **it automatically runs at the end of every workflow** to tell you exactly what to do next. No guessing, no searching docs — just clear guidance on the next required workflow.

## Understanding BMad

[Section titled “Understanding BMad”](https://docs.bmad-method.org/tutorials/getting-started/#understanding-bmad)

BMad helps you build software through guided workflows with specialized AI agents. The process follows four phases:

| Phase | Name | What Happens |
| --- | --- | --- |
| 1 | Analysis | Brainstorming, research, forge idea, product brief or PRFAQ _(optional)_ |
| 2 | Planning | Create requirements and design PRD, UX, SPEC |
| 3 | Solutioning | Design architecture spine or detailed project or system architectures |
| 4 | Implementation | Build epic by epic, story by story with quick dev or automated epic delivery |

**[Open the Workflow Map](https://docs.bmad-method.org/reference/workflow-map/)** to explore phases, workflows, and context management.

Based on your project’s complexity, BMad offers three planning tracks:

| Track | Best For | Documents Created |
| --- | --- | --- |
| **Quick Flow** | Bug fixes, simple features, clear scope (1-15 stories) | Tech-spec only |
| **BMad Method** | Products, platforms, complex features (10-50+ stories) | PRD + Architecture + UX |
| **Enterprise** | Compliance, multi-tenant systems (30+ stories) | PRD + Architecture + Security + DevOps |

## Installation

[Section titled “Installation”](https://docs.bmad-method.org/tutorials/getting-started/#installation)

Open a terminal in your project directory and run:

```
npx bmad-method install
```

If you want the newest prerelease build instead of the default release channel, use `npx bmad-method@next install`.

When prompted to select modules, choose **BMad Method**.

The installer creates two folders:

- `_bmad/` — agents, workflows, tasks, and configuration
- `_bmad-output/` — empty for now, but this is where your artifacts will be saved

## Step 1: Create Your Plan

[Section titled “Step 1: Create Your Plan”](https://docs.bmad-method.org/tutorials/getting-started/#step-1-create-your-plan)

Work through phases 1-3. **Use fresh chats for each workflow.**

### Phase 1: Analysis (Optional)

[Section titled “Phase 1: Analysis (Optional)”](https://docs.bmad-method.org/tutorials/getting-started/#phase-1-analysis-optional)

All workflows in this phase are optional. [**Not sure which to use?**](https://docs.bmad-method.org/explanation/analysis-phase/)

- **brainstorming** (`bmad-brainstorming`) — Guided ideation
- **forge-idea** (`bmad-forge-idea`) — Pressure-test an idea until it hardens or dies cheaply
- **research** (`bmad-market-research` / `bmad-domain-research` / `bmad-technical-research`) — Market, domain, and technical research
- **product-brief** (`bmad-product-brief`) — Recommended foundation document when your concept is clear
- **prfaq** (`bmad-prfaq`) — Working Backwards challenge to stress-test your product concept customer-first

### Phase 2: Planning (Required)

[Section titled “Phase 2: Planning (Required)”](https://docs.bmad-method.org/tutorials/getting-started/#phase-2-planning-required)

**For BMad Method and Enterprise tracks:**

1. Run `bmad-prd` in a new chat — state your intent (Create / Update / Validate) or let the skill ask
2. Output: `prd.md`, `addendum.md`, `.memlog.md`

**For Quick Flow track:**

- Run `bmad-quick-dev` — it handles planning and implementation in a single workflow, skip to implementation

### Phase 3: Solutioning (BMad Method/Enterprise)

[Section titled “Phase 3: Solutioning (BMad Method/Enterprise)”](https://docs.bmad-method.org/tutorials/getting-started/#phase-3-solutioning-bmad-methodenterprise)

**Create Architecture**

1. Invoke the **Architect agent** (`bmad-agent-architect`) in a new chat
2. Run `bmad-create-architecture` (`bmad-create-architecture`)
3. Output: Architecture document with technical decisions

**Create Epics and Stories**

1. Invoke the **PM agent** (`bmad-agent-pm`) in a new chat
2. Run `bmad-create-epics-and-stories` (`bmad-create-epics-and-stories`)
3. The workflow uses both PRD and Architecture to create technically-informed stories

**Implementation Readiness Check** _(Highly Recommended)_

1. Invoke the **Architect agent** (`bmad-agent-architect`) in a new chat
2. Run `bmad-check-implementation-readiness` (`bmad-check-implementation-readiness`)
3. Validates cohesion across all planning documents

## Step 2: Build Your Project

[Section titled “Step 2: Build Your Project”](https://docs.bmad-method.org/tutorials/getting-started/#step-2-build-your-project)

Once planning is complete, move to implementation. **Each workflow should run in a fresh chat.**

### Initialize Sprint Planning

[Section titled “Initialize Sprint Planning”](https://docs.bmad-method.org/tutorials/getting-started/#initialize-sprint-planning)

Invoke the **Developer agent** (`bmad-agent-dev`) and run `bmad-sprint-planning` (`bmad-sprint-planning`). This creates `sprint-status.yaml` to track all epics and stories.

### The Build Cycle

[Section titled “The Build Cycle”](https://docs.bmad-method.org/tutorials/getting-started/#the-build-cycle)

For each story, repeat this cycle with fresh chats:

| Step | Agent | Workflow | Command | Purpose |
| --- | --- | --- | --- | --- |
| 1 | DEV | `bmad-create-story` | `bmad-create-story` | Create story file from epic |
| 2 | DEV | `bmad-dev-story` | `bmad-dev-story` | Implement the story |
| 3 | DEV | `bmad-code-review` | `bmad-code-review` | Quality validation _(recommended)_ |

After completing all stories in an epic, invoke the **Developer agent** (`bmad-agent-dev`) and run `bmad-retrospective` (`bmad-retrospective`).

## What You’ve Accomplished

[Section titled “What You’ve Accomplished”](https://docs.bmad-method.org/tutorials/getting-started/#what-youve-accomplished)

You’ve learned the foundation of building with BMad:

- Installed BMad and configured it for your IDE
- Initialized a project with your chosen planning track
- Created planning documents (PRD, Architecture, Epics & Stories)
- Understood the build cycle for implementation

Your project now has:

```
your-project/

├── _bmad/                                   # BMad configuration

├── _bmad-output/

│   ├── planning-artifacts/

│   │   ├── PRD.md                           # Your requirements document

│   │   ├── architecture.md                  # Technical decisions

│   │   └── epics/                           # Epic and story files

│   ├── implementation-artifacts/

│   │   └── sprint-status.yaml               # Sprint tracking

│   └── project-context.md                   # Implementation rules (optional)

└── ...
```

## Quick Reference

[Section titled “Quick Reference”](https://docs.bmad-method.org/tutorials/getting-started/#quick-reference)

| Workflow | Command | Agent | Purpose |
| --- | --- | --- | --- |
| **`bmad-help`** ⭐ | `bmad-help` | Any | **Your intelligent guide — ask anything!** |
| `bmad-prd` | `bmad-prd` | Any | Create, update, or validate a PRD |
| `bmad-create-architecture` | `bmad-create-architecture` | Architect | Create architecture document |
| `bmad-generate-project-context` | `bmad-generate-project-context` | Analyst | Create project context file |
| `bmad-create-epics-and-stories` | `bmad-create-epics-and-stories` | PM | Break down PRD into epics |
| `bmad-check-implementation-readiness` | `bmad-check-implementation-readiness` | Architect | Validate planning cohesion |
| `bmad-sprint-planning` | `bmad-sprint-planning` | DEV | Initialize sprint tracking |
| `bmad-create-story` | `bmad-create-story` | DEV | Create a story file |
| `bmad-dev-story` | `bmad-dev-story` | DEV | Implement a story |
| `bmad-code-review` | `bmad-code-review` | DEV | Review implemented code |

## Common Questions

[Section titled “Common Questions”](https://docs.bmad-method.org/tutorials/getting-started/#common-questions)

**Do I always need architecture?**
Only for BMad Method and Enterprise tracks. Quick Flow skips from spec to implementation.

**Can I change my plan later?**
Yes. The `bmad-correct-course` workflow handles scope changes mid-implementation.

**What if I want to brainstorm first?**
Invoke the Analyst agent (`bmad-agent-analyst`) and run `bmad-brainstorming` (`bmad-brainstorming`) before starting your PRD.

**Do I need to follow a strict order?**
Not strictly. Once you learn the flow, you can run workflows directly using the Quick Reference above.

## Getting Help

[Section titled “Getting Help”](https://docs.bmad-method.org/tutorials/getting-started/#getting-help)

- **During workflows** — Agents guide you with questions and explanations
- **Community** — [Discord](https://discord.gg/gk8jAdXWmj) (#bmad-method-help, #report-bugs-and-issues)

## Key Takeaways

[Section titled “Key Takeaways”](https://docs.bmad-method.org/tutorials/getting-started/#key-takeaways)

Ready to start? Install BMad, invoke `bmad-help`, and let your intelligent guide lead the way.


## Source: https://docs.bmad-method.org/how-to/upgrade-to-v6/

[Skip to content](https://docs.bmad-method.org/how-to/upgrade-to-v6/#_top)

# How to Upgrade to v6

Use the BMad installer to upgrade from v4 to v6, which includes automatic detection of legacy installations and migration assistance.

## When to Use This

[Section titled “When to Use This”](https://docs.bmad-method.org/how-to/upgrade-to-v6/#when-to-use-this)

- You have BMad v4 installed (`.bmad-method` folder)
- You want to migrate to the new v6 architecture
- You have existing planning artifacts to preserve

## Steps

[Section titled “Steps”](https://docs.bmad-method.org/how-to/upgrade-to-v6/#steps)

### 1\. Run the Installer

[Section titled “1. Run the Installer”](https://docs.bmad-method.org/how-to/upgrade-to-v6/#1-run-the-installer)

Follow the [Installer Instructions](https://docs.bmad-method.org/how-to/install-bmad/).

### 2\. Handle Legacy Installation

[Section titled “2. Handle Legacy Installation”](https://docs.bmad-method.org/how-to/upgrade-to-v6/#2-handle-legacy-installation)

When v4 is detected, you can:

- Allow the installer to back up and remove `.bmad-method`
- Exit and handle cleanup manually

If you named your bmad method folder something else - you will need to manually remove the folder yourself.

### 3\. Clean Up IDE Skills

[Section titled “3. Clean Up IDE Skills”](https://docs.bmad-method.org/how-to/upgrade-to-v6/#3-clean-up-ide-skills)

Manually remove legacy v4 IDE commands/skills - for example if you have Claude Code, look for any nested folders that start with bmad and remove them:

- `.claude/commands/`

The new v6 skills are installed to:

- `.claude/skills/`

### 4\. Migrate Planning Artifacts

[Section titled “4. Migrate Planning Artifacts”](https://docs.bmad-method.org/how-to/upgrade-to-v6/#4-migrate-planning-artifacts)

**If you have planning documents (Brief/PRD/UX/Architecture):**

Move them to `_bmad-output/planning-artifacts/` with descriptive names:

- Include `PRD` in filename for PRD documents
- Include `brief`, `architecture`, or `ux-design` accordingly
- Sharded documents can be in named subfolders

**If you’re mid-planning:** Consider restarting with v6 workflows. Use your existing documents as inputs—the new progressive discovery workflows with web search and IDE plan mode produce better results.

### 5\. Migrate In-Progress Development

[Section titled “5. Migrate In-Progress Development”](https://docs.bmad-method.org/how-to/upgrade-to-v6/#5-migrate-in-progress-development)

If you have stories created or implemented:

1. Complete the v6 installation
2. Place `epics.md` or `epics/epic*.md` in `_bmad-output/planning-artifacts/`
3. Run the Developer’s `bmad-sprint-planning` workflow
4. Tell the agent which epics/stories are already complete

## What You Get

[Section titled “What You Get”](https://docs.bmad-method.org/how-to/upgrade-to-v6/#what-you-get)

**v6 unified structure:**

```
your-project/

├── _bmad/               # Single installation folder

│   ├── _config/         # Your customizations

│   │   └── agents/      # Agent customization files

│   ├── core/            # Universal core framework

│   ├── bmm/             # BMad Method module

│   ├── bmb/             # BMad Builder

│   └── cis/             # Creative Intelligence Suite

└── _bmad-output/        # Output folder (was doc folder in v4)
```

## Module Migration

[Section titled “Module Migration”](https://docs.bmad-method.org/how-to/upgrade-to-v6/#module-migration)

| v4 Module | v6 Status |
| --- | --- |
| `.bmad-2d-phaser-game-dev` | Integrated into BMGD Module |
| `.bmad-2d-unity-game-dev` | Integrated into BMGD Module |
| `.bmad-godot-game-dev` | Integrated into BMGD Module |
| `.bmad-infrastructure-devops` | Deprecated — new DevOps agent coming soon |
| `.bmad-creative-writing` | Not adapted — new v6 module coming soon |

## Key Changes

[Section titled “Key Changes”](https://docs.bmad-method.org/how-to/upgrade-to-v6/#key-changes)

| Concept | v4 | v6 |
| --- | --- | --- |
| **Core** | `_bmad-core` was actually BMad Method | `_bmad/core/` is universal framework |
| **Method** | `_bmad-method` | `_bmad/bmm/` |
| **Config** | Modified files directly | `config.yaml` per module |
| **Documents** | Sharded or unsharded required setup | Fully flexible, auto-scanned |


## Source: https://docs.bmad-method.org/how-to/get-answers-about-bmad/

[Skip to content](https://docs.bmad-method.org/how-to/get-answers-about-bmad/#_top)

# How to Get Answers About BMad

Use BMad’s built-in help, source docs, or the community to get answers — from quickest to most thorough.

## 1\. Ask BMad-Help

[Section titled “1. Ask BMad-Help”](https://docs.bmad-method.org/how-to/get-answers-about-bmad/#1-ask-bmad-help)

The fastest way to get answers. The `bmad-help` skill is available directly in your AI session and handles over 80% of questions — it inspects your project, sees what you’ve completed, and tells you what to do next.

```
bmad-help I have a SaaS idea and know all the features. Where do I start?

bmad-help What are my options for UX design?

bmad-help I'm stuck on the PRD workflow
```

## 2\. Go Deeper with Source

[Section titled “2. Go Deeper with Source”](https://docs.bmad-method.org/how-to/get-answers-about-bmad/#2-go-deeper-with-source)

BMad-Help draws on your installed configuration. For questions about BMad’s internals, history, or architecture — or if you’re researching BMad before installing — point your AI at the source directly.

Clone or open the [BMAD-METHOD repo](https://github.com/bmad-code-org/BMAD-METHOD) and ask your AI about it. Any agent-capable tool (Claude Code, Cursor, Windsurf, etc.) can read the source and answer questions directly.

**Tips for better answers:**

- **Be specific** — “What does step 3 of the PRD workflow do?” beats “How does PRD work?”
- **Verify surprising claims** — LLMs occasionally get things wrong. Check the source file or ask on Discord.

### Not using an agent? Use the docs site

[Section titled “Not using an agent? Use the docs site”](https://docs.bmad-method.org/how-to/get-answers-about-bmad/#not-using-an-agent-use-the-docs-site)

If your AI can’t read local files (ChatGPT, Claude.ai, etc.), fetch [llms-full.txt](https://bmad-code-org.github.io/BMAD-METHOD/llms-full.txt) into your session — it’s a single-file snapshot of the BMad documentation.

## 3\. Ask Someone

[Section titled “3. Ask Someone”](https://docs.bmad-method.org/how-to/get-answers-about-bmad/#3-ask-someone)

If neither BMad-Help nor the source answered your question, you now have a much better question to ask.

| Channel | Use For |
| --- | --- |
| `help-requests` forum | Questions |
| `#suggestions-feedback` | Ideas and feature requests |

**Discord:** [discord.gg/gk8jAdXWmj](https://discord.gg/gk8jAdXWmj)

**GitHub Issues:** [github.com/bmad-code-org/BMAD-METHOD/issues](https://github.com/bmad-code-org/BMAD-METHOD/issues) _You!_ _Stuck_ _in the queue—_ _waiting_ _for who?_

_The source_ _is there,_ _plain to see!_

_Point_ _your machine._ _Set it free._

_It reads._ _It speaks._ _Ask away—_

_Why wait_ _for tomorrow_ _when you have_ _today?_

_—Claude_


## Source: https://docs.bmad-method.org/how-to/quick-fixes/

[Skip to content](https://docs.bmad-method.org/how-to/quick-fixes/#_top)

# Quick Fixes

Use **Quick Dev** for bug fixes, refactorings, or small targeted changes that don’t require the full BMad Method.

## When to Use This

[Section titled “When to Use This”](https://docs.bmad-method.org/how-to/quick-fixes/#when-to-use-this)

- Bug fixes with a clear, known cause
- Small refactorings (rename, extract, restructure) contained within a few files
- Minor feature tweaks or configuration changes
- Dependency updates

## Steps

[Section titled “Steps”](https://docs.bmad-method.org/how-to/quick-fixes/#steps)

### 1\. Start a Fresh Chat

[Section titled “1. Start a Fresh Chat”](https://docs.bmad-method.org/how-to/quick-fixes/#1-start-a-fresh-chat)

Open a **fresh chat session** in your AI IDE. Reusing a session from a previous workflow can cause context conflicts.

### 2\. Give It Your Intent

[Section titled “2. Give It Your Intent”](https://docs.bmad-method.org/how-to/quick-fixes/#2-give-it-your-intent)

Quick Dev accepts free-form intent — before, with, or after the invocation. Examples:

```
run quick-dev — Fix the login validation bug that allows empty passwords.
```

```
run quick-dev — fix https://github.com/org/repo/issues/42
```

```
run quick-dev — implement the intent in _bmad-output/implementation-artifacts/my-intent.md
```

```
I think the problem is in the auth middleware, it's not checking token expiry.

Let me look at it... yeah, src/auth/middleware.ts line 47 skips

the exp check entirely. run quick-dev
```

```
run quick-dev

> What would you like to do?

Refactor UserService to use async/await instead of callbacks.
```

Plain text, file paths, GitHub issue URLs, bug tracker links — anything the LLM can resolve to a concrete intent.

### 3\. Answer Questions and Approve

[Section titled “3. Answer Questions and Approve”](https://docs.bmad-method.org/how-to/quick-fixes/#3-answer-questions-and-approve)

Quick Dev may ask clarifying questions or present a short spec for your approval before implementing. Answer its questions and approve when you’re satisfied with the plan.

### 4\. Review and Push

[Section titled “4. Review and Push”](https://docs.bmad-method.org/how-to/quick-fixes/#4-review-and-push)

Quick Dev implements the change, reviews its own work, patches issues, and commits locally. When it’s done, it opens the affected files in your editor.

- Skim the diff to confirm the change matches your intent
- If something looks off, tell the agent what to fix — it can iterate in the same session

Once satisfied, push the commit. Quick Dev will offer to push and create a PR for you.

## What You Get

[Section titled “What You Get”](https://docs.bmad-method.org/how-to/quick-fixes/#what-you-get)

- Modified source files with the fix or refactoring applied
- Passing tests (if your project has a test suite)
- A ready-to-push commit with a conventional commit message

## Deferred Work

[Section titled “Deferred Work”](https://docs.bmad-method.org/how-to/quick-fixes/#deferred-work)

Quick Dev keeps each run focused on a single goal. If your request contains multiple independent goals, or if the review surfaces pre-existing issues unrelated to your change, Quick Dev defers them to a file (`deferred-work.md` in your implementation artifacts directory) rather than trying to tackle everything at once.

Check this file after a run — it’s your backlog of things to come back to. Each deferred item can be fed into a fresh Quick Dev run later.

## When to Upgrade to Formal Planning

[Section titled “When to Upgrade to Formal Planning”](https://docs.bmad-method.org/how-to/quick-fixes/#when-to-upgrade-to-formal-planning)

Consider using the full BMad Method when:

- The change affects multiple systems or requires coordinated updates across many files
- You are unsure about the scope and need requirements discovery first
- You need documentation or architectural decisions recorded for the team

See [Quick Dev](https://docs.bmad-method.org/explanation/quick-dev/) for more on how Quick Dev fits into the BMad Method.


## Source: https://docs.bmad-method.org/how-to/established-projects/

[Skip to content](https://docs.bmad-method.org/how-to/established-projects/#_top)

# Established Projects

Use BMad Method effectively when working on existing projects and legacy codebases.

This guide covers the essential workflow for onboarding to existing projects with BMad Method.

## Step 1: Clean Up Completed Planning Artifacts

[Section titled “Step 1: Clean Up Completed Planning Artifacts”](https://docs.bmad-method.org/how-to/established-projects/#step-1-clean-up-completed-planning-artifacts)

If you have completed all PRD epics and stories through the BMad process, clean up those files. Archive them, delete them, or rely on version history if needed. Do not keep these files in:

- `docs/`
- `_bmad-output/planning-artifacts/`
- `_bmad-output/implementation-artifacts/`

## Step 2: Create Project Context

[Section titled “Step 2: Create Project Context”](https://docs.bmad-method.org/how-to/established-projects/#step-2-create-project-context)

Run the generate project context workflow:

```
bmad-generate-project-context
```

This scans your codebase to identify:

- Technology stack and versions
- Code organization patterns
- Naming conventions
- Testing approaches
- Framework-specific patterns

You can review and refine the generated file, or create it manually at `_bmad-output/project-context.md` if you prefer.

[Learn more about project context](https://docs.bmad-method.org/explanation/project-context/)

## Step 3: Maintain Quality Project Documentation

[Section titled “Step 3: Maintain Quality Project Documentation”](https://docs.bmad-method.org/how-to/established-projects/#step-3-maintain-quality-project-documentation)

Your `docs/` folder should contain succinct, well-organized documentation that accurately represents your project:

- Intent and business rationale
- Business rules
- Architecture
- Any other relevant project information

For complex projects, consider using the `bmad-document-project` workflow. It offers runtime variants that will scan your entire project and document its actual current state.

## Step 3: Get Help

[Section titled “Step 3: Get Help”](https://docs.bmad-method.org/how-to/established-projects/#step-3-get-help)

### BMad-Help: Your Starting Point

[Section titled “BMad-Help: Your Starting Point”](https://docs.bmad-method.org/how-to/established-projects/#bmad-help-your-starting-point)

**Run `bmad-help` anytime you’re unsure what to do next.** This intelligent guide:

- Inspects your project to see what’s already been done
- Shows options based on your installed modules
- Understands natural language queries

```
bmad-help I have an existing Rails app, where should I start?

bmad-help What's the difference between quick-flow and full method?

bmad-help Show me what workflows are available
```

BMad-Help also **automatically runs at the end of every workflow**, providing clear guidance on exactly what to do next.

### Choosing Your Approach

[Section titled “Choosing Your Approach”](https://docs.bmad-method.org/how-to/established-projects/#choosing-your-approach)

You have two primary options depending on the scope of changes:

| Scope | Recommended Approach |
| --- | --- |
| **Small updates or additions** | Run `bmad-quick-dev` to clarify intent, plan, implement, and review in a single workflow. The full four-phase BMad Method is likely overkill. |
| **Major changes or additions** | Start with the BMad Method, applying as much or as little rigor as needed. |

### During PRD Creation

[Section titled “During PRD Creation”](https://docs.bmad-method.org/how-to/established-projects/#during-prd-creation)

When creating a brief or jumping directly into the PRD, ensure the agent:

- Finds and analyzes your existing project documentation
- Reads the proper context about your current system

You can guide the agent explicitly, but the goal is to ensure the new feature integrates well with your existing system.

### UX Considerations

[Section titled “UX Considerations”](https://docs.bmad-method.org/how-to/established-projects/#ux-considerations)

UX work is optional. The decision depends not on whether your project has a UX, but on:

- Whether you will be working on UX changes
- Whether significant new UX designs or patterns are needed

If your changes amount to simple updates to existing screens you are happy with, a full UX process is unnecessary.

### Architecture Considerations

[Section titled “Architecture Considerations”](https://docs.bmad-method.org/how-to/established-projects/#architecture-considerations)

When doing architecture, ensure the architect:

- Uses the proper documented files
- Scans the existing codebase

Pay close attention here to prevent reinventing the wheel or making decisions that misalign with your existing architecture.

## More Information

[Section titled “More Information”](https://docs.bmad-method.org/how-to/established-projects/#more-information)

- **[Quick Fixes](https://docs.bmad-method.org/how-to/quick-fixes/)** \- Bug fixes and ad-hoc changes
- **[Established Projects FAQ](https://docs.bmad-method.org/explanation/established-projects-faq/)** \- Common questions about working on established projects


## Source: https://docs.bmad-method.org/how-to/customize-bmad/

[Skip to content](https://docs.bmad-method.org/how-to/customize-bmad/#_top)

# How to Customize BMad

Tailor agent personas, inject domain context, add capabilities, and configure workflow behavior — all without modifying installed files. Your customizations survive every update.

## When to Use This

[Section titled “When to Use This”](https://docs.bmad-method.org/how-to/customize-bmad/#when-to-use-this)

- You want to change an agent’s personality or communication style
- You need to give an agent persistent facts to recall (e.g. “our org is AWS-only”)
- You want to add procedural startup steps the agent must run every session
- You want to add custom menu items that trigger your own skills or prompts
- Your team needs shared customizations committed to git, with personal preferences layered on top

## How It Works

[Section titled “How It Works”](https://docs.bmad-method.org/how-to/customize-bmad/#how-it-works)

Every customizable skill ships a `customize.toml` file with its defaults. This file defines the skill’s complete customization surface — read it to see what’s customizable. You never edit this file. Instead, you create sparse override files containing only the fields you want to change.

### Three-Layer Override Model

[Section titled “Three-Layer Override Model”](https://docs.bmad-method.org/how-to/customize-bmad/#three-layer-override-model)

```
Priority 1 (wins): _bmad/custom/{skill-name}.user.toml  (personal, gitignored)

Priority 2:        _bmad/custom/{skill-name}.toml        (team/org, committed)

Priority 3 (last): skill's own customize.toml                    (defaults)
```

The `_bmad/custom/` folder starts empty. Files only appear when someone actively customizes.

### Merge Rules (by shape, not by field name)

[Section titled “Merge Rules (by shape, not by field name)”](https://docs.bmad-method.org/how-to/customize-bmad/#merge-rules-by-shape-not-by-field-name)

The resolver applies four structural rules. Field names are never special-cased — behavior is determined purely by the value’s shape:

| Shape | Rule |
| --- | --- |
| Scalar (string, int, bool, float) | Override wins |
| Table | Deep merge (recursively apply these rules) |
| Array of tables where every item shares the **same** identifier field (every item has `code`, or every item has `id`) | Merge by that key — matching keys **replace in place**, new keys **append** |
| Any other array (scalars; tables with no identifier; arrays that mix `code` and `id` across items) | **Append** — base items first, then team items, then user items |

**No removal mechanism.** Overrides cannot delete base items. If you need to suppress a default menu item, override it by `code` with a no-op description or prompt. If you need to restructure an array more deeply, fork the skill.

**The `code` / `id` convention.** BMad uses `code` (short identifier like `"BP"` or `"R1"`) and `id` (longer stable identifier) as merge keys on arrays of tables. If you author a custom array-of-tables that should be replaceable-by-key rather than append-only, pick **one** convention (either `code` on every item, or `id` on every item) and stick with it across the whole array. Mixing `code` on some items and `id` on others falls back to append — the resolver won’t guess which key to merge on.

### Some agent fields are read-only

[Section titled “Some agent fields are read-only”](https://docs.bmad-method.org/how-to/customize-bmad/#some-agent-fields-are-read-only)

`agent.name` and `agent.title` live in `customize.toml` as source-of-truth metadata, but the agent’s SKILL.md doesn’t read them at runtime — they’re hardcoded identity. Putting `name = "Bob"` in an override file has no effect. If you genuinely need a different-named agent, copy the skill folder, rename it, and ship it as a custom skill.

## Steps

[Section titled “Steps”](https://docs.bmad-method.org/how-to/customize-bmad/#steps)

### 1\. Find the Skill’s Customization Surface

[Section titled “1. Find the Skill’s Customization Surface”](https://docs.bmad-method.org/how-to/customize-bmad/#1-find-the-skills-customization-surface)

Look at the skill’s `customize.toml` in its installed directory. For example, the PM agent:

```
.claude/skills/bmad-agent-pm/customize.toml
```

(Path varies by IDE — Cursor uses `.cursor/skills/`, Cline uses `.cline/skills/`, and so on.)

This file is the canonical schema. Every field you see is customizable (excluding the read-only identity fields noted above).

### 2\. Create Your Override File

[Section titled “2. Create Your Override File”](https://docs.bmad-method.org/how-to/customize-bmad/#2-create-your-override-file)

Create the `_bmad/custom/` directory in your project root if it doesn’t exist. Then create a file named after the skill:

```
_bmad/custom/

  bmad-agent-pm.toml        # team overrides (committed to git)

  bmad-agent-pm.user.toml   # personal preferences (gitignored)
```

**Example — changing the icon and adding one principle**:

```
# Just the fields I'm changing. Everything else inherits.

[agent]

icon = "🏥"

principles = [\
\
  "Ship nothing that can't pass an FDA audit.",\
\
]
```

This appends the new principle to the defaults (leaving the shipped principles intact) and replaces the icon. Every other field stays as shipped.

### 3\. Customize What You Need

[Section titled “3. Customize What You Need”](https://docs.bmad-method.org/how-to/customize-bmad/#3-customize-what-you-need)

All examples below assume BMad’s flat agent schema. Fields live directly under `[agent]` — no nested `metadata` or `persona` sub-tables.

**Scalars (icon, role, identity, communication\_style).** Scalar overrides win. You only need to set the fields you’re changing:

```
[agent]

icon = "🏥"

role = "Drives product discovery for a regulated healthcare domain."

communication_style = "Precise, regulatory-aware, asks compliance-shaped questions early."
```

**Persistent facts, principles, activation hooks (append arrays).** All four arrays below are append-only. Team items run after defaults, user items run last.

```
[agent]

# Static facts the agent keeps in mind the whole session — org rules, domain

# constants, user preferences. Distinct from the runtime memory sidecar.

#

# Each entry is either a literal sentence, or a `file:` reference whose

# contents are loaded as facts (glob patterns supported).

persistent_facts = [\
\
  "Our org is AWS-only -- do not propose GCP or Azure.",\
\
  "All PRDs require legal sign-off before engineering kickoff.",\
\
  "Target users are clinicians, not patients -- frame examples accordingly.",\
\
  "file:{project-root}/docs/compliance/hipaa-overview.md",\
\
  "file:{project-root}/_bmad/custom/company-glossary.md",\
\
]

# Adds to the agent's value system

principles = [\
\
  "Ship nothing that can't pass an FDA audit.",\
\
  "User value first, compliance always.",\
\
]

# Runs BEFORE the standard activation (persona, persistent_facts, config, greet).

# Use for pre-flight loads, compliance checks, anything that needs to be in

# context before the agent introduces itself.

activation_steps_prepend = [\
\
  "Scan {project-root}/docs/compliance/ and load any HIPAA-related documents as context.",\
\
]

# Runs AFTER greet, BEFORE the menu. Use for context-heavy setup that should

# happen once the user has been acknowledged.

activation_steps_append = [\
\
  "Read {project-root}/_bmad/custom/company-glossary.md if it exists.",\
\
]
```

**The two hooks do different jobs.** Prepend runs before greeting so the agent can load context it needs to personalize the greeting itself. Append runs after greeting so the user isn’t staring at a blank terminal while heavy scans complete.

**Menu customization (merge by `code`).** The menu is an array of tables. Each item has a `code` field (BMad convention), so the resolver merges by code: matching codes replace in place, new codes append.

TOML array-of-tables syntax uses `[[agent.menu]]` for each item:

```
# Replace the existing CE item with a custom skill

[[agent.menu]]

code = "CE"

description = "Create Epics using our delivery framework"

skill = "custom-create-epics"

# Add a new item (code RC doesn't exist in defaults)

[[agent.menu]]

code = "RC"

description = "Run compliance pre-check"

prompt = """

Read {project-root}/_bmad/custom/compliance-checklist.md

and scan all documents in {planning_artifacts} against it.

Report any gaps and cite the relevant regulatory section.

"""
```

Each menu item has exactly one of `skill` (invokes a registered skill) or `prompt` (executes the text directly). Items not listed in your override keep their defaults.

**Referencing files.** When a field’s text needs to point at a file (in `persistent_facts`, `activation_steps_prepend`/`activation_steps_append`, or a menu item’s `prompt`), use a full path rooted at `{project-root}`. Even if the file sits next to your override in `_bmad/custom/`, spell out the full path: `{project-root}/_bmad/custom/info.md`. The agent resolves `{project-root}` at runtime.

### 4\. Personal vs Team

[Section titled “4. Personal vs Team”](https://docs.bmad-method.org/how-to/customize-bmad/#4-personal-vs-team)

**Team file** (`bmad-agent-pm.toml`): Committed to git. Shared across the org. Use for compliance rules, company persona, custom capabilities.

**Personal file** (`bmad-agent-pm.user.toml`): Gitignored automatically. Use for tone adjustments, personal workflow preferences, and private facts the agent should keep in mind.

```
[agent]

persistent_facts = [\
\
  "Always include a rough complexity estimate (low/medium/high) when presenting options.",\
\
]
```

## How Resolution Works

[Section titled “How Resolution Works”](https://docs.bmad-method.org/how-to/customize-bmad/#how-resolution-works)

On activation, the agent’s SKILL.md runs a shared Python script that does the three-layer merge and returns the resolved block as JSON. The script uses only the Python standard library’s `tomllib` module (no external dependencies). BMad is standardizing on `uv run` to invoke these scripts (uv provisions a suitable Python for you); a plain `python3` still works during the transition:

```
uv run {project-root}/_bmad/scripts/resolve_customization.py \

  --skill {skill-root} \

  --key agent
```

**Requirements**: Python 3.11+ (earlier versions don’t include `tomllib`); nothing to `pip install`. Running via `uv run` is the going-forward standard — uv resolves a suitable interpreter for you. If you run it with `python3` directly during the transition, check your version with `python3 --version`: some platforms (macOS without Homebrew, Ubuntu 22.04) default `python3` to 3.10 or earlier, so you may need to install 3.11+ separately.

`--skill` points at the skill’s installed directory (where `customize.toml` lives). The skill name is derived from the directory’s basename, and the script looks up `_bmad/custom/{skill-name}.toml` and `{skill-name}.user.toml` automatically.

Useful invocations:

```
# Resolve the full agent block

uv run {project-root}/_bmad/scripts/resolve_customization.py \

  --skill /abs/path/to/bmad-agent-pm \

  --key agent

# Resolve a single field

uv run {project-root}/_bmad/scripts/resolve_customization.py \

  --skill /abs/path/to/bmad-agent-pm \

  --key agent.icon

# Full dump

uv run {project-root}/_bmad/scripts/resolve_customization.py \

  --skill /abs/path/to/bmad-agent-pm
```

Output is always JSON. If the script is unavailable on a given platform, the SKILL.md tells the agent to read the three TOML files directly and apply the same merge rules.

## Workflow Customization

[Section titled “Workflow Customization”](https://docs.bmad-method.org/how-to/customize-bmad/#workflow-customization)

Workflows (skills that drive multi-step processes like `bmad-product-brief`) share the same override mechanism as agents. Their customizable surface lives under `[workflow]` instead of `[agent]`:

```
[workflow]

# Same prepend/append semantics as agents — runs before and after the workflow's

# own activation steps. Overrides append to defaults.

activation_steps_prepend = [\
\
  "Load {project-root}/docs/product/north-star-principles.md as context.",\
\
]

activation_steps_append = []

# Same literal-or-file: semantics as the agent variant. Loaded as foundational

# context for the duration of the workflow run.

persistent_facts = [\
\
  "All briefs must include an explicit regulatory-risk section.",\
\
  "file:{project-root}/docs/compliance/product-brief-checklist.md",\
\
]

# Scalar: runs once the workflow finishes its main output. Override wins.

on_complete = "Summarize the brief in three bullets and offer to email it via the gws-gmail-send skill."
```

The same field conventions cross the agent/workflow boundary: `activation_steps_prepend`/`activation_steps_append`, `persistent_facts` (with `file:` refs), and menu-style `[[…]]` tables with `code`/`id` for keyed merge. The resolver applies the same four structural rules regardless of the top-level key. SKILL.md references follow the namespace: `{workflow.activation_steps_prepend}`, `{workflow.persistent_facts}`, `{workflow.on_complete}`. Any additional fields a workflow exposes (output paths, toggles, review settings, stage flags) follow the same shape-based merge rules. Read the workflow’s `customize.toml` to see what’s customizable.

### Activation Order

[Section titled “Activation Order”](https://docs.bmad-method.org/how-to/customize-bmad/#activation-order)

Customizable workflows run their activation in a fixed sequence so you know exactly when your hooks fire:

1. Resolve the `[workflow]` block (base → team → user merge)
2. Execute `activation_steps_prepend` in order
3. Load `persistent_facts` as foundational context for the run
4. Load config (`_bmad/bmm/config.yaml`) and resolve standard variables (project name, languages, paths, date)
5. Greet the user
6. Execute `activation_steps_append` in order

After step 6 the workflow body begins. Use `activation_steps_prepend` when you need context loaded before the greeting can be personalized; use `activation_steps_append` when the setup is heavy and you’d rather the user sees the greeting first.

### Scope of This Initial Pass

[Section titled “Scope of This Initial Pass”](https://docs.bmad-method.org/how-to/customize-bmad/#scope-of-this-initial-pass)

Customization is rolling out incrementally. The fields documented above — `activation_steps_prepend`, `activation_steps_append`, `persistent_facts`, `on_complete` — are the **baseline surface** that every customizable workflow exposes, and they will remain stable across versions. They give you broad-stroke control today: inject pre/post steps, pin foundational context, trigger follow-up actions.

Over time, individual workflows will expose **more targeted customization points** tailored to what that workflow actually does — things like step-specific toggles, stage flags, output template paths, or review gates. When those arrive, they stack on top of the baseline fields rather than replacing them, so customizations you author today keep working.

If you need a fine-grained knob that isn’t exposed yet, either use `activation_steps_*` and `persistent_facts` to steer behavior, or open an issue describing the specific customization point you want — those requests are what drive which targeted fields get added next.

## Central Configuration

[Section titled “Central Configuration”](https://docs.bmad-method.org/how-to/customize-bmad/#central-configuration)

Per-skill `customize.toml` covers **deep behavior** (hooks, menus, persistent\_facts, persona overrides for a single agent or workflow). A separate surface covers **cross-cutting state** — install answers and the agent roster that external skills like `bmad-party-mode`, `bmad-retrospective`, and `bmad-advanced-elicitation` consume. That surface lives in four TOML files at project root:

```
_bmad/config.toml               (installer-owned)  team scope:   install answers + agent roster

_bmad/config.user.toml          (installer-owned)  user scope:   user_name, language, skill level

_bmad/custom/config.toml        (human-authored)   team overrides (committed to git)

_bmad/custom/config.user.toml   (human-authored)   personal overrides (gitignored)
```

### Four-Layer Merge

[Section titled “Four-Layer Merge”](https://docs.bmad-method.org/how-to/customize-bmad/#four-layer-merge)

```
Priority 1 (wins): _bmad/custom/config.user.toml

Priority 2:        _bmad/custom/config.toml

Priority 3:        _bmad/config.user.toml

Priority 4 (base): _bmad/config.toml
```

Same structural rules as per-skill customize (scalars override, tables deep-merge, `code`/`id`-keyed arrays merge by key, other arrays append).

### What Lives Where

[Section titled “What Lives Where”](https://docs.bmad-method.org/how-to/customize-bmad/#what-lives-where)

The installer partitions answers by the `scope:` declared on each prompt in `module.yaml`:

- `[core]` and `[modules.<code>]` sections — install answers. Scope `team` lands in `_bmad/config.toml`; scope `user` lands in `_bmad/config.user.toml`.
- `[agents.<code>]` — agent essence (code, name, title, icon, description, team) distilled from each module’s `module.yaml``agents:` block. Always team-scoped.

### Editing Rules

[Section titled “Editing Rules”](https://docs.bmad-method.org/how-to/customize-bmad/#editing-rules)

- `_bmad/config.toml` and `_bmad/config.user.toml` are **regenerated every install** from the answers collected during the installer flow. Treat them as read-only outputs — direct edits will be overwritten on the next install. To change an install answer durably, re-run the installer (it remembers your prior answers as defaults) or shadow the value in `_bmad/custom/config.toml`.
- `_bmad/custom/config.toml` and `_bmad/custom/config.user.toml` are **never touched** by the installer. This is the correct surface for custom agents, agent descriptor overrides, team-enforced settings, and any value you want to pin regardless of install answers.

### Example — Rebrand an Agent

[Section titled “Example — Rebrand an Agent”](https://docs.bmad-method.org/how-to/customize-bmad/#example--rebrand-an-agent)

```
# _bmad/custom/config.toml (committed to git, applies to every developer)

[agents.bmad-agent-pm]

description = "Healthcare PM — regulatory-aware, stakeholder-driven, FDA-shaped questions first."

icon = "🏥"
```

The resolver merges over the installer-written `[agents.bmad-agent-pm]`. `bmad-party-mode` and any other roster consumer pick up the new description automatically.

### Example — Add a Fictional Agent

[Section titled “Example — Add a Fictional Agent”](https://docs.bmad-method.org/how-to/customize-bmad/#example--add-a-fictional-agent)

```
# _bmad/custom/config.user.toml (personal, gitignored)

[agents.kirk]

team = "startrek"

name = "Captain James T. Kirk"

title = "Starship Captain"

icon = "🖖"

description = "Bold, rule-bending commander. Speaks in dramatic pauses. Thinks aloud about the weight of command."
```

No skill folder required — the essence alone is enough for party-mode to spawn Kirk as a voice. Filter by the `team` field to invite just the Enterprise crew to a roundtable.

### Example — Override Module Install Settings

[Section titled “Example — Override Module Install Settings”](https://docs.bmad-method.org/how-to/customize-bmad/#example--override-module-install-settings)

```
[modules.bmm]

planning_artifacts = "/shared/org-planning-artifacts"
```

The override wins over whatever each developer answered during their local install. Useful for pinning team conventions.

### When to Use Which Surface

[Section titled “When to Use Which Surface”](https://docs.bmad-method.org/how-to/customize-bmad/#when-to-use-which-surface)

| Need | Use |
| --- | --- |
| Add MCP tool calls to every dev workflow | Per-skill: `_bmad/custom/bmad-agent-dev.toml``persistent_facts` |
| Add a menu item to an agent | Per-skill: `_bmad/custom/bmad-agent-{role}.toml``[[agent.menu]]` |
| Swap a workflow’s output template | Per-skill: `_bmad/custom/{workflow}.toml` scalar override |
| Rebrand an agent’s public descriptor | **Central**: `_bmad/custom/config.toml``[agents.<code>]` |
| Add a custom or fictional agent to the roster | **Central**: `_bmad/custom/config.*.toml` new `[agents.<code>]` entry |
| Pin team-enforced install settings | **Central**: `_bmad/custom/config.toml``[modules.<code>]` or `[core]` |

Use both surfaces in the same project as needed.

## Worked Examples

[Section titled “Worked Examples”](https://docs.bmad-method.org/how-to/customize-bmad/#worked-examples)

For enterprise-oriented recipes (shaping an agent across every workflow it dispatches, enforcing org conventions, publishing outputs to Confluence and Jira, customizing the agent roster, and swapping in your own output templates), see [How to Expand BMad for Your Organization](https://docs.bmad-method.org/how-to/expand-bmad-for-your-org/).

## Troubleshooting

[Section titled “Troubleshooting”](https://docs.bmad-method.org/how-to/customize-bmad/#troubleshooting)

**Customization not appearing?**

- Verify your file is in `_bmad/custom/` with the correct skill name
- Check TOML syntax: strings must be quoted, table headers use `[section]`, array-of-tables use `[[section]]`, and any scalar or array keys for a table must appear _before_ any of that table’s `[[subtables]]` in the file
- For agents, customization lives under `[agent]` — fields written below that header belong to `agent` until another table header begins
- Remember `agent.name` and `agent.title` are read-only; overrides there have no effect

**Updates broke my customization?**

- Did you copy the full `customize.toml` into your override file? **Don’t.** Override files should contain only the fields you’re changing. A full copy locks in old defaults and silently drifts every release. Trim your override back to just the deltas.

**Need to see what’s customizable?**

- Run the `bmad-customize` skill — it enumerates every customizable skill installed in your project, shows which ones already have overrides, and walks you through adding or updating one
- Or read the skill’s `customize.toml` directly — every field there is customizable (except `name` and `title`)

**Need to reset?**

- Delete your override file from `_bmad/custom/` — the skill falls back to its built-in defaults


## Source: https://docs.bmad-method.org/how-to/project-context/

[Skip to content](https://docs.bmad-method.org/how-to/project-context/#_top)

# Manage Project Context

Use the `project-context.md` file to ensure AI agents follow your project’s technical preferences and implementation rules throughout all workflows. To make sure this is always available, you can also add the line `Important project context and conventions are located in [path to project context]/project-context.md` to your tools context or always rules file (such as `AGENTS.md`)

## When to Use This

[Section titled “When to Use This”](https://docs.bmad-method.org/how-to/project-context/#when-to-use-this)

- You have strong technical preferences before starting architecture
- You’ve completed architecture and want to capture decisions for implementation
- You’re working on an existing codebase with established patterns
- You notice agents making inconsistent decisions across stories

## Step 1: Choose Your Approach

[Section titled “Step 1: Choose Your Approach”](https://docs.bmad-method.org/how-to/project-context/#step-1-choose-your-approach)

**Manual creation** — Best when you know exactly what rules you want to document

**Generate after architecture** — Best for capturing decisions made during solutioning

**Generate for existing projects** — Best for discovering patterns in existing codebases

## Step 2: Create the File

[Section titled “Step 2: Create the File”](https://docs.bmad-method.org/how-to/project-context/#step-2-create-the-file)

### Option A: Manual Creation

[Section titled “Option A: Manual Creation”](https://docs.bmad-method.org/how-to/project-context/#option-a-manual-creation)

Create the file at `_bmad-output/project-context.md`:

```
mkdir -p _bmad-output

touch _bmad-output/project-context.md
```

Add your technology stack and implementation rules:

```
---

project_name: 'MyProject'

user_name: 'YourName'

date: '2026-02-15'

sections_completed: ['technology_stack', 'critical_rules']

---

# Project Context for AI Agents

## Technology Stack & Versions

- Node.js 20.x, TypeScript 5.3, React 18.2

- State: Zustand

- Testing: Vitest, Playwright

- Styling: Tailwind CSS

## Critical Implementation Rules

**TypeScript:**

- Strict mode enabled, no `any` types

- Use `interface` for public APIs, `type` for unions

**Code Organization:**

- Components in `/src/components/` with co-located tests

- API calls use `apiClient` singleton — never fetch directly

**Testing:**

- Unit tests focus on business logic

- Integration tests use MSW for API mocking
```

### Option B: Generate After Architecture

[Section titled “Option B: Generate After Architecture”](https://docs.bmad-method.org/how-to/project-context/#option-b-generate-after-architecture)

Run the workflow in a fresh chat:

```
bmad-generate-project-context
```

The workflow scans your architecture document and project files to generate a context file capturing the decisions made.

### Option C: Generate for Existing Projects

[Section titled “Option C: Generate for Existing Projects”](https://docs.bmad-method.org/how-to/project-context/#option-c-generate-for-existing-projects)

For existing projects, run:

```
bmad-generate-project-context
```

The workflow analyzes your codebase to identify conventions, then generates a context file you can review and refine.

## Step 3: Verify Content

[Section titled “Step 3: Verify Content”](https://docs.bmad-method.org/how-to/project-context/#step-3-verify-content)

Review the generated file and ensure it captures:

- Correct technology versions
- Your actual conventions (not generic best practices)
- Rules that prevent common mistakes
- Framework-specific patterns

Edit manually to add anything missing or remove inaccuracies.

## What You Get

[Section titled “What You Get”](https://docs.bmad-method.org/how-to/project-context/#what-you-get)

A `project-context.md` file that:

- Ensures all agents follow the same conventions
- Prevents inconsistent decisions across stories
- Captures architecture decisions for implementation
- Serves as a reference for your project’s patterns and rules

## Tips

[Section titled “Tips”](https://docs.bmad-method.org/how-to/project-context/#tips)

## Next Steps

[Section titled “Next Steps”](https://docs.bmad-method.org/how-to/project-context/#next-steps)

- [**Project Context Explanation**](https://docs.bmad-method.org/explanation/project-context/) — Learn more about how it works
- [**Workflow Map**](https://docs.bmad-method.org/reference/workflow-map/) — See which workflows load project context


## Source: https://docs.bmad-method.org/how-to/shard-large-documents/

[Skip to content](https://docs.bmad-method.org/how-to/shard-large-documents/#_top)

# Document Sharding Guide

Use the `bmad-shard-doc` tool if you need to split large markdown files into smaller, organized files for better context management.

## When to Use This

[Section titled “When to Use This”](https://docs.bmad-method.org/how-to/shard-large-documents/#when-to-use-this)

Only use this if you notice your chosen tool / model combination is failing to load and read all the documents as input when needed.

## What is Document Sharding?

[Section titled “What is Document Sharding?”](https://docs.bmad-method.org/how-to/shard-large-documents/#what-is-document-sharding)

Document sharding splits large markdown files into smaller, organized files based on level 2 headings (`## Heading`).

### Architecture

[Section titled “Architecture”](https://docs.bmad-method.org/how-to/shard-large-documents/#architecture)

```
Before Sharding:

_bmad-output/planning-artifacts/

└── PRD.md (large 50k token file)

After Sharding:

_bmad-output/planning-artifacts/

└── prd/

    ├── index.md                    # Table of contents with descriptions

    ├── overview.md                 # Section 1

    ├── user-requirements.md        # Section 2

    ├── technical-requirements.md   # Section 3

    └── ...                         # Additional sections
```

## Steps

[Section titled “Steps”](https://docs.bmad-method.org/how-to/shard-large-documents/#steps)

### 1\. Run the Shard-Doc Tool

[Section titled “1. Run the Shard-Doc Tool”](https://docs.bmad-method.org/how-to/shard-large-documents/#1-run-the-shard-doc-tool)

```
/bmad-shard-doc
```

### 2\. Follow the Interactive Process

[Section titled “2. Follow the Interactive Process”](https://docs.bmad-method.org/how-to/shard-large-documents/#2-follow-the-interactive-process)

```
Agent: Which document would you like to shard?

User: docs/PRD.md

Agent: Default destination: docs/prd/

       Accept default? [y/n]

User: y

Agent: Sharding PRD.md...

       ✓ Created 12 section files

       ✓ Generated index.md

       ✓ Complete!
```

## How Workflow Discovery Works

[Section titled “How Workflow Discovery Works”](https://docs.bmad-method.org/how-to/shard-large-documents/#how-workflow-discovery-works)

BMad workflows use a **dual discovery system**:

1. **Try whole document first** \- Look for `document-name.md`
2. **Check for sharded version** \- Look for `document-name/index.md`
3. **Priority rule** \- Whole document takes precedence if both exist - remove the whole document if you want the sharded to be used instead

## Workflow Support

[Section titled “Workflow Support”](https://docs.bmad-method.org/how-to/shard-large-documents/#workflow-support)

All BMM workflows support both formats:

- Whole documents
- Sharded documents
- Automatic detection
- Transparent to user


## Source: https://docs.bmad-method.org/how-to/expand-bmad-for-your-org/

[Skip to content](https://docs.bmad-method.org/how-to/expand-bmad-for-your-org/#_top)

# How to Expand BMad for Your Organization

BMad’s customization surface lets an organization reshape behavior without editing installed files or forking skills. This guide walks through six recipes that cover most enterprise needs.

## The Three-Layer Mental Model

[Section titled “The Three-Layer Mental Model”](https://docs.bmad-method.org/how-to/expand-bmad-for-your-org/#the-three-layer-mental-model)

Before picking a recipe, know where your override lands:

| Layer | Where overrides live | Scope |
| --- | --- | --- |
| **Agent** (e.g. Amelia, Mary, John) | `[agent]` section of `_bmad/custom/bmad-agent-{role}.toml` | Travels with the persona into **every workflow the agent dispatches** |
| **Workflow** (e.g. product-brief, create-prd) | `[workflow]` section of `_bmad/custom/{workflow-name}.toml` | Applies only to that workflow’s run |
| **Central config** | `[agents.*]`, `[core]`, `[modules.*]` in `_bmad/custom/config.toml` | Agent roster (who’s available for party-mode, retrospective, elicitation), install-time settings pinned org-wide |

Rule of thumb: if the rule should apply everywhere an engineer does dev work, customize the **dev agent**. If it applies only when someone writes a product brief, customize the **product-brief workflow**. If it changes _who’s in the room_ (rename an agent, add a custom voice, enforce a shared artifact path), edit **central config**.

## Recipe 1: Shape an Agent Across Every Workflow It Dispatches

[Section titled “Recipe 1: Shape an Agent Across Every Workflow It Dispatches”](https://docs.bmad-method.org/how-to/expand-bmad-for-your-org/#recipe-1-shape-an-agent-across-every-workflow-it-dispatches)

**Use case:** Standardize tool use and external system integrations so every workflow dispatched through an agent inherits the behavior. This is the highest-impact pattern.

**Example: Amelia (dev agent) always uses Context7 for library docs, and falls back to Linear when a story isn’t found in the epics list.**

```
[agent]

# Applied on every activation. Carries into dev-story, quick-dev,

# create-story, code-review, qa-generate — every skill Amelia dispatches.

persistent_facts = [\
\
  "For any library documentation lookup (React, TypeScript, Zod, Prisma, etc.), call the context7 MCP tool (`mcp__context7__resolve_library_id` then `mcp__context7__get_library_docs`) before relying on training-data knowledge. Up-to-date docs trump memorized APIs.",\
\
  "When a story reference isn't found in {planning_artifacts}/epics-and-stories.md, search Linear via `mcp__linear__search_issues` using the story ID or title before asking the user to clarify. If Linear returns a match, treat it as the authoritative story source.",\
\
]
```

**Why this works:** Two sentences reshape every dev workflow in the org, with no per-workflow duplication and no source changes. Every new engineer who pulls the repo inherits the conventions automatically.

**Team file vs personal file:**

- `bmad-agent-dev.toml`: committed to git; applies to the whole team
- `bmad-agent-dev.user.toml`: gitignored; personal preferences layered on top

## Recipe 2: Enforce Organizational Conventions Inside a Specific Workflow

[Section titled “Recipe 2: Enforce Organizational Conventions Inside a Specific Workflow”](https://docs.bmad-method.org/how-to/expand-bmad-for-your-org/#recipe-2-enforce-organizational-conventions-inside-a-specific-workflow)

**Use case:** Shape the _content_ of a workflow’s output so it meets compliance, audit, or downstream-consumer requirements.

**Example: every product brief must include compliance fields, and the agent knows about the org’s publishing conventions.**

```
[workflow]

persistent_facts = [\
\
  "Every brief must include an 'Owner' field, a 'Target Release' field, and a 'Security Review Status' field.",\
\
  "Non-commercial briefs (internal tools, research projects) must still include a user-value section, but can omit market differentiation.",\
\
  "file:{project-root}/docs/enterprise/brief-publishing-conventions.md",\
\
]
```

**What happens:** The facts load during Step 3 of the workflow’s activation. When the agent drafts the brief, it knows the required fields and the enterprise conventions document. The shipped default (`file:{project-root}/**/project-context.md`) still loads, since this is an append.

## Recipe 3: Publish Completed Outputs to External Systems

[Section titled “Recipe 3: Publish Completed Outputs to External Systems”](https://docs.bmad-method.org/how-to/expand-bmad-for-your-org/#recipe-3-publish-completed-outputs-to-external-systems)

**Use case:** Once the workflow produces its output, automatically publish to enterprise systems of record (Confluence, Notion, SharePoint) and open follow-up work (Jira, Linear, Asana).

**Example: briefs auto-publish to Confluence and offer optional Jira epic creation.**

```
[workflow]

# Terminal hook. Scalar override replaces the empty default wholesale.

on_complete = """

Publish and offer follow-up:

1. Read the finalized brief file path from the prior step.

2. Call `mcp__atlassian__confluence_create_page` with:

   - space: "PRODUCT"

   - parent: "Product Briefs"

   - title: the brief's title

   - body: the brief's markdown contents

   Capture the returned page URL.

3. Tell the user: "Brief published to Confluence: <url>".

4. Ask: "Want me to open a Jira epic for this brief now?"

5. If yes, call `mcp__atlassian__jira_create_issue` with:

   - type: "Epic"

   - project: "PROD"

   - summary: the brief's title

   - description: a short summary plus a link back to the Confluence page.

   Report the epic key and URL.

6. If no, exit cleanly.

If either MCP tool fails, report the failure, print the brief path,

and ask the user to publish manually.

"""
```

**Why `on_complete` and not `activation_steps_append`:**`on_complete` runs exactly once, at the terminal stage, after the workflow’s main output is written. That’s the right moment to publish artifacts. `activation_steps_append` runs every activation, before the workflow does its work.

**Tradeoffs:**

- **Confluence publication is non-destructive** and always runs on completion
- **Jira epic creation is visible to the whole team** and kicks off sprint-planning signals, so gate it on user confirmation
- **Graceful fallback:** if MCP tools fail, hand off to the user rather than silently dropping the output

## Recipe 4: Swap in Your Own Output Template

[Section titled “Recipe 4: Swap in Your Own Output Template”](https://docs.bmad-method.org/how-to/expand-bmad-for-your-org/#recipe-4-swap-in-your-own-output-template)

**Use case:** The default output structure doesn’t match your organization’s expected format, or different orgs in the same repo need different templates.

**Example: point the product-brief workflow at an enterprise-owned template.**

```
[workflow]

brief_template = "{project-root}/docs/enterprise/brief-template.md"
```

**How it works:** The workflow’s `customize.toml` ships with `brief_template = "resources/brief-template.md"` (bare path, resolves from skill root). Your override points at a file under `{project-root}`, so the agent reads your template in Stage 4 instead of the shipped one.

**Template authoring tips:**

- Keep templates in `{project-root}/docs/` or `{project-root}/_bmad/custom/templates/` so they version alongside the override file
- Use the same structural conventions as the shipped template (section headings, frontmatter); the agent adapts to what’s there
- For multi-org repos, use `.user.toml` to let individual teams point at their own templates without touching the committed team file

## Recipe 5: Customize the Agent Roster

[Section titled “Recipe 5: Customize the Agent Roster”](https://docs.bmad-method.org/how-to/expand-bmad-for-your-org/#recipe-5-customize-the-agent-roster)

**Use case:** Change _who’s in the room_ for roster-driven skills like `bmad-party-mode`, `bmad-retrospective`, and `bmad-advanced-elicitation`, without editing any source or forking. Three common variants follow.

### 5a. Rebrand a BMad Agent Org-Wide

[Section titled “5a. Rebrand a BMad Agent Org-Wide”](https://docs.bmad-method.org/how-to/expand-bmad-for-your-org/#5a-rebrand-a-bmad-agent-org-wide)

Every real agent has a descriptor the installer synthesizes from `module.yaml`. Override it to shift voice and framing across every roster consumer:

```
# _bmad/custom/config.toml (committed — applies to every developer)

[agents.bmad-agent-analyst]

description = "Mary the Regulatory-Aware Business Analyst — channels Porter and Minto, but lives and breathes FDA audit trails. Speaks like a forensic investigator presenting a case file."
```

Party-mode spawns Mary with the new description. The analyst activation itself still runs normally because Mary’s behavior lives in her per-skill `customize.toml`. This override changes how **external skills perceive and introduce her**, not how she works internally.

### 5b. Add a Fictional or Custom Agent

[Section titled “5b. Add a Fictional or Custom Agent”](https://docs.bmad-method.org/how-to/expand-bmad-for-your-org/#5b-add-a-fictional-or-custom-agent)

A full descriptor is enough for roster-based features, with no skill folder needed. Useful for personality variety in party mode or brainstorming sessions:

```
# _bmad/custom/config.user.toml (personal — gitignored)

[agents.spock]

team = "startrek"

name = "Commander Spock"

title = "Science Officer"

icon = "🖖"

description = "Logic first, emotion suppressed. Begins observations with 'Fascinating.' Never rounds up. Counterpoint to any argument that relies on gut instinct."

[agents.mccoy]

team = "startrek"

name = "Dr. Leonard McCoy"

title = "Chief Medical Officer"

icon = "⚕️"

description = "Country doctor's warmth, short fuse. 'Dammit Jim, I'm a doctor not a ___.' Ethics-driven counterweight to Spock."
```

Ask party-mode to “invite the Enterprise crew.” It filters by `team = "startrek"` and spawns Spock and McCoy with those descriptors. Real BMad agents (Mary, Amelia) can sit at the same table if you ask them to.

### 5c. Pin Team Install Settings

[Section titled “5c. Pin Team Install Settings”](https://docs.bmad-method.org/how-to/expand-bmad-for-your-org/#5c-pin-team-install-settings)

The installer prompts each developer for values like `planning_artifacts` path. When the org needs one shared answer across the team, pin it in central config — any developer’s local prompt answer gets overridden at resolution time:

```
[modules.bmm]

planning_artifacts = "{project-root}/shared/planning"

implementation_artifacts = "{project-root}/shared/implementation"

[core]

document_output_language = "English"
```

Personal settings like `user_name`, `communication_language`, or `user_skill_level` stay under each developer’s own `_bmad/config.user.toml`. The team file shouldn’t touch those.

**Why central config vs per-agent customize.toml:** Per-agent files shape how _one_ agent behaves when it activates. Central config shapes what roster consumers _see when they look at the field:_ which agents exist, what they’re called, what team they belong to, and the shared install settings the whole repo agrees on. Two surfaces, different jobs.

## Reinforce Global Rules in Your IDE’s Session File

[Section titled “Reinforce Global Rules in Your IDE’s Session File”](https://docs.bmad-method.org/how-to/expand-bmad-for-your-org/#reinforce-global-rules-in-your-ides-session-file)

BMad customizations load when a skill is activated. Many IDE tools also load a global instruction file at the **start of every session**, before any skill runs (`CLAUDE.md`, `AGENTS.md`, `.cursor/rules/`, `.github/copilot-instructions.md`, etc). For rules that should hold even outside BMad skills, restate the critical ones there too.

**When to double up:**

- A rule is important enough that a plain chat conversation (no skill active) should still follow it
- You want belt-and-suspenders enforcement because training-data defaults might otherwise pull the model off-course
- The rule is concise enough to repeat without bloating the session file

**Example: one line in the repo’s `CLAUDE.md` reinforcing the dev-agent rule from Recipe 1.**

```
<!-- Any file-read of library docs goes through the context7 MCP tool

(`mcp__context7__resolve_library_id` then `mcp__context7__get_library_docs`)

before relying on training-data knowledge. -->
```

One sentence, loaded every session. It pairs with the `bmad-agent-dev.toml` customization so the rule applies both inside Amelia’s workflows and during ad-hoc chats with the assistant. Each layer owns its own scope:

| Layer | Scope | Use for |
| --- | --- | --- |
| IDE session file (`CLAUDE.md` / `AGENTS.md`) | Every session, before any skill activates | Short, universal rules that should survive outside BMad |
| BMad agent customization | Every workflow the agent dispatches | Agent-persona-specific behavior |
| BMad workflow customization | One workflow run | Workflow-specific output shape, publishing hooks, templates |
| BMad central config | Agent roster + shared install settings | Who’s in the room and what shared paths the team uses |

Keep the IDE file **succinct**. A dozen well-chosen lines are more effective than a sprawling list. Models read it every turn, and noise crowds out signal.

## Recipe 6: Advanced Integration Patterns

[Section titled “Recipe 6: Advanced Integration Patterns”](https://docs.bmad-method.org/how-to/expand-bmad-for-your-org/#recipe-6-advanced-integration-patterns)

Several BMad workflows expose a richer configuration surface beyond the basics covered in Recipes 1–5. These patterns — on-demand knowledge sources, automatic output publishing, finalize-time doc standards, and swappable templates — appear across multiple workflows. Check a workflow’s `customize.toml` to see which fields it exposes; the examples below use `bmad-prd` because it exposes all of them, but the same patterns apply wherever the field appears.

### On-demand knowledge sources (`external_sources`)

[Section titled “On-demand knowledge sources (external\_sources)”](https://docs.bmad-method.org/how-to/expand-bmad-for-your-org/#on-demand-knowledge-sources-external_sources)

Connect the workflow to internal knowledge bases, competitive databases, or compliance references. The agent consults these on demand when the conversation surfaces a matching need — never preemptively.

```
# _bmad/custom/bmad-prd.toml  (same pattern works in any workflow that exposes external_sources)

[workflow]

external_sources = [\
\
  "When the user mentions a competitor or market segment, query corp:competitive_db (category={project_name}) before drafting the differentiation section.",\
\
  "For regulatory domains (healthcare, fintech, education), consult corp:compliance_reference before drafting domain-specific sections.",\
\
]
```

Each entry is a natural-language directive naming the MCP tool, the trigger condition, and any fields the tool needs. If the tool is unavailable at runtime, the workflow falls back to standard behavior and notes the gap.

### Automatic output publishing (`external_handoffs`)

[Section titled “Automatic output publishing (external\_handoffs)”](https://docs.bmad-method.org/how-to/expand-bmad-for-your-org/#automatic-output-publishing-external_handoffs)

Route completed artifacts to external systems of record after the workflow finalizes. Unlike `on_complete` (Recipe 3), `external_handoffs` is a dedicated append array — team entries stack, and each handoff fires independently with graceful degradation if a tool is unavailable.

```
# _bmad/custom/bmad-prd.toml  (same pattern works in any workflow that exposes external_handoffs)

[workflow]

external_handoffs = [\
\
  "After finalize, upload prd.md and addendum.md to Confluence via corp:confluence_upload (space_key='PROD', parent_page='PRDs', label='prd', author={user_name}). Capture and surface the returned page URL.",\
\
  "Mirror to Notion via notion:create_page (database_id='abc123', title='PRD: ' + {project_name}).",\
\
]
```

If a named tool is unavailable, the handoff is skipped and flagged — local files always exist regardless.

### Finalize-time doc standards (`doc_standards`)

[Section titled “Finalize-time doc standards (doc\_standards)”](https://docs.bmad-method.org/how-to/expand-bmad-for-your-org/#finalize-time-doc-standards-doc_standards)

Apply org writing standards to human-consumed documents at finalize, after content is complete but before the user sees the output. Each entry is a `skill:`, `file:`, or plain-text directive; passes run as parallel subagents.

```
# _bmad/custom/bmad-prd.toml  (same pattern works in any workflow that exposes doc_standards)

[workflow]

doc_standards = [\
\
  "file:{project-root}/docs/enterprise/voice-and-tone.md",\
\
  "All dates must use ISO 8601 format (YYYY-MM-DD).",\
\
  "Replace any use of 'leverage' with 'use'.",\
\
]
```

`doc_standards` is an append array — team entries stack on top of whatever defaults the workflow ships with. Broader structural passes should come before narrower prose passes.

### Swappable templates and checklists

[Section titled “Swappable templates and checklists”](https://docs.bmad-method.org/how-to/expand-bmad-for-your-org/#swappable-templates-and-checklists)

Workflows that produce structured documents typically expose template and checklist paths as overridable scalars. Point them at org-owned files under `{project-root}` to enforce a different structure without editing any source.

```
[workflow]

# Regulated-industry PRD structure

prd_template = "{project-root}/docs/enterprise/prd-template-hipaa.md"

# Org-specific validation criteria

validation_checklist = "{project-root}/docs/enterprise/prd-checklist-regulated.md"
```

The agent adapts to whatever structure the template defines. Keep templates under `{project-root}/docs/` or `{project-root}/_bmad/custom/templates/` so they version alongside the override file. For multi-org repos, use `.user.toml` to let teams point at their own templates without touching the committed team file.

## Combining Recipes

[Section titled “Combining Recipes”](https://docs.bmad-method.org/how-to/expand-bmad-for-your-org/#combining-recipes)

All six recipes compose. A realistic enterprise override for `bmad-product-brief` might set `persistent_facts` (Recipe 2), `on_complete` (Recipe 3), and `brief_template` (Recipe 4) in one file. The agent-level rule (Recipe 1) lives in a separate file under the agent’s name, central config (Recipe 5) pins the shared roster and team settings, advanced integration patterns (Recipe 6) configure external sources and handoffs, and all layers apply in parallel.

```
# _bmad/custom/bmad-product-brief.toml (workflow-level)

[workflow]

persistent_facts = ["..."]

brief_template = "{project-root}/docs/enterprise/brief-template.md"

on_complete = """ ... """
```

```
# _bmad/custom/bmad-agent-analyst.toml (agent-level — Mary dispatches product-brief)

[agent]

persistent_facts = ["Always include a 'Regulatory Review' section when the domain involves healthcare, finance, or children's data."]
```

Result: Mary loads the regulatory-review rule at persona activation. When the user picks the product-brief menu item, the workflow loads its own conventions on top, writes to the enterprise template, and publishes to Confluence on completion. Every layer contributes, and none of them required editing BMad source.

## Troubleshooting

[Section titled “Troubleshooting”](https://docs.bmad-method.org/how-to/expand-bmad-for-your-org/#troubleshooting)

**Override not taking effect?** Check that the file is under `_bmad/custom/` with the exact skill directory name (e.g. `bmad-agent-dev.toml`, not `bmad-dev.toml`). See [How to Customize BMad](https://docs.bmad-method.org/how-to/customize-bmad/#troubleshooting).

**MCP tool name unknown?** Use the exact name the MCP server exposes in the current session. Ask Claude Code to list available MCP tools if unsure. Hardcoded names in `persistent_facts` or `on_complete` won’t work if the MCP server isn’t connected.

**Pattern doesn’t apply to my setup?** The recipes above are illustrative. The underlying machinery (three-layer merge, structural rules, agent-spans-workflow) supports many more patterns; compose them as needed.


## Source: https://docs.bmad-method.org/how-to/pressure-test-an-idea/

[Skip to content](https://docs.bmad-method.org/how-to/pressure-test-an-idea/#_top)

# Pressure-Test an Idea

Use the `bmad-forge-idea` skill to put a half-formed idea under adversarial questioning. It either survives with earned conviction or dies cheaply.

## When to Use This

[Section titled “When to Use This”](https://docs.bmad-method.org/how-to/pressure-test-an-idea/#when-to-use-this)

- You hold an idea and want it stress-tested before you commit time or money
- You want an honest read on whether to kill it, not encouragement
- You’re choosing between branches of a decision and need each one resolved
- Your idea lives inside an existing project and needs to be checked against what’s already there

## When to Skip This

[Section titled “When to Skip This”](https://docs.bmad-method.org/how-to/pressure-test-an-idea/#when-to-skip-this)

- You have no idea yet and need to generate options — use `bmad-brainstorming`
- You’ve committed to a product and want it proven customer-first — use `bmad-prfaq`
- You want your agents to debate a decision together — use `bmad-party-mode`

## Run a Session

[Section titled “Run a Session”](https://docs.bmad-method.org/how-to/pressure-test-an-idea/#run-a-session)

### 1\. Invoke the skill

[Section titled “1. Invoke the skill”](https://docs.bmad-method.org/how-to/pressure-test-an-idea/#1-invoke-the-skill)

Type `bmad-forge-idea` in your IDE, or say “forge an idea” or “pressure-test this.” Name the idea in the same message or wait for the first question.

### 2\. State your goal

[Section titled “2. State your goal”](https://docs.bmad-method.org/how-to/pressure-test-an-idea/#2-state-your-goal)

Tell the forge what you want: harden the idea, prove or kill it, or just think it through. The goal steers the questioning. Proving goes after the load-bearing claim first, and hardening drives each branch to a resolved answer.

### 3\. Defend your thinking, one branch at a time

[Section titled “3. Defend your thinking, one branch at a time”](https://docs.bmad-method.org/how-to/pressure-test-an-idea/#3-defend-your-thinking-one-branch-at-a-time)

The interrogator asks one question at a time and puts its own recommended answer on the table for you to push against. Answer honestly. When it challenges a fuzzy term or a claim that doesn’t match your project, settle that before you move on.

### 4\. Steer the room

[Section titled “4. Steer the room”](https://docs.bmad-method.org/how-to/pressure-test-an-idea/#4-steer-the-room)

Every branch arrives with two voices — one from your roster, one conjured by the topic. Call a specific persona by name, summon a saved party, or say “adversarial on this” to have a claim attacked while you defend it.

### 5\. Land an exit

[Section titled “5. Land an exit”](https://docs.bmad-method.org/how-to/pressure-test-an-idea/#5-land-an-exit)

Drive each branch to a resolved answer until the idea is hardened, killed, or simply clearer. Say when you’re done, or let the forge call it.

## What You Get

[Section titled “What You Get”](https://docs.bmad-method.org/how-to/pressure-test-an-idea/#what-you-get)

The forge writes a self-contained `forge-report.html` every run, stamped to match the outcome. A hardened idea also distills into `forged-idea.md`, which captures the locked decisions and what was killed and why. That file feeds `bmad-spec`, `bmad-prd`, or `bmad-prfaq` for a product concept. A killed or clarified session needs no artifact; the report stands on its own.


## Source: https://docs.bmad-method.org/how-to/use-web-bundles/

[Skip to content](https://docs.bmad-method.org/how-to/use-web-bundles/#_top)

# Use Web Bundles

Web bundles install from **[bmadcode.com/web-bundles](https://bmadcode.com/web-bundles/)**.

## Why a single front door

[Section titled “Why a single front door”](https://docs.bmad-method.org/how-to/use-web-bundles/#why-a-single-front-door)

The site is the only supported install path for the shelf. It keeps the steps current as Gemini and ChatGPT evolve, always points at the newest tagged release, and lets one signup put you on the list for new bundles as they ship.

## What you’ll do on the site

[Section titled “What you’ll do on the site”](https://docs.bmad-method.org/how-to/use-web-bundles/#what-youll-do-on-the-site)

1. Pick a bundle from the card grid.
2. Open the install modal. Switch between the **Gemini Gem** and **ChatGPT GPT** tabs for the platform-specific steps.
3. Download the bundle ZIP (one click; one-time free signup for email-only members).
4. Follow the inline steps: create the Gem or Custom GPT, upload the knowledge files, paste the instructions block, save.

## Prerequisites

[Section titled “Prerequisites”](https://docs.bmad-method.org/how-to/use-web-bundles/#prerequisites)

- **For Gemini Gems**: Gemini Advanced subscription.
- **For ChatGPT Custom GPTs**: Plus, Pro, Business, or Enterprise plan.
- For bundles that use **Deep Research** (currently Market & Industry Research), enable it from the prompt bar (Tools → Deep Research). Deep Research has its own plan limits.

## Customize the persona

[Section titled “Customize the persona”](https://docs.bmad-method.org/how-to/use-web-bundles/#customize-the-persona)

Each bundle’s `INSTRUCTIONS.md` (inside the ZIP) includes a **Persona Swap Example** above the paste boundary. Replace the `[persona]` block in your installed instructions with the swap example to change voice without changing the protocol. You can also write your own persona from scratch; the protocol stays the same.

## What you get

[Section titled “What you get”](https://docs.bmad-method.org/how-to/use-web-bundles/#what-you-get)

- A reusable Gem or Custom GPT scoped to one BMad planning capability.
- Polished artifacts (briefs, PRDs, research reports, UX specs) ready to drop into your IDE for implementation.
- Planning conversation runs on your existing web LLM subscription instead of metered IDE tokens.

## Building your own

[Section titled “Building your own”](https://docs.bmad-method.org/how-to/use-web-bundles/#building-your-own)

To turn an existing BMad skill into a web bundle, use the `bmad-os-skill-to-bundle` utility skill from [bmad-utility-skills](https://github.com/bmad-code-org/bmad-utility-skills). It produces the bundle files with persona inheritance from the owning agent and a swap-example contrast voice. Submit your bundle to the shelf by opening a PR on [BMAD-METHOD](https://github.com/bmad-code-org/BMAD-METHOD) that adds the bundle directory and an entry in `web-bundles/bundles.json`.


## Source: https://docs.bmad-method.org/explanation/named-agents/

[Skip to content](https://docs.bmad-method.org/explanation/named-agents/#_top)

# Named Agents

You say “Hey Mary, let’s brainstorm,” and Mary activates. She greets you by name, in the language you configured, with her distinctive persona. She reminds you that `bmad-help` is always available. Then she skips the menu entirely and drops straight into brainstorming — because your intent was clear.

This page explains what’s actually happening and why BMad is designed this way.

## The Three-Legged Stool

[Section titled “The Three-Legged Stool”](https://docs.bmad-method.org/explanation/named-agents/#the-three-legged-stool)

BMad’s agent model rests on three primitives that compose:

| Primitive | What it provides | Where it lives |
| --- | --- | --- |
| **Skill** | Capability — a discrete thing the assistant can do (brainstorm, draft a PRD, implement a story) | `.claude/skills/{skill-name}/SKILL.md` (or your IDE’s equivalent) |
| **Named agent** | Persona continuity — a recognizable identity that wraps a menu of related skills with consistent voice, principles, and visual cues | Skills whose directory starts with `bmad-agent-*` |
| **Customization** | Makes it yours — overrides that reshape an agent’s behavior, add MCP integrations, swap templates, layer in org conventions | `_bmad/custom/{skill-name}.toml` (committed team overrides) and `.user.toml` (personal, gitignored) |

Pull any leg away and the experience collapses:

- Skills without agents → capability lists the user has to navigate by name or code
- Agents without skills → personas with nothing to do
- No customization → every user gets the same out-of-box behavior, forcing forks for any org-specific need

## What Named Agents Buy You

[Section titled “What Named Agents Buy You”](https://docs.bmad-method.org/explanation/named-agents/#what-named-agents-buy-you)

BMad ships six named agents, each anchored to a phase of the BMad Method:

| Agent | Phase | Module |
| --- | --- | --- |
| 📊 **Mary**, Business Analyst | Analysis | market research, brainstorming, product briefs, PRFAQs |
| 📚 **Paige**, Technical Writer | Analysis | project documentation, diagrams, doc validation |
| 📋 **John**, Product Manager | Planning | PRD creation, epic/story breakdown, implementation readiness |
| 🎨 **Sally**, UX Designer | Planning | UX design specifications |
| 🏗️ **Winston**, System Architect | Solutioning | technical architecture, alignment checks |
| 💻 **Amelia**, Senior Engineer | Implementation | story execution, quick-dev, code review, sprint planning |

They each have a hardcoded identity (name, title, domain) and a customizable layer (role, principles, communication style, icon, menu). You can rewrite Mary’s principles or add menu items; you can’t rename her — that’s deliberate. Brand recognition survives customization so “hey Mary” always activates the analyst, regardless of how a team has shaped her behavior.

## The Activation Flow

[Section titled “The Activation Flow”](https://docs.bmad-method.org/explanation/named-agents/#the-activation-flow)

When you invoke a named agent, eight steps run in order:

1. **Resolve the agent block** — merge the shipped `customize.toml` with team and personal overrides, via a Python resolver using stdlib `tomllib`
2. **Execute prepend steps** — any pre-flight behavior the team configured
3. **Adopt persona** — hardcoded identity plus customized role, communication style, principles
4. **Load persistent facts** — org rules, compliance notes, optionally files loaded via a `file:` prefix (e.g., `file:{project-root}/docs/project-context.md`)
5. **Load config** — user name, communication language, output language, artifact paths
6. **Greet** — personalized, in the configured language, with the agent’s emoji prefix so you can see at a glance who’s speaking
7. **Execute append steps** — any post-greet setup the team configured
8. **Dispatch or present the menu** — if your opening message maps to a menu item, go directly; otherwise render the menu and wait for input

Step 8 is where intent meets capability. “Hey Mary, let’s brainstorm” skips rendering because `bmad-brainstorming` is an obvious match for `BP` on Mary’s menu. If you say something ambiguous, she asks once, briefly, not as a confirmation ritual. If nothing fits, she continues the conversation normally.

## Why Not Just a Menu?

[Section titled “Why Not Just a Menu?”](https://docs.bmad-method.org/explanation/named-agents/#why-not-just-a-menu)

Menus force the user to meet the tool halfway. You have to remember that brainstorming lives under code `BP` on the analyst agent, not the PM agent, and know which persona owns which capabilities. That’s cognitive overhead the tool is making you carry.

Named agents invert it. You say what you want, to whom, in whatever words feel natural. The agent knows who they are and what they do. When your intent is clear enough, they just go.

The menu is still there as a fallback — show it when you’re exploring, skip it when you’re not.

## Why Not Just a Blank Prompt?

[Section titled “Why Not Just a Blank Prompt?”](https://docs.bmad-method.org/explanation/named-agents/#why-not-just-a-blank-prompt)

Blank prompts assume you know the magic words. “Help me brainstorm” might work, but “let’s ideate on my SaaS idea” might not, and the results depend on how you phrased the ask. You become responsible for prompt engineering.

Named agents add structure without closing off freedom. The persona stays consistent, the capabilities are discoverable, and `bmad-help` is always one command away. You don’t have to guess what the agent can do, and you don’t need a manual to use it either.

## Customization as a First-Class Citizen

[Section titled “Customization as a First-Class Citizen”](https://docs.bmad-method.org/explanation/named-agents/#customization-as-a-first-class-citizen)

The customization model is what lets this scale beyond a single developer.

Every agent ships a `customize.toml` with sensible defaults. Teams commit overrides to `_bmad/custom/bmad-agent-{role}.toml`. Individuals can layer personal preferences in `.user.toml` (gitignored). The resolver merges all three at activation time with predictable structural rules.

Most users never hand-author these files. The `bmad-customize` skill walks through picking the target, choosing agent vs workflow scope, authoring the override, and verifying the merge — so the customization surface stays accessible to anyone who understands their intent, not just those fluent in TOML.

Concrete example: a team commits a single file telling Amelia to always use the Context7 MCP tool for library docs and to fall back to Linear when a story isn’t in the local epics list. Every dev workflow Amelia dispatches (dev-story, quick-dev, create-story, code-review) inherits that behavior, with no source edits or per-workflow duplication required.

There’s also a second customization surface for _cross-cutting_ concerns: the central `_bmad/config.toml` and `_bmad/config.user.toml` (both installer-owned, rebuilt from each module’s `module.yaml`) plus `_bmad/custom/config.toml` (team, committed) and `_bmad/custom/config.user.toml` (personal, gitignored) for overrides. This is where the **agent roster** lives — the lightweight descriptors that roster consumers like `bmad-party-mode`, `bmad-retrospective`, and `bmad-advanced-elicitation` read to know who’s available and how to embody them. Rebrand an agent org-wide with a team override; add fictional voices (Kirk, Spock, a domain expert persona) as personal experiments via the `.user.toml` override — without touching any skill folder. The per-skill file shapes how Mary _behaves_ when she activates; the central config shapes how other skills _see_ her when they look at the field.

For the full customization surface and worked examples, see:

- [How to Customize BMad](https://docs.bmad-method.org/how-to/customize-bmad/) — the reference for what’s customizable and how merge works
- [How to Expand BMad for Your Organization](https://docs.bmad-method.org/how-to/expand-bmad-for-your-org/) — five worked recipes spanning agent-wide rules, workflow conventions, external publishing, template swaps, and agent roster customization
- `bmad-customize` skill — the guided authoring helper that turns intent into a correctly-placed, verified override file

## The Bigger Idea

[Section titled “The Bigger Idea”](https://docs.bmad-method.org/explanation/named-agents/#the-bigger-idea)

Most AI assistants today are either menus or prompts, and both shift cognitive load onto the user. Named agents plus customizable skills let you talk to a teammate who already knows the work, and let your organization shape that teammate without forking.

The next time you type “Hey Mary, let’s brainstorm” and she just gets on with it, notice what didn’t happen. There was no slash command, no menu to navigate, no awkward reminder of what she can do. That absence is the design.


## Source: https://docs.bmad-method.org/explanation/analysis-phase/

[Skip to content](https://docs.bmad-method.org/explanation/analysis-phase/#_top)

# Analysis Phase: From Idea to Foundation

The Analysis phase (Phase 1) helps you think clearly about your product before committing to building it. Every tool in this phase is optional, but skipping analysis entirely means your PRD is built on assumptions instead of insight.

## Why Analysis Before Planning?

[Section titled “Why Analysis Before Planning?”](https://docs.bmad-method.org/explanation/analysis-phase/#why-analysis-before-planning)

A PRD answers “what should we build and why?” If you feed it vague thinking, you get a vague PRD — and every downstream document inherits that vagueness. Architecture built on a weak PRD makes wrong technical bets. Stories derived from weak architecture miss edge cases. The cost compounds.

Analysis tools exist to make your PRD sharp. They attack the problem from different angles — creative exploration, market reality, customer clarity, feasibility — so that by the time you sit down with the PM agent, you know what you’re building and for whom.

## The Tools

[Section titled “The Tools”](https://docs.bmad-method.org/explanation/analysis-phase/#the-tools)

### Brainstorming

[Section titled “Brainstorming”](https://docs.bmad-method.org/explanation/analysis-phase/#brainstorming)

**What it is.** A facilitated creative session using proven ideation techniques. The AI acts as coach, pulling ideas out of you through structured exercises — not generating ideas for you.

**Why it’s here.** Raw ideas need space to develop before they get locked into requirements. Brainstorming creates that space. It’s especially valuable when you have a problem domain but no clear solution, or when you want to explore multiple directions before committing.

**When to use it.** You have a vague sense of what you want to build but haven’t crystallized the concept. Or you have a concept but want to pressure-test it against alternatives.

See [Brainstorming](https://docs.bmad-method.org/explanation/brainstorming/) for a deeper look at how sessions work.

### Research (Market, Domain, Technical)

[Section titled “Research (Market, Domain, Technical)”](https://docs.bmad-method.org/explanation/analysis-phase/#research-market-domain-technical)

**What it is.** Three focused research workflows that investigate different dimensions of your idea. Market research examines competitors, trends, and user sentiment. Domain research builds subject-matter expertise and terminology. Technical research evaluates feasibility, architecture options, and implementation approaches.

**Why it’s here.** Building on assumptions is the fastest way to build something nobody needs. Research grounds your concept in reality — what competitors already exist, what users actually struggle with, what’s technically feasible, and what industry-specific constraints you’ll face.

**When to use it.** You’re entering an unfamiliar domain, you suspect competitors exist but haven’t mapped them, or your concept depends on technical capabilities you haven’t validated. Run one, two, or all three — each stands alone.

### Product Brief

[Section titled “Product Brief”](https://docs.bmad-method.org/explanation/analysis-phase/#product-brief)

**What it is.** A guided discovery session that produces a 1-2 page executive summary of your product concept. The AI acts as a collaborative Business Analyst, helping you articulate the vision, target audience, value proposition, and scope.

**Why it’s here.** The product brief is the gentler path into planning. It captures your strategic vision in a structured format that feeds directly into PRD creation. It works best when you already have conviction about your concept — you know the customer, the problem, and roughly what you want to build. The brief organizes and sharpens that thinking.

**When to use it.** Your concept is relatively clear and you want to document it efficiently before creating a PRD. You’re confident in the direction and don’t need your assumptions aggressively challenged.

### PRFAQ (Working Backwards)

[Section titled “PRFAQ (Working Backwards)”](https://docs.bmad-method.org/explanation/analysis-phase/#prfaq-working-backwards)

**What it is.** Amazon’s Working Backwards methodology adapted as an interactive challenge. You write the press release announcing your finished product before a single line of code exists, then answer the hardest questions customers and stakeholders would ask. The AI acts as a relentless but constructive product coach.

**Why it’s here.** The PRFAQ is the rigorous path into planning. It forces customer-first clarity by making you defend every claim. If you can’t write a compelling press release, the product isn’t ready. If customer FAQ answers reveal gaps, those are gaps you’d discover much later — and more expensively — during implementation. The gauntlet surfaces weak thinking early, when it’s cheapest to fix.

**When to use it.** You want your concept stress-tested before committing resources. You’re unsure whether users will actually care. You want to validate that you can articulate a clear, defensible value proposition. Or you simply want the discipline of Working Backwards to sharpen your thinking.

## Which Should I Use?

[Section titled “Which Should I Use?”](https://docs.bmad-method.org/explanation/analysis-phase/#which-should-i-use)

| Situation | Recommended tool |
| --- | --- |
| ”I have a vague idea, not sure where to start” | Brainstorming |
| ”I need to understand the market before deciding” | Research |
| ”I know what I want to build, just need to document it” | Product Brief |
| ”I want to make sure this idea is actually worth building” | PRFAQ |
| ”I want to explore, then validate, then document” | Brainstorming → Research → PRFAQ or Brief |

Product Brief and PRFAQ both produce input for the PRD — choose one based on how much challenge you want. The brief is collaborative discovery. The PRFAQ is a gauntlet. Both get you to the same destination; the PRFAQ tests whether your concept deserves to get there.

## What Happens After Analysis?

[Section titled “What Happens After Analysis?”](https://docs.bmad-method.org/explanation/analysis-phase/#what-happens-after-analysis)

Analysis outputs feed directly into Phase 2 (Planning). The PRD workflow accepts product briefs, PRFAQ documents, research findings, and brainstorming reports as input — it synthesizes whatever you’ve produced into structured requirements. The more analysis you do, the sharper your PRD.


## Source: https://docs.bmad-method.org/explanation/brainstorming/

[Skip to content](https://docs.bmad-method.org/explanation/brainstorming/#_top)

# Brainstorming

Unlock your creativity through guided exploration.

## What is Brainstorming?

[Section titled “What is Brainstorming?”](https://docs.bmad-method.org/explanation/brainstorming/#what-is-brainstorming)

Run `bmad-brainstorming` and you’ve got a creative facilitator pulling ideas out of you - not generating them for you. The AI acts as coach and guide, using proven techniques to create conditions where your best thinking emerges.

**Good for:**

- Breaking through creative blocks
- Generating product or feature ideas
- Exploring problems from new angles
- Developing raw concepts into action plans

## How It Works

[Section titled “How It Works”](https://docs.bmad-method.org/explanation/brainstorming/#how-it-works)

1. **Setup** \- Define topic, goals, constraints
2. **Choose approach** \- Pick techniques yourself, get AI recommendations, go random, or follow a progressive flow
3. **Facilitation** \- Work through techniques with probing questions and collaborative coaching
4. **Organize** \- Ideas grouped into themes and prioritized
5. **Action** \- Top ideas get next steps and success metrics

Everything gets captured in a session document you can reference later or share with stakeholders.


## Source: https://docs.bmad-method.org/explanation/advanced-elicitation/

[Skip to content](https://docs.bmad-method.org/explanation/advanced-elicitation/#_top)

# Advanced Elicitation

Make the LLM reconsider what it just generated. You pick a reasoning method, it applies that method to its own output, you decide whether to keep the improvements.

## What is Advanced Elicitation?

[Section titled “What is Advanced Elicitation?”](https://docs.bmad-method.org/explanation/advanced-elicitation/#what-is-advanced-elicitation)

A structured second pass. Instead of asking the AI to “try again” or “make it better,” you select a specific reasoning method and the AI re-examines its own output through that lens.

The difference matters. Vague requests produce vague revisions. A named method forces a particular angle of attack, surfacing insights that a generic retry would miss.

## When to Use It

[Section titled “When to Use It”](https://docs.bmad-method.org/explanation/advanced-elicitation/#when-to-use-it)

- After a workflow generates content and you want alternatives
- When output seems okay but you suspect there’s more depth
- To stress-test assumptions or find weaknesses
- For high-stakes content where rethinking helps

Workflows offer advanced elicitation at decision points - after the LLM has generated something, you’ll be asked if you want to run it.

## How It Works

[Section titled “How It Works”](https://docs.bmad-method.org/explanation/advanced-elicitation/#how-it-works)

1. LLM suggests 5 relevant methods for your content
2. You pick one (or reshuffle for different options)
3. Method is applied, improvements shown
4. Accept or discard, repeat or continue

## Built-in Methods

[Section titled “Built-in Methods”](https://docs.bmad-method.org/explanation/advanced-elicitation/#built-in-methods)

Dozens of reasoning methods are available. A few examples:

- **Pre-mortem Analysis** \- Assume the project already failed, work backward to find why
- **First Principles Thinking** \- Strip away assumptions, rebuild from ground truth
- **Inversion** \- Ask how to guarantee failure, then avoid those things
- **Red Team vs Blue Team** \- Attack your own work, then defend it
- **Socratic Questioning** \- Challenge every claim with “why?” and “how do you know?”
- **Constraint Removal** \- Drop all constraints, see what changes, add them back selectively
- **Stakeholder Mapping** \- Re-evaluate from each stakeholder’s perspective
- **Analogical Reasoning** \- Find parallels in other domains and apply their lessons

And many more. The AI picks the most relevant options for your content - you choose which to run.


## Source: https://docs.bmad-method.org/explanation/why-solutioning-matters/

[Skip to content](https://docs.bmad-method.org/explanation/why-solutioning-matters/#_top)

# Why Solutioning Matters

Phase 3 (Solutioning) translates **what** to build (from Planning) into **how** to build it (technical design). This phase prevents agent conflicts in multi-epic projects by documenting architectural decisions before implementation begins.

## The Problem Without Solutioning

[Section titled “The Problem Without Solutioning”](https://docs.bmad-method.org/explanation/why-solutioning-matters/#the-problem-without-solutioning)

```
Agent 1 implements Epic 1 using REST API

Agent 2 implements Epic 2 using GraphQL

Result: Inconsistent API design, integration nightmare
```

When multiple agents implement different parts of a system without shared architectural guidance, they make independent technical decisions that may conflict.

## The Solution With Solutioning

[Section titled “The Solution With Solutioning”](https://docs.bmad-method.org/explanation/why-solutioning-matters/#the-solution-with-solutioning)

```
architecture workflow decides: "Use GraphQL for all APIs"

All agents follow architecture decisions

Result: Consistent implementation, no conflicts
```

By documenting technical decisions explicitly, all agents implement consistently and integration becomes straightforward.

## Solutioning vs Planning

[Section titled “Solutioning vs Planning”](https://docs.bmad-method.org/explanation/why-solutioning-matters/#solutioning-vs-planning)

| Aspect | Planning (Phase 2) | Solutioning (Phase 3) |
| --- | --- | --- |
| Question | What and Why? | How? Then What units of work? |
| Output | FRs/NFRs (Requirements) | Architecture + Epics/Stories |
| Agent | PM | Architect → PM |
| Audience | Stakeholders | Developers |
| Document | PRD (FRs/NFRs) | Architecture + Epic Files |
| Level | Business logic | Technical design + Work breakdown |

## Key Principle

[Section titled “Key Principle”](https://docs.bmad-method.org/explanation/why-solutioning-matters/#key-principle)

**Make technical decisions explicit and documented** so all agents implement consistently.

This prevents:

- API style conflicts (REST vs GraphQL)
- Database design inconsistencies
- State management disagreements
- Naming convention mismatches
- Security approach variations

## When Solutioning is Required

[Section titled “When Solutioning is Required”](https://docs.bmad-method.org/explanation/why-solutioning-matters/#when-solutioning-is-required)

| Track | Solutioning Required? |
| --- | --- |
| Quick Flow | No - skip entirely |
| BMad Method Simple | Optional |
| BMad Method Complex | Yes |
| Enterprise | Yes |

## The Cost of Skipping

[Section titled “The Cost of Skipping”](https://docs.bmad-method.org/explanation/why-solutioning-matters/#the-cost-of-skipping)

Skipping solutioning on complex projects leads to:

- **Integration issues** discovered mid-sprint
- **Rework** due to conflicting implementations
- **Longer development time** overall
- **Technical debt** from inconsistent patterns


## Source: https://docs.bmad-method.org/explanation/preventing-agent-conflicts/

[Skip to content](https://docs.bmad-method.org/explanation/preventing-agent-conflicts/#_top)

# Preventing Agent Conflicts

When multiple AI agents implement different parts of a system, they can make conflicting technical decisions. Architecture documentation prevents this by establishing shared standards.

## Common Conflict Types

[Section titled “Common Conflict Types”](https://docs.bmad-method.org/explanation/preventing-agent-conflicts/#common-conflict-types)

### API Style Conflicts

[Section titled “API Style Conflicts”](https://docs.bmad-method.org/explanation/preventing-agent-conflicts/#api-style-conflicts)

Without architecture:

- Agent A uses REST with `/users/{id}`
- Agent B uses GraphQL mutations
- Result: Inconsistent API patterns, confused consumers

With architecture:

- ADR specifies: “Use GraphQL for all client-server communication”
- All agents follow the same pattern

### Database Design Conflicts

[Section titled “Database Design Conflicts”](https://docs.bmad-method.org/explanation/preventing-agent-conflicts/#database-design-conflicts)

Without architecture:

- Agent A uses snake\_case column names
- Agent B uses camelCase column names
- Result: Inconsistent schema, confusing queries

With architecture:

- Standards document specifies naming conventions
- All agents follow the same patterns

### State Management Conflicts

[Section titled “State Management Conflicts”](https://docs.bmad-method.org/explanation/preventing-agent-conflicts/#state-management-conflicts)

Without architecture:

- Agent A uses Redux for global state
- Agent B uses React Context
- Result: Multiple state management approaches, complexity

With architecture:

- ADR specifies state management approach
- All agents implement consistently

## How Architecture Prevents Conflicts

[Section titled “How Architecture Prevents Conflicts”](https://docs.bmad-method.org/explanation/preventing-agent-conflicts/#how-architecture-prevents-conflicts)

### 1\. Explicit Decisions via ADRs

[Section titled “1. Explicit Decisions via ADRs”](https://docs.bmad-method.org/explanation/preventing-agent-conflicts/#1-explicit-decisions-via-adrs)

Every significant technology choice is documented with:

- Context (why this decision matters)
- Options considered (what alternatives exist)
- Decision (what we chose)
- Rationale (why we chose it)
- Consequences (trade-offs accepted)

### 2\. FR/NFR-Specific Guidance

[Section titled “2. FR/NFR-Specific Guidance”](https://docs.bmad-method.org/explanation/preventing-agent-conflicts/#2-frnfr-specific-guidance)

Architecture maps each functional requirement to technical approach:

- FR-001: User Management → GraphQL mutations
- FR-002: Mobile App → Optimized queries

### 3\. Standards and Conventions

[Section titled “3. Standards and Conventions”](https://docs.bmad-method.org/explanation/preventing-agent-conflicts/#3-standards-and-conventions)

Explicit documentation of:

- Directory structure
- Naming conventions
- Code organization
- Testing patterns

## Architecture as Shared Context

[Section titled “Architecture as Shared Context”](https://docs.bmad-method.org/explanation/preventing-agent-conflicts/#architecture-as-shared-context)

Think of architecture as the shared context that all agents read before implementing:

```
PRD: "What to build"

     ↓

Architecture: "How to build it"

     ↓

Agent A reads architecture → implements Epic 1

Agent B reads architecture → implements Epic 2

Agent C reads architecture → implements Epic 3

     ↓

Result: Consistent implementation
```

## Key ADR Topics

[Section titled “Key ADR Topics”](https://docs.bmad-method.org/explanation/preventing-agent-conflicts/#key-adr-topics)

Common decisions that prevent conflicts:

| Topic | Example Decision |
| --- | --- |
| API Style | GraphQL vs REST vs gRPC |
| Database | PostgreSQL vs MongoDB |
| Auth | JWT vs Sessions |
| State Management | Redux vs Context vs Zustand |
| Styling | CSS Modules vs Tailwind vs Styled Components |
| Testing | Jest + Playwright vs Vitest + Cypress |

## Anti-Patterns to Avoid

[Section titled “Anti-Patterns to Avoid”](https://docs.bmad-method.org/explanation/preventing-agent-conflicts/#anti-patterns-to-avoid)


## Source: https://docs.bmad-method.org/explanation/quick-dev/

[Skip to content](https://docs.bmad-method.org/explanation/quick-dev/#_top)

# Quick Dev

Intent in, code changes out, with as few human-in-the-loop turns as possible — without sacrificing quality.

It lets the model run longer between checkpoints, then brings the human back only when the task cannot safely continue without human judgment or when it is time to review the end result.

![Quick Dev workflow diagram](https://docs.bmad-method.org/diagrams/quick-dev-diagram.png)

## Why This Exists

[Section titled “Why This Exists”](https://docs.bmad-method.org/explanation/quick-dev/#why-this-exists)

Human-in-the-loop turns are necessary and expensive.

Current LLMs still fail in predictable ways: they misread intent, fill gaps with confident guesses, drift into unrelated work, and generate noisy review output. At the same time, constant human intervention limits development velocity. Human attention is the bottleneck.

`bmad-quick-dev` rebalances that tradeoff. It trusts the model to run unsupervised for longer stretches, but only after the workflow has created a strong enough boundary to make that safe.

## The Core Design

[Section titled “The Core Design”](https://docs.bmad-method.org/explanation/quick-dev/#the-core-design)

### 1\. Compress intent first

[Section titled “1. Compress intent first”](https://docs.bmad-method.org/explanation/quick-dev/#1-compress-intent-first)

The workflow starts by having the human and the model compress the request into one coherent goal. The input can begin as a rough expression of intent, but before the workflow runs autonomously it has to become small enough, clear enough, and contradiction-free enough to execute.

Intent can come in many forms: a couple of phrases, a bug tracker link, output from plan mode, text copied from a chat session, or even a story number from BMAD’s own `epics.md`. In that last case, the workflow will not understand BMAD story-tracking semantics, but it can still take the story itself and run with it.

This workflow does not eliminate human control. It relocates it to a small number of high-value moments:

- **Intent clarification** \- turning a messy request into one coherent goal without hidden contradictions
- **Spec approval** \- confirming that the frozen understanding is the right thing to build
- **Review of the final product** \- the primary checkpoint, where the human decides whether the result is acceptable at the end

### 2\. Route to the smallest safe path

[Section titled “2. Route to the smallest safe path”](https://docs.bmad-method.org/explanation/quick-dev/#2-route-to-the-smallest-safe-path)

Once the goal is clear, the workflow decides whether this is a true one-shot change or whether it needs the fuller path. Small, zero-blast-radius changes can go straight to implementation. Everything else goes through planning so the model has a stronger boundary before it runs longer on its own.

### 3\. Run longer with less supervision

[Section titled “3. Run longer with less supervision”](https://docs.bmad-method.org/explanation/quick-dev/#3-run-longer-with-less-supervision)

After that routing decision, the model can carry more of the work on its own. On the fuller path, the approved spec becomes the boundary the model executes against with less supervision, which is the whole point of the design.

### 4\. Diagnose failure at the right layer

[Section titled “4. Diagnose failure at the right layer”](https://docs.bmad-method.org/explanation/quick-dev/#4-diagnose-failure-at-the-right-layer)

If the implementation is wrong because the intent was wrong, patching the code is the wrong fix. If the code is wrong because the spec was weak, patching the diff is also the wrong fix. The workflow is designed to diagnose where the failure entered the system, go back to that layer, and regenerate from there.

Review findings are used to decide whether the problem came from intent, spec generation, or local implementation. Only truly local problems get patched locally.

### 5\. Bring the human back only when needed

[Section titled “5. Bring the human back only when needed”](https://docs.bmad-method.org/explanation/quick-dev/#5-bring-the-human-back-only-when-needed)

The intent interview is human-in-the-loop, but it is not the same kind of interruption as a recurring checkpoint. The workflow tries to keep those recurring checkpoints to a minimum. After the initial shaping of intent, the human mainly comes back when the workflow cannot safely continue without judgment and at the end, when it is time to review the result.

- **Intent-gap resolution** \- stepping back in when review proves the workflow could not safely infer what was meant

Everything else is a candidate for longer autonomous execution. That tradeoff is deliberate. Older patterns spend more human attention on continuous supervision. Quick Dev spends more trust on the model, but saves human attention for the moments where human reasoning has the highest leverage.

## Why the Review System Matters

[Section titled “Why the Review System Matters”](https://docs.bmad-method.org/explanation/quick-dev/#why-the-review-system-matters)

The review phase is not just there to find bugs. It is there to route correction without destroying momentum.

This workflow works best on a platform that can spawn subagents, or at least invoke another LLM through the command line and wait for a result. If your platform does not support that natively, you can add a skill to do it. Context-free subagents are a cornerstone of the review design.

Agentic reviews often go wrong in two ways:

- They generate too many findings, forcing the human to sift through noise.
- They derail the current change by surfacing unrelated issues and turning every run into an ad hoc cleanup project.

Quick Dev addresses both by treating review as triage.

Some findings belong to the current change. Some do not. If a finding is incidental rather than causally tied to the current work, the workflow can defer it instead of forcing the human to handle it immediately. That keeps the run focused and prevents random tangents from consuming the budget of attention.

That triage will sometimes be imperfect. That is acceptable. It is usually better to misjudge some findings than to flood the human with thousands of low-value review comments. The system is optimizing for signal quality, not exhaustive recall.


## Source: https://docs.bmad-method.org/explanation/checkpoint-preview/

[Skip to content](https://docs.bmad-method.org/explanation/checkpoint-preview/#_top)

# Checkpoint Preview

`bmad-checkpoint-preview` is an interactive, LLM-assisted human-in-the-loop review workflow. It walks you through a code change — from purpose and context into details — so you can make an informed decision about whether to ship, rework, or dig deeper.

![Checkpoint Preview workflow diagram](https://docs.bmad-method.org/diagrams/checkpoint-preview-diagram.png)

## The Typical Flow

[Section titled “The Typical Flow”](https://docs.bmad-method.org/explanation/checkpoint-preview/#the-typical-flow)

You run `bmad-quick-dev`. It clarifies your intent, builds a spec, implements the change, and when it’s done it appends a review trail to the spec file and opens it in your editor. You look at the spec and see the change touched 20 files across several modules.

You could eyeball the diff. But 20 files is where eyeballing starts to fail — you lose the thread, miss a connection between two distant changes, or approve something you didn’t fully understand. So instead, you say “checkpoint” and the LLM walks you through it.

That handoff — from autonomous implementation back to human judgment — is the primary use case. Quick-dev runs long with minimal supervision. Checkpoint Preview is where you take back the wheel.

## Why It Exists

[Section titled “Why It Exists”](https://docs.bmad-method.org/explanation/checkpoint-preview/#why-it-exists)

Code review has two failure modes. In one, the reviewer skims the diff, nothing jumps out, and they approve. In the other, they methodically read every file but lose the thread — they see the trees and miss the forest. Both result in the same outcome: the review didn’t catch the thing that mattered.

The underlying issue is sequencing. A raw diff presents changes in file order, which is almost never the order that builds understanding. You see a helper function before you know why it exists. You see a schema change before you understand what feature it supports. The reviewer has to reconstruct the author’s intent from scattered clues, and that reconstruction is where attention fails.

Checkpoint Preview solves this by making the LLM do the reconstruction work. It reads the diff, the spec (if one exists), and the surrounding codebase, then presents the change in an order designed for comprehension — not for `git diff`.

## How It Works

[Section titled “How It Works”](https://docs.bmad-method.org/explanation/checkpoint-preview/#how-it-works)

The workflow has five steps. Each step builds on the previous one, progressively shifting from “what is this?” toward “should we ship it?“

### 1\. Orientation

[Section titled “1. Orientation”](https://docs.bmad-method.org/explanation/checkpoint-preview/#1-orientation)

The workflow identifies the change (from a PR, commit, branch, spec file, or the current git state) and produces a one-line intent summary plus surface area stats: files changed, modules touched, lines of logic, boundary crossings, and new public interfaces.

This is the “is this what I think it is?” moment. Before reading any code, the reviewer confirms they’re looking at the right thing and calibrates their expectations for scope.

### 2\. Walkthrough

[Section titled “2. Walkthrough”](https://docs.bmad-method.org/explanation/checkpoint-preview/#2-walkthrough)

The change is organized by **concern** — cohesive design intents like “input validation” or “API contract” — not by file. Each concern gets a short explanation of _why_ this approach was chosen, followed by clickable `path:line` stops that the reviewer can follow through the code.

This is the design judgment step. The reviewer evaluates whether the approach is right for the system, not whether the code is correct. Concerns are sequenced top-down: the highest-level intent first, then supporting implementation. The reviewer never encounters a reference to something they haven’t seen yet.

### 3\. Detail Pass

[Section titled “3. Detail Pass”](https://docs.bmad-method.org/explanation/checkpoint-preview/#3-detail-pass)

After the reviewer understands the design, the workflow surfaces 2-5 spots where a mistake would have the highest blast radius. These are tagged by risk category — `[auth]`, `[schema]`, `[billing]`, `[public API]`, `[security]`, and others — and ordered by how much breaks if they’re wrong.

This is not a bug hunt. Automated tests and CI handle correctness. The detail pass activates risk awareness: “here are the places where being wrong costs the most.” If the reviewer wants to go deeper on a specific area, they can say “dig into \[area\]” for a targeted correctness-focused re-review.

If the spec went through adversarial review loops (machine hardening), those findings are surfaced here too — not the bugs that were fixed, but the decisions that the review loop flagged that the reviewer should be aware of.

### 4\. Testing

[Section titled “4. Testing”](https://docs.bmad-method.org/explanation/checkpoint-preview/#4-testing)

Suggests 2-5 ways to manually observe the change working. Not automated test commands — manual observations that build confidence no test suite provides. A UI interaction to try, a CLI command to run, an API request to send, with expected results for each.

If the change has no user-visible behavior, it says so. No invented busywork.

### 5\. Wrap-Up

[Section titled “5. Wrap-Up”](https://docs.bmad-method.org/explanation/checkpoint-preview/#5-wrap-up)

The reviewer makes the call: approve, rework, or keep discussing. If approving a PR, the workflow can help with `gh pr review --approve`. If reworking, it helps diagnose whether the problem was the approach, the spec, or the implementation, and helps draft actionable feedback tied to specific code locations.

## It’s a Conversation, Not a Report

[Section titled “It’s a Conversation, Not a Report”](https://docs.bmad-method.org/explanation/checkpoint-preview/#its-a-conversation-not-a-report)

The workflow presents each step as a starting point, not a final word. Between steps — or in the middle of one — you can talk to the LLM, ask questions, challenge its framing, or pull in other skills to get a different perspective:

- **“run advanced elicitation on the error handling”** — push the LLM to reconsider and refine its analysis of a specific area
- **“party mode on whether this schema migration is safe”** — bring multiple agent perspectives into a focused debate
- **“run code review”** — generate structured agentic findings with adversarial and edge-case analysis

The checkpoint workflow doesn’t lock you into a linear path. It gives you structure when you want it and gets out of the way when you want to explore. The five steps are there to make sure you see the whole picture, but how deep you go at each step — and what tools you bring in — is entirely up to you.

## The Review Trail

[Section titled “The Review Trail”](https://docs.bmad-method.org/explanation/checkpoint-preview/#the-review-trail)

The walkthrough step works best when it has a **Suggested Review Order** — a list of stops the spec author wrote to guide reviewers through the change. When a spec includes this, the workflow uses it directly.

When no author-produced trail exists, the workflow generates one from the diff and codebase context. A generated trail is lower quality than an author-produced one, but far better than reading changes in file order.

## When to Use It

[Section titled “When to Use It”](https://docs.bmad-method.org/explanation/checkpoint-preview/#when-to-use-it)

The primary scenario is the handoff from `bmad-quick-dev`: the implementation is done, the spec file is open in your editor with a review trail appended, and you need to decide whether to ship. Say “checkpoint” and go.

It also works standalone:

- **Reviewing a PR** — especially one with more than a handful of files or cross-cutting changes
- **Onboarding to a change** — when you need to understand what happened on a branch you didn’t write
- **Sprint review** — the workflow can pick up stories marked `review` in your sprint status file

Invoke it by saying “checkpoint” or “walk me through this change.” It works in any terminal, but you’ll get more out of it inside an IDE — VS Code, Cursor, or similar — because the workflow produces `path:line` references at every step. In an IDE-embedded terminal those are clickable, so you can jump from file to file as you follow the review trail.

## What It Is Not

[Section titled “What It Is Not”](https://docs.bmad-method.org/explanation/checkpoint-preview/#what-it-is-not)

Checkpoint Preview is not a substitute for automated review. It does not run linters, type checkers, or test suites. It does not assign severity scores or produce pass/fail verdicts. It is a reading guide that helps a human apply their judgment where it matters most.


## Source: https://docs.bmad-method.org/explanation/adversarial-review/

[Skip to content](https://docs.bmad-method.org/explanation/adversarial-review/#_top)

# Adversarial Review

Force deeper analysis by requiring problems to be found.

## What is Adversarial Review?

[Section titled “What is Adversarial Review?”](https://docs.bmad-method.org/explanation/adversarial-review/#what-is-adversarial-review)

A review technique where the reviewer _must_ find issues. No “looks good” allowed. The reviewer adopts a cynical stance - assume problems exist and find them.

This isn’t about being negative. It’s about forcing genuine analysis instead of a cursory glance that rubber-stamps whatever was submitted.

**The core rule:** You must find issues. Zero findings triggers a halt - re-analyze or explain why.

## Why It Works

[Section titled “Why It Works”](https://docs.bmad-method.org/explanation/adversarial-review/#why-it-works)

Normal reviews suffer from confirmation bias. You skim the work, nothing jumps out, you approve it. The “find problems” mandate breaks this pattern:

- **Forces thoroughness** \- Can’t approve until you’ve looked hard enough to find issues
- **Catches missing things** \- “What’s not here?” becomes a natural question
- **Improves signal quality** \- Findings are specific and actionable, not vague concerns
- **Information asymmetry** \- Run reviews with fresh context (no access to original reasoning) so you evaluate the artifact, not the intent

## Where It’s Used

[Section titled “Where It’s Used”](https://docs.bmad-method.org/explanation/adversarial-review/#where-its-used)

Adversarial review appears throughout BMad workflows - code review, implementation readiness checks, spec validation, and others. Sometimes it’s a required step, sometimes optional (like advanced elicitation or party mode). The pattern adapts to whatever artifact needs scrutiny.

## Human Filtering Required

[Section titled “Human Filtering Required”](https://docs.bmad-method.org/explanation/adversarial-review/#human-filtering-required)

Because the AI is _instructed_ to find problems, it will find problems - even when they don’t exist. Expect false positives: nitpicks dressed as issues, misunderstandings of intent, or outright hallucinated concerns.

**You decide what’s real.** Review each finding, dismiss the noise, fix what matters.

## Example

[Section titled “Example”](https://docs.bmad-method.org/explanation/adversarial-review/#example)

Instead of:

> “The authentication implementation looks reasonable. Approved.”

An adversarial review produces:

> 1. **HIGH** \- `login.ts:47` \- No rate limiting on failed attempts
> 2. **HIGH** \- Session token stored in localStorage (XSS vulnerable)
> 3. **MEDIUM** \- Password validation happens client-side only
> 4. **MEDIUM** \- No audit logging for failed login attempts
> 5. **LOW** \- Magic number `3600` should be `SESSION_TIMEOUT_SECONDS`

The first review might miss a security vulnerability. The second caught four.

## Iteration and Diminishing Returns

[Section titled “Iteration and Diminishing Returns”](https://docs.bmad-method.org/explanation/adversarial-review/#iteration-and-diminishing-returns)

After addressing findings, consider running it again. A second pass usually catches more. A third isn’t always useless either. But each pass takes time, and eventually you hit diminishing returns - just nitpicks and false findings.


## Source: https://docs.bmad-method.org/explanation/party-mode/

[Skip to content](https://docs.bmad-method.org/explanation/party-mode/#_top)

# Party Mode

Party mode puts your AI agents in one room and lets them talk, to each other and to you. This page explains what a party is, the four ways it can run, how to build your own cast of personas instead of using the installed agents, and how a party remembers you between sessions.

## What is Party Mode?

[Section titled “What is Party Mode?”](https://docs.bmad-method.org/explanation/party-mode/#what-is-party-mode)

Run `bmad-party-mode` and the BMad agents you already have installed gather in one conversation: the PM, Architect, Dev, UX Designer, and whoever else your selected modules bring. That installed lineup is your default party, ready with no setup. They answer in character, agree, disagree, and build on each other. You steer the room. Ask a follow-up, push back, pull one voice forward, or change the subject. The conversation runs until you end it.

It works because the personas hold different priorities. The Architect guards the design, the PM guards scope, the Dev guards what’s actually buildable. Put them in the same room and the tradeoff surfaces now, in the conversation, instead of three weeks into the sprint.

**Good for:**

- Decisions with real tradeoffs
- Brainstorming and “what are we missing?”
- Post-mortems and retrospectives
- Pressure-testing a plan before you commit

Party mode is also a fast and genuinely fun way to brainstorm, since the personas have opinions and they clash. And you can start a party from inside any other workflow: mid-brainstorm, mid-PRD, while coding, working a sales angle, or shaping a creative piece. Any time you want more perspectives on what’s in front of you, pull in a room without dropping what you were doing.

## Starting a party

[Section titled “Starting a party”](https://docs.bmad-method.org/explanation/party-mode/#starting-a-party)

Invoke the skill and say what you want; it works out whether you mean to run a party or build one.

| Goal | Type this |
| --- | --- |
| Start a party in the default mode | `/bmad-party-mode` |
| Start in a specific mode | `/bmad-party-mode --mode auto` (also `session`, `subagent`, `agent-team`) |
| Run it once, non-interactively | `/bmad-party-mode --non-interactive "review this PR"` |
| Open a saved party | `/bmad-party-mode --party code-review-crew` |
| Conjure a cast on the spot | ”party mode with the bridge crew of the Enterprise” |
| Create or add a party | ”party mode, create a new party” |
| Edit an existing party | ”party mode, edit the writers’ room” |
| Customize the skill | `/bmad-customize bmad-party-mode` |

## How a party runs

[Section titled “How a party runs”](https://docs.bmad-method.org/explanation/party-mode/#how-a-party-runs)

A party can run in four modes. One mode is active per session, and it decides who does the thinking: a single model voicing everyone, or separate agents reasoning on their own.

| Mode | What it does | Reach for it when |
| --- | --- | --- |
| `session` | Default. One model voices every persona inline. Fast and fully conversational. | Most conversations — banter, brainstorming, quick back-and-forth. |
| `auto` | Voices inline for light rounds, spawns independent agents only when independence changes the answer. | You want speed most of the time but real independence on the hard rounds. |
| `subagent` | Spawns a separate agent for each persona every substantive round, so no single mind colors them all. | Honest reviews and focus groups, where the voices must not bleed together. |
| `agent-team` | Stands the personas up as a persistent team that address each other directly. Claude Code only. | A live, hands-off round-table where the agents talk among themselves. |

The choice matters because one model voicing five personas can quietly converge: they share a mind. Spawning real agents keeps their reasoning separate, which is the entire point of a review panel or a focus group. `session` is the cheapest and most fluid. The spawning modes cost more but protect independence, and `auto` aims for both by spawning only when a round needs it.

`session` is the default, and every other mode falls back to it when a harness can’t do the rest: `agent-team` drops to `subagent`, then to `session`. The configured default lives in your customization, and a runtime override wins for that session.

A party is interactive by default: the opening ask is a starting topic, not a stopping point, and the room stays open round after round until you end it. Answering the first question never ends the party on its own. To run it the other way — serve one intent and stop — start with `--non-interactive`; it runs to a natural close, wraps up, and releases any spawned agents.

## Custom parties

[Section titled “Custom parties”](https://docs.bmad-method.org/explanation/party-mode/#custom-parties)

Out of the box, a party uses your installed BMad agents. The larger use is building your own cast from any set of personas you can describe, then saving it to reuse. You author a party through the same skill. It detects whether you want to run one or build one, and writes the result to your overrides through [bmad-customize](https://docs.bmad-method.org/how-to/customize-bmad/).

Party mode is customizable like every BMad skill. Run `/bmad-customize bmad-party-mode` to set its defaults directly: pin any group you’ve built as the default party so it loads without a flag, choose which mode it starts in, and set any house rules the room should hold for the whole session.

Two ideas do most of the work.

**Personas** are what make a member unmistakable: how they talk, what they value, how they argue, their pet peeves and blind spots. “Skeptical CFO” is a placeholder. “Won’t approve anything without a payback under eighteen months, and says so in the first thirty seconds” is a persona. That detail is what gives a voice you’d recognize with the name labels hidden.

**Scenes** set the stage. A scene is one freeform line: the setting, what’s happening, who’s hostile to whom, who pushes hardest. The same members play it differently each time, so you define a person once and drop them into a bridge crew on duty, the same crew off-duty in the lounge, or a hostile buyer panel. Members combine into named groups, and you can pin one group as the default room.

### Shapes a party can take

[Section titled “Shapes a party can take”](https://docs.bmad-method.org/explanation/party-mode/#shapes-a-party-can-take)

| Shape | What it is |
| --- | --- |
| Themed cast | Famous investors, a TV ensemble — distinct voices gathered around a topic. |
| One-off personas | A persona or two added to the pool, no group needed. |
| Focus group from data | Hand it customer or survey data; it clusters people by what drives their behavior and builds representative personas. Pair it with `subagent` mode so the customers stay independent. |
| Review panel | Purpose-built critical lenses that argue about what matters. The shipped Code Review Crew is one. |
| Deliberation scaffold | A room that makes the human think harder without pretending to be an autonomous decision council. The shipped Anti-Consensus Club is one. |
| Open-cast room | No fixed roster. The scene names a universe and the room is cast on the fly as the topic shifts. |

A focus group is the case that pays off most. Feed in real profiles and you get a standing panel of representative customers to test an idea against before you build it, each reacting from their own goals and budget instead of agreeing with the last voice.

## Parties you could build

[Section titled “Parties you could build”](https://docs.bmad-method.org/explanation/party-mode/#parties-you-could-build)

A party is only personas and a scene, so the range is wide, and none of it needs a new skill or module:

- A founder squad to stress-test a startup idea.
- A compliance team to find the holes before an audit does.
- The authors of the Agile Manifesto, debating a software concept.
- A room of comedians as a writing-partner group.
- Great minds of the past, to work through a question in philosophy or untangle a hard problem.
- A business management team to plan the quarter.

These are starting points. Any set of voices you can describe becomes a party: write the personas, give the room a scene, and you have it.

## The Code Review Crew

[Section titled “The Code Review Crew”](https://docs.bmad-method.org/explanation/party-mode/#the-code-review-crew)

Your default party is the agents your installed modules provide. The Code Review Crew is a custom party BMad ships alongside that default — a working template to study before you build your own, not a replacement for it. It’s a review panel: five lenses that attack a change from different angles and argue about what actually matters, instead of rubber-stamping it.

| Member | Lens |
| --- | --- |
| Vex | Security — threat-models everything and names the concrete exploit path. |
| Grumbal | The adversary — assumes the code is broken and sets out to prove it. |
| Boundary | Edge cases — every branch, null, race, oversized input, odd timezone. |
| Yui | The craftsman — simplicity, naming, no needless cleverness or duplication. |
| Dana | The pragmatist — counters the perfectionists and ranks what’s real versus a nit. |

The crew ships defined but inactive. The members sit in the pool and cost nothing until you summon the group, and they never crowd your default room. Run it with `subagent` mode so each lens reviews on its own before the five clash over the findings.

## The Anti-Consensus Club

[Section titled “The Anti-Consensus Club”](https://docs.bmad-method.org/explanation/party-mode/#the-anti-consensus-club)

The Anti-Consensus Club helps with decisions, strategy, designs, and fuzzy questions where one assistant might agree too quickly or keep debating after the useful work is done. It is not a voting body. Its job is to raise useful objections, check claims, stop repetition, and return the decision to the human.

| Member | Lens |
| --- | --- |
| Wildcard | Option generator — suggests alternative problem statements, assumptions, and examples. |
| Level | Claim checker — checks support, missing information, and confidence. |
| Killjoy | Loop stopper — stops repetition, fake disagreement, and unsupported speculation. |
| Splinter | Consensus challenger — questions easy agreement and ignored tradeoffs. |

Run it as `/bmad-party-mode --party anti-consensus-club --mode subagent` when the platform supports it. The room recommends that at session start, then stops nagging if you continue in another mode.

## Steering the conversation

[Section titled “Steering the conversation”](https://docs.bmad-method.org/explanation/party-mode/#steering-the-conversation)

You drive the room the whole way:

- Bring someone in: “Bring in the UX designer.”
- Go deep on one voice: “Winston, take that apart.” A direct ask is the cue for one persona to stretch out.
- Switch rooms mid-session: “Switch to the writers’ room” swaps the active group and carries the thread over.
- Summon anyone by name, even a custom member who isn’t in the current room.

Whichever mode is running, the orchestrator presents the result as one conversation rather than a stack of separate answers, and it keeps the personas in character — it won’t break the fourth wall to narrate the mechanism.

## The room remembers

[Section titled “The room remembers”](https://docs.bmad-method.org/explanation/party-mode/#the-room-remembers)

Give a party a memory and it picks up where you left off. It keeps its own record of your past sessions — the dynamics that built up between members, the threads you left open, and where earlier conversations landed. Reopen it a week later and that history is intact: two members who came to blows last time still open a little frosty, and a sharp line from a past session can resurface as an organic callback.

It’s memory, not a transcript. The room carries the few things worth remembering, not a log of everything said, so the next conversation feels continuous without dragging the whole past into it. It happens on its own, in the background — nothing to save, and the room never breaks character to announce it.

A character who turns up on the fly is remembered too — a walk-on from an open-cast scene, or someone you add mid-conversation. At the end of a session the room offers to keep the new arrivals, folding them into the party so they can come back next time.

Memory is set per party. When you create or save a party you’re asked whether it should remember; the default installed-agent room remembers unless you turn it off. Set or change any of this through `/bmad-customize bmad-party-mode`.

## A keepsake of the session

[Section titled “A keepsake of the session”](https://docs.bmad-method.org/explanation/party-mode/#a-keepsake-of-the-session)

When you wrap up, the orchestrator offers a keepsake: a single self-contained HTML document of the session to keep or share. It lays the conversation out by persona rather than dumping a raw transcript. Decline it and the party simply ends.


## Source: https://docs.bmad-method.org/explanation/established-projects-faq/

[Skip to content](https://docs.bmad-method.org/explanation/established-projects-faq/#_top)

# Established Projects FAQ

Quick answers to common questions about working on established projects with the BMad Method (BMM).

## Questions

[Section titled “Questions”](https://docs.bmad-method.org/explanation/established-projects-faq/#questions)

- [Do I have to run document-project first?](https://docs.bmad-method.org/explanation/established-projects-faq/#do-i-have-to-run-document-project-first)
- [What if I forget to run document-project?](https://docs.bmad-method.org/explanation/established-projects-faq/#what-if-i-forget-to-run-document-project)
- [Can I use Quick Flow for established projects?](https://docs.bmad-method.org/explanation/established-projects-faq/#can-i-use-quick-flow-for-established-projects)
- [What if my existing code doesn’t follow best practices?](https://docs.bmad-method.org/explanation/established-projects-faq/#what-if-my-existing-code-doesnt-follow-best-practices)

### Do I have to run document-project first?

[Section titled “Do I have to run document-project first?”](https://docs.bmad-method.org/explanation/established-projects-faq/#do-i-have-to-run-document-project-first)

Highly recommended, especially if:

- No existing documentation
- Documentation is outdated
- AI agents need context about existing code

You can skip it if you have comprehensive, up-to-date documentation including `docs/index.md` or will use other tools or techniques to aid in discovery for the agent to build on an existing system.

### What if I forget to run document-project?

[Section titled “What if I forget to run document-project?”](https://docs.bmad-method.org/explanation/established-projects-faq/#what-if-i-forget-to-run-document-project)

Don’t worry about it - you can do it at any time. You can even do it during or after a project to help keep docs up to date.

### Can I use Quick Flow for established projects?

[Section titled “Can I use Quick Flow for established projects?”](https://docs.bmad-method.org/explanation/established-projects-faq/#can-i-use-quick-flow-for-established-projects)

Yes! Quick Flow works great for established projects. It will:

- Auto-detect your existing stack
- Analyze existing code patterns
- Detect conventions and ask for confirmation
- Generate context-rich spec that respects existing code

Perfect for bug fixes and small features in existing codebases.

### What if my existing code doesn’t follow best practices?

[Section titled “What if my existing code doesn’t follow best practices?”](https://docs.bmad-method.org/explanation/established-projects-faq/#what-if-my-existing-code-doesnt-follow-best-practices)

Quick Flow detects your conventions and asks: “Should I follow these existing conventions?” You decide:

- **Yes** → Maintain consistency with current codebase
- **No** → Establish new standards (document why in spec)

BMM respects your choice — it won’t force modernization, but it will offer it.

**Have a question not answered here?** Please [open an issue](https://github.com/bmad-code-org/BMAD-METHOD/issues) or ask in [Discord](https://discord.gg/gk8jAdXWmj) so we can add it!


## Source: https://docs.bmad-method.org/explanation/forge-idea/

[Skip to content](https://docs.bmad-method.org/explanation/forge-idea/#_top)

# Forge an Idea

Take a half-formed idea and pressure-test it now, in conversation, while changing your mind is still free.

## What is Forge Idea?

[Section titled “What is Forge Idea?”](https://docs.bmad-method.org/explanation/forge-idea/#what-is-forge-idea)

Run `bmad-forge-idea` and an exacting interrogator goes to work on your idea, one question at a time, until what survives is something you can act on with earned conviction. The skill is domain-agnostic. It runs on a software feature, a business model, a research hypothesis, or a life decision you keep circling.

What you walk away with is sharper thinking. A distilled `forged-idea.md` is only ever one possible exit, and the session never herds you toward “shall we build it?”

## Why Pressure-Test Early

[Section titled “Why Pressure-Test Early”](https://docs.bmad-method.org/explanation/forge-idea/#why-pressure-test-early)

The enemy is the hole you can’t see in your own idea. An unexamined assumption or an unresolved branch is a crack, and a crack you miss now resurfaces later — in the build, or the launch, when it costs far more to fix.

A conversation is the cheapest place to catch it, because changing your mind here costs nothing. The forge spends that cheapness on purpose, going after the weak points while fixing them is still free.

## How a Session Runs

[Section titled “How a Session Runs”](https://docs.bmad-method.org/explanation/forge-idea/#how-a-session-runs)

The interrogator works one question at a time, in dependency order, and puts its own recommended answer on the table each time. A position you can push against gets further than an open prompt. It finds discoverable answers itself instead of sending you to fetch them.

When your idea lands inside an existing project, that project’s material becomes the ground truth. The interrogator checks your claims against what already exists and names the contradictions. Your vocabulary gets the same treatment. When a term is fuzzy or carries two meanings, it forces a precise choice before the branch can resolve, because a branch built on an overloaded word resolves falsely.

## The Room

[Section titled “The Room”](https://docs.bmad-method.org/explanation/forge-idea/#the-room)

The forge is voiced. Once the topic is set, every branch arrives with two characters instead of one faceless assistant. One comes from your installed roster — an agent or persona you’ll recognize, drawn from the same cast behind [Party Mode](https://docs.bmad-method.org/explanation/party-mode/) and [named agents](https://docs.bmad-method.org/explanation/named-agents/). The other is conjured on the fly by the topic itself: a hostile competitor, a skeptical CFO, a domain specialist who has watched this exact plan fail before.

You steer the room whenever you want. Name a specific person, call a saved party, or invoke the **adversarial on this** gear to attack a claim to destruction with you defending it.

## Never Default-Agree

[Section titled “Never Default-Agree”](https://docs.bmad-method.org/explanation/forge-idea/#never-default-agree)

Reflexive agreement is the failure this skill exists to refuse. Acknowledging your idea isn’t the same as endorsing it, and the forge won’t praise anything before it has survived something. It attacks the weak point or builds on the strong one, and it credits only what genuinely earns the credit.

This is the deliberate inverse of [Adversarial Review](https://docs.bmad-method.org/explanation/adversarial-review/). There, the reviewer is told to find problems and you filter out the false positives. Here, the interrogator is told never to grant agreement for free, so the pressure stays high and you think harder under it. It optimizes for the best idea over a comfortable session.

## How a Session Ends

[Section titled “How a Session Ends”](https://docs.bmad-method.org/explanation/forge-idea/#how-a-session-ends)

The session ends however the thinking lands, and every landing is a real outcome. The forge writes a self-contained report you can keep, stamped to match the result.

| Outcome | What it means |
| --- | --- |
| **Hardened** | The idea survived. It distills into `forged-idea.md` (the locked decisions, plus what was killed and why), ready to feed `bmad-spec`, `bmad-prd`, or `bmad-prfaq` for a product concept. |
| **Killed** | The idea didn’t survive, and the report records the cause of death. Finding that out cheaply is a win. |
| **Clearer** | You just think straighter now. No artifact needed, and the session stands on its own. |

## When to Use It

[Section titled “When to Use It”](https://docs.bmad-method.org/explanation/forge-idea/#when-to-use-it)

Reach for the forge when you already hold an idea and want it hardened or killed before you invest in it. Skip it when you’re still generating options or when you need a group decision from your agents.

| Skill | Use it when | Voice |
| --- | --- | --- |
| `bmad-forge-idea` | You have an idea and want it stress-tested or killed | An interrogator plus a two-person room |
| `bmad-prfaq` | You’ve committed to a product and want it proven customer-first | A Working Backwards coach |
| `bmad-brainstorming` | You have no idea yet and need to generate options | A facilitation coach |
| `bmad-party-mode` | You want your agents to discuss or decide together | Your whole roster in one conversation |
| `bmad-review-adversarial-general` | You have an artifact and need its flaws found | A reviewer who must find issues |

## Example

[Section titled “Example”](https://docs.bmad-method.org/explanation/forge-idea/#example)

The first idea was a feature. Two questions in, the real idea is a retention bet you could test with a plain email and no model at all.


## Source: https://docs.bmad-method.org/explanation/web-bundles/

[Skip to content](https://docs.bmad-method.org/explanation/web-bundles/#_top)

# Web Bundles

Run the planning side of BMad in your web LLM subscription, then bring the artifacts into your IDE.

## What is a Web Bundle?

[Section titled “What is a Web Bundle?”](https://docs.bmad-method.org/explanation/web-bundles/#what-is-a-web-bundle)

A web bundle is a BMad skill repackaged for installation as a **Google Gemini Gem** or **ChatGPT Custom GPT**. Each bundle includes a `SKILL.md` protocol you upload as a knowledge file, an `INSTRUCTIONS.md` block you paste into the Gem or GPT instructions, and any data files the skill needs (CSVs, templates, validation checklists, additionally progressively disclosed content). The persona lives in the pasted instructions; the protocol lives in the knowledge file. Swap personas without touching the protocol.

Setup is not one-click, but the steps are guided. **Install from [bmadcode.com/web-bundles](https://bmadcode.com/web-bundles/)**. The site lists every bundle in a card grid, shows you the Gemini and ChatGPT install steps inline, and hands you the ZIP download. That is the supported install path; the pattern is the same across the shelf, so once you’ve installed one the next one is mechanical.

V4 of BMad shipped web bundles. V6 brings them back, rewritten for the current Gem and Custom GPT platforms with Canvas, Deep Research, and image generation in mind.

## Why use them

[Section titled “Why use them”](https://docs.bmad-method.org/explanation/web-bundles/#why-use-them)

Planning work and implementation work want different tools. Web bundles let each use the right one.

| Concern | Web LLM (Gem or GPT) | IDE (Claude Code, Cursor) |
| --- | --- | --- |
| Cost model | Flat-rate subscription | Metered tokens |
| Strongest at | Conversation, Canvas, Deep Research, images | Files, terminal, codebase context |
| Best for | Brainstorming, briefs, PRDs, research | Implementation, refactoring, code review |

Running a full PRD or market research conversation in an IDE burns tokens that a Gem or Custom GPT handles for the price of your existing subscription. The polished artifact then drops into your repo and Claude Code or Cursor takes it from there.

## What’s in the shelf

[Section titled “What’s in the shelf”](https://docs.bmad-method.org/explanation/web-bundles/#whats-in-the-shelf)

The current set of bundles covers the analysis and planning phases:

| Bundle | Phase | Persona lineage |
| --- | --- | --- |
| Brainstorming Coach | Analysis | Osborn (default), Minto (swap) |
| Product Brief Coach | Analysis | Mary (BMad analyst) |
| PRFAQ Coach | Analysis | Working Backwards (Bezos) |
| PRD Coach | Planning | Cagan |
| UX Coach | Planning | Norman |
| Market & Industry Research | Analysis | Porter and Christensen |

Each bundle carries a default persona inherited from its owning BMad agent (where one exists) and a contrasting swap example to demonstrate the voice change pattern.

## How a session works

[Section titled “How a session works”](https://docs.bmad-method.org/explanation/web-bundles/#how-a-session-works)

1. **Open the Gem or Custom GPT.** Persona greets in character and opens conversational discovery.
2. **Discover scope.** The persona asks what you’re trying to do, what you have on hand, what constraints apply. No form fill.
3. **Do the work in Canvas.** The protocol opens Canvas at session start and updates it continuously. Mermaid diagrams and HTML tables go in alongside the prose.
4. **Hand off.** When you’re done, you have a Canvas document you can export, paste into your repo, or feed to a BMad skill in your IDE for the next phase.

For bundles that integrate Deep Research (currently Market & Industry Research), the persona drafts a Deep Research brief mid-session for you to paste into Gemini’s or ChatGPT’s Deep Research mode, then ingests the returned report.

## When to use a web bundle

[Section titled “When to use a web bundle”](https://docs.bmad-method.org/explanation/web-bundles/#when-to-use-a-web-bundle)

- You’re doing the upfront thinking for a project and you want a focused tool with persona, Canvas, and Deep Research.
- You want to keep IDE token spend for actual coding.
- You’re sharing the planning artifact with collaborators who don’t have your IDE setup.

## When to stay in the IDE

[Section titled “When to stay in the IDE”](https://docs.bmad-method.org/explanation/web-bundles/#when-to-stay-in-the-ide)

- The work needs to read or modify code in your repo.
- You’re already mid-implementation and want to keep context.
- You don’t have a Gemini Advanced or ChatGPT Plus subscription.

## Updating and customizing

[Section titled “Updating and customizing”](https://docs.bmad-method.org/explanation/web-bundles/#updating-and-customizing)

Bundles evolve. When you pull a newer version of a bundle, the typical update is to its knowledge files (the `SKILL.md` protocol and any attached templates, CSVs, or validation checklists). Re-upload those into your Gem or Custom GPT to take the update. The instructions block usually does not change.

If you want to customize a bundle for your team or your voice, do it in the **instructions block** you pasted into the Gem or GPT, not in the knowledge files. The instructions block is where the persona, preferences, and any local overrides live; the knowledge files are the protocol the bundle ships with. Keeping customization in the instructions block means future updates are a swap-the-attachments operation, not a merge-your-edits-back-in operation.

## Building your own

[Section titled “Building your own”](https://docs.bmad-method.org/explanation/web-bundles/#building-your-own)

Web bundles are generated from BMad skills using the `bmad-os-skill-to-bundle` utility skill. Point it at any BMad skill folder and it produces the bundle files with persona inheritance from the owning agent.

Install any bundle from [bmadcode.com/web-bundles](https://bmadcode.com/web-bundles/).


## Source: https://docs.bmad-method.org/reference/workflow-map/

[Skip to content](https://docs.bmad-method.org/reference/workflow-map/#_top)

# Workflow Map

The BMad Method (BMM) is a module in the BMad Ecosystem, targeted at following the best practices of context engineering
and planning. AI agents work best with clear, structured context. The BMM system builds that context progressively
across 4 distinct phases - each phase, and multiple workflows optionally within each phase, produce documents that
inform the next, so agents always know what to build and why.

The rationale and concepts come from agile methodologies that have been used across the industry with great success as a
mental framework.

If at any time you are unsure what to do, the `bmad-help` skill will help you stay on track or know what to do next. You
can always refer to this for reference also - but `bmad-help` is fully interactive and much quicker if you have already
installed the BMad Method. Additionally, if you are using different modules that have extended the BMad Method or added
other complementary non-extension modules - `bmad-help` evolves to know all that is available to give you the best
in-the-moment advice.

Final important note: Every workflow below can be run directly with your tool of choice via skill or by loading an agent
first and using the entry from the agents menu.

BMad Method Workflow Map

→ arrows show artifact flow between workflows

1

Analysis

Optional

brainstormopt

M

Mary

brainstorming-report.md

researchopt

M

Mary

findings

product-briefor ↓

M

Mary

product-brief.md →

prfaqor ↑

M

Mary

prfaq.md →

→

2

Planning

prd

J

John

prd.md →

Has UI?

uxif yes

S

Sally

DESIGN.md + EXPERIENCE.md →

→

3

Solutioning

create-architecture

W

Winston

architecture.md →

create-epics-and-stories

J

John

epics.md →

check-implementation-readiness

J

John

gate check

→

4

Implementation

sprint-planning

A

Amelia

sprint-status.yaml →

create-story

A

Amelia

story-\[slug\].md →

dev-story

A

Amelia

code →

code-review

A

Amelia

approve

correct-coursead-hoc

J

John

updated plan

retrospectiveper epic

A

Amelia

lessons

⚡

## Quick Flow (Parallel Track)

For small, well-understood changes — skip phases 1-3

A

Amelia

`quick-dev`

intent → tech-spec → working code

📚 Context Flow

Each document becomes context for the next phase.

`create-story`loads epics, PRD, architecture, UX`dev-story`loads story file`code-review`loads architecture, story`quick-dev`clarify, plan, implement, review

Analysis

Planning

Solutioning

Implementation

Quick Flow

[Open diagram in new tab ↗](https://docs.bmad-method.org/workflow-map-diagram.html)

## Phase 1: Analysis (Optional)

[Section titled “Phase 1: Analysis (Optional)”](https://docs.bmad-method.org/reference/workflow-map/#phase-1-analysis-optional)

Explore the problem space and validate ideas before committing to planning. [**Learn what each tool does and when to use**\\
**it**](https://docs.bmad-method.org/explanation/analysis-phase/).

| Workflow | Purpose | Produces |
| --- | --- | --- |
| `bmad-brainstorming` | Brainstorm Project Ideas with guided facilitation of a brainstorming coach | `brainstorm.html` keepsake plus an optional `brainstorm-intent.md` |
| `bmad-forge-idea` | Pressure-test an idea until it hardens, proves out, or dies cheaply | `forge-report.html` every run; `forged-idea.md` when an idea hardens |
| `bmad-domain-research`, `bmad-market-research`, `bmad-technical-research` | Validate market, technical, or domain assumptions | Research findings |
| `bmad-product-brief` | Capture strategic vision — best when your concept is clear | `brief.md` \+ `addendum.md`, plus any desired HTML or presentation output |
| `bmad-prfaq` | Working Backwards — stress-test your product concept customer-first | `prfaq-{project}.md` |

## Phase 2: Planning

[Section titled “Phase 2: Planning”](https://docs.bmad-method.org/reference/workflow-map/#phase-2-planning)

Define what to build and for whom.

| Workflow | Purpose | Produces |
| --- | --- | --- |
| `bmad-prd` | Create, update, or validate a PRD — facilitated discovery, three intents in one skill | Create/Update: `prd.md`, `addendum.md`, `.memlog.md`; Validate: `validation-report.html` \+ `.md` |
| `bmad-ux` | Design user experience (when UX matters) — DESIGN.md (visual) + EXPERIENCE.md (behavioral) spine pair | `DESIGN.md`, `EXPERIENCE.md`, `.memlog.md` |

## Phase 3: Solutioning

[Section titled “Phase 3: Solutioning”](https://docs.bmad-method.org/reference/workflow-map/#phase-3-solutioning)

Decide how to build it and break work into stories.

| Workflow | Purpose | Produces |
| --- | --- | --- |
| `bmad-architecture` | Make technical decisions explicit | `ARCHITECTURE-SPINE.md` is the spine by default but can hydrate to your desired output or presentation needs also |
| `bmad-create-epics-and-stories` | Break requirements into implementable work | Epic files with stories |
| `bmad-check-implementation-readiness` | Gate check before implementation | PASS/CONCERNS/FAIL decision |

## Phase 4: Implementation

[Section titled “Phase 4: Implementation”](https://docs.bmad-method.org/reference/workflow-map/#phase-4-implementation)

Build it, one story at a time. Phase 4 epic and story automation is now available also. So you can choose how you want to stay in the loop. You can choose the full flow, or go right to quick flow.

| Workflow | Purpose | Produces |
| --- | --- | --- |
| `bmad-sprint-planning` | Initialize tracking (once per project to sequence the dev cycle) | `sprint-status.yaml` |
| `bmad-create-story` | Prepare next story for implementation | `story-[slug].md` |
| `bmad-dev-story` | Implement the story | Working code + tests |
| `bmad-code-review` | Validate implementation quality | Approved or changes requested |
| `bmad-correct-course` | Handle significant mid-sprint changes | Updated plan or re-routing |
| `bmad-sprint-status` | Track sprint progress and story status | Sprint status update |
| `bmad-retrospective` | Review after epic completion | Lessons learned |

## Quick Flow (Parallel Track)

[Section titled “Quick Flow (Parallel Track)”](https://docs.bmad-method.org/reference/workflow-map/#quick-flow-parallel-track)

Skip phases 1-3 for small, well-understood work.

| Workflow | Purpose | Produces |
| --- | --- | --- |
| `bmad-quick-dev` | Unified quick flow — clarify intent, plan, implement, review, and present | `spec-*.md` \+ code |
| `bmad-dev-auto` | Runs one unattended development-loop iteration — small intent in, code out | `spec-*.md` \+ code |

For the reference on unattended development loops with `bmad-dev-auto`, see [Autonomous Development Loops](https://docs.bmad-method.org/reference/dev-auto/).

## Context Management

[Section titled “Context Management”](https://docs.bmad-method.org/reference/workflow-map/#context-management)

Each document becomes context for the next phase. The PRD tells the architect what constraints matter. The architecture
tells the dev agent which patterns to follow. Story files give focused, complete context for implementation. Without
this structure, agents make inconsistent decisions.

### Project Context

[Section titled “Project Context”](https://docs.bmad-method.org/reference/workflow-map/#project-context)

**How to create it:**

- **Manually** — Create `_bmad-output/project-context.md` with your technology stack and implementation rules
- **Generate it** — Run `bmad-generate-project-context` to auto-generate from your architecture or codebase

[**Learn more about project-context.md**](https://docs.bmad-method.org/explanation/project-context/)


## Source: https://docs.bmad-method.org/reference/agents/

[Skip to content](https://docs.bmad-method.org/reference/agents/#_top)

# Agents

## Default Agents

[Section titled “Default Agents”](https://docs.bmad-method.org/reference/agents/#default-agents)

This page lists the default BMM (Agile suite) agents that install with BMad Method, along with their skill IDs, menu triggers, and primary workflows. Each agent is invoked as a skill.

## Notes

[Section titled “Notes”](https://docs.bmad-method.org/reference/agents/#notes)

- Each agent is available as a skill, generated by the installer. The skill ID (e.g., `bmad-agent-dev`) is used to invoke the agent.
- Triggers are the short menu codes (e.g., `PRD`) and fuzzy matches shown in each agent menu.
- QA test generation is handled by the `bmad-qa-generate-e2e-tests` workflow skill, available through the Developer agent. The full Test Architect (TEA) lives in its own module.

| Agent | Skill ID | Triggers | Primary workflows |
| --- | --- | --- | --- |
| Analyst (Mary) | `bmad-agent-analyst` | `BP`, `MR`, `DR`, `TR`, `CB`, `WB`, `DP` | Brainstorm, Market Research, Domain Research, Technical Research, Create Brief, PRFAQ Challenge, Document Project |
| Product Manager (John) | `bmad-agent-pm` | `PRD`, `CE`, `IR`, `CC` | Create/Update/Validate PRD, Create Epics and Stories, Implementation Readiness, Correct Course |
| Architect (Winston) | `bmad-agent-architect` | `CA`, `IR` | Create Architecture, Implementation Readiness |
| Developer (Amelia) | `bmad-agent-dev` | `DS`, `QD`, `QA`, `CR`, `SP`, `CS`, `ER` | Dev Story, Quick Dev, QA Test Generation, Code Review, Sprint Planning, Create Story, Epic Retrospective |
| UX Designer (Sally) | `bmad-agent-ux-designer` | `CU` | Create UX Design |
| Technical Writer (Paige) | `bmad-agent-tech-writer` | `DP`, `WD`, `MG`, `VD`, `EC` | Document Project, Write Document, Mermaid Generate, Validate Doc, Explain Concept |

## Trigger Types

[Section titled “Trigger Types”](https://docs.bmad-method.org/reference/agents/#trigger-types)

Agent menu triggers use two different invocation types. Knowing which type a trigger uses helps you provide the right input.

### Workflow triggers (no arguments needed)

[Section titled “Workflow triggers (no arguments needed)”](https://docs.bmad-method.org/reference/agents/#workflow-triggers-no-arguments-needed)

Most triggers load a structured workflow file. Type the trigger code and the agent starts the workflow, prompting you for input at each step.

Examples: `PRD` (Create, update, or validate PRD), `DS` (Dev Story), `CA` (Create Architecture), `QD` (Quick Dev)

### Conversational triggers (arguments required)

[Section titled “Conversational triggers (arguments required)”](https://docs.bmad-method.org/reference/agents/#conversational-triggers-arguments-required)

Some triggers start a free-form conversation instead of a structured workflow. These expect you to describe what you need alongside the trigger code.

| Agent | Trigger | What to provide |
| --- | --- | --- |
| Technical Writer (Paige) | `WD` | Description of the document to write |
| Technical Writer (Paige) | `MG` | Diagram description and type (sequence, flowchart, etc.) |
| Technical Writer (Paige) | `VD` | Document to validate and focus areas |
| Technical Writer (Paige) | `EC` | Concept name to explain |

**Example:**

```
WD Write a deployment guide for our Docker setup

MG Create a sequence diagram showing the auth flow

EC Explain how the module system works
```


## Source: https://docs.bmad-method.org/reference/core-tools/

[Skip to content](https://docs.bmad-method.org/reference/core-tools/#_top)

# Core Tools

Every BMad installation includes a set of core skills that can be used in conjunction with any anything you are doing — standalone tasks and workflows that work across all projects, all modules, and all phases. These are always available regardless of which optional modules you install.

## Overview

[Section titled “Overview”](https://docs.bmad-method.org/reference/core-tools/#overview)

| Tool | Type | Purpose |
| --- | --- | --- |
| [`bmad-help`](https://docs.bmad-method.org/reference/core-tools/#bmad-help) | Task | Get context-aware guidance on what to do next |
| [`bmad-brainstorming`](https://docs.bmad-method.org/reference/core-tools/#bmad-brainstorming) | Workflow | Facilitate interactive brainstorming sessions |
| [`bmad-party-mode`](https://docs.bmad-method.org/reference/core-tools/#bmad-party-mode) | Workflow | Orchestrate multi-agent group discussions |
| [`bmad-forge-idea`](https://docs.bmad-method.org/reference/core-tools/#bmad-forge-idea) | Workflow | Pressure-test an idea until it hardens, proves out, or dies cheaply |
| [`bmad-spec`](https://docs.bmad-method.org/reference/core-tools/#bmad-spec) | Workflow | Distill any intent input into a SPEC kernel and companions, the canonical contract for downstream work |
| [`bmad-advanced-elicitation`](https://docs.bmad-method.org/reference/core-tools/#bmad-advanced-elicitation) | Task | Push LLM output through iterative refinement methods |
| [`bmad-review-adversarial-general`](https://docs.bmad-method.org/reference/core-tools/#bmad-review-adversarial-general) | Task | Cynical review that finds what’s missing and what’s wrong |
| [`bmad-review-edge-case-hunter`](https://docs.bmad-method.org/reference/core-tools/#bmad-review-edge-case-hunter) | Task | Exhaustive branching-path analysis for unhandled edge cases |
| [`bmad-editorial-review-prose`](https://docs.bmad-method.org/reference/core-tools/#bmad-editorial-review-prose) | Task | Clinical copy-editing for communication clarity |
| [`bmad-editorial-review-structure`](https://docs.bmad-method.org/reference/core-tools/#bmad-editorial-review-structure) | Task | Structural editing — cuts, merges, and reorganization |
| [`bmad-shard-doc`](https://docs.bmad-method.org/reference/core-tools/#bmad-shard-doc) | Task | Split large markdown files into organized sections |
| [`bmad-index-docs`](https://docs.bmad-method.org/reference/core-tools/#bmad-index-docs) | Task | Generate or update an index of all docs in a folder |
| [`bmad-customize`](https://docs.bmad-method.org/reference/core-tools/#bmad-customize) | Task | Create and verify BMad customization overrides |

## bmad-help

[Section titled “bmad-help”](https://docs.bmad-method.org/reference/core-tools/#bmad-help)

**Your intelligent guide to what comes next.** — Inspects your project state, detects what’s been done, and recommends the next required or optional step.

**Use it when:**

- You finished a workflow and want to know what’s next
- You’re new to BMad and need orientation
- You’re stuck and want context-aware advice
- You installed new modules and want to see what’s available

**How it works:**

1. Scans your project for existing artifacts (PRD, architecture, stories, etc.)
2. Detects which modules are installed and their available workflows
3. Recommends next steps in priority order — required steps first, then optional
4. Presents each recommendation with the skill command and a brief description

**Input:** Optional query in natural language (e.g., `bmad-help I have a SaaS idea, where do I start?`)

**Output:** Prioritized list of recommended next steps with skill commands

## bmad-brainstorming

[Section titled “bmad-brainstorming”](https://docs.bmad-method.org/reference/core-tools/#bmad-brainstorming)

**Generate diverse ideas through interactive creative techniques.** — A facilitated brainstorming session that loads proven ideation methods from a technique library and guides you toward 100+ ideas before organizing.

**Use it when:**

- You’re starting a new project and need to explore the problem space
- You’re stuck generating ideas and need structured creativity
- You want to use proven ideation frameworks (SCAMPER, reverse brainstorming, etc.)

**How it works:**

1. Sets up a brainstorming session with your topic
2. Loads creative techniques from a method library
3. Guides you through technique after technique, generating ideas
4. Applies anti-bias protocol — shifts creative domain every 10 ideas to prevent clustering
5. Produces an append-only session document with all ideas organized by technique

**Input:** Brainstorming topic or problem statement, optional context file

**Output:** a self-contained `brainstorm.html` keepsake of the session, an optional `brainstorm-intent.md` for downstream skills, and a `.memlog.md` session record

## bmad-party-mode

[Section titled “bmad-party-mode”](https://docs.bmad-method.org/reference/core-tools/#bmad-party-mode)

**Orchestrate multi-agent group discussions.** — Loads all installed BMad agents and facilitates a natural conversation where each agent contributes from their unique expertise and personality.

**Use it when:**

- You need multiple expert perspectives on a decision
- You want agents to challenge each other’s assumptions
- You’re exploring a complex topic that spans multiple domains

**How it works:**

1. Loads the agent manifest with all installed agent personalities
2. Analyzes your topic to select 2–3 most relevant agents
3. Agents take turns contributing, with natural cross-talk and disagreements
4. Rotates agent participation to ensure diverse perspectives over time
5. Exit with `goodbye`, `end party`, or `quit`

**Input:** Discussion topic or question, along with specification of personas you would like to participate (optional)

**Output:** Real-time multi-agent conversation with maintained agent personalities

## bmad-forge-idea

[Section titled “bmad-forge-idea”](https://docs.bmad-method.org/reference/core-tools/#bmad-forge-idea)

**Pressure-test an idea until it hardens, proves out, or dies cheaply.** — An adversarial interrogator drives a half-formed idea one question at a time, bringing two characters to every branch, until what survives is something you can act on with conviction.

**Use it when:**

- You hold an idea and want it stress-tested before you invest in it
- You want an honest read on whether to kill it
- You need a thinking partner that pushes back instead of agreeing

**How it works:**

1. Establishes the goal up front and steers the questioning to match it
2. Works one question at a time in dependency order, putting a recommended answer on the table to push against
3. Brings two voices to every branch — one from your installed roster, one conjured by the topic
4. Challenges fuzzy terms and tests claims against an existing project’s material
5. Lands as Hardened, Killed, or Clearer, with a self-contained report you can keep

**Input:** The idea, in any domain — a feature, a business model, a research hypothesis, a life decision

**Output:** A `forged-idea.md` distillate when an idea hardens (optional), plus a `forge-report.html` keepsake every run

## bmad-spec

[Section titled “bmad-spec”](https://docs.bmad-method.org/reference/core-tools/#bmad-spec)

**Distill any intent input into the canonical SPEC contract for downstream work.** Takes a brief, PRD, GDD, RFC, brain dump, transcript, UX folder, or mixed multi-source input and produces a `SPEC.md` carrying the five-field kernel (Why, Capabilities, Constraints, Non-goals, Success signal) plus companion files for load-bearing content that does not fit the kernel.

**Use it when:**

- You need to lock the WHAT before the HOW for any kind of work (software, game design, research, editorial, policy, business).
- You want a LLM Optimized succinct, no-fluff contract that downstream skills can consume without re-reading every upstream artifact.
- You want to validate or update an existing spec.

**How it works:**

1. Reads the input and any ancillary linked materials.
2. Distills into the five-field kernel using a configurable template; routes overflow into appropriately-named companions.
3. Runs a two-pass self-validate (coherence rules, then preservation of every load-bearing source claim).
4. Writes `SPEC.md`, sibling companions, and a `.memlog.md` under `{output_folder}/specs/spec-{slug}/`.

Spec Law enforces eight rules: capabilities carry both intent and success; intents are WHAT not HOW; constraints actually bend decisions; non-goals are explicit; success signals are concrete; capability IDs are stable; every load-bearing source claim is preserved; prose is lean.

**Input:**

- `input` (required) — path or inline text. Vague idea, brain dump, PRD, GDD, RFC, brief, transcript, mockup folder, mixed multi-source.
- `slug` (optional) — required only when input is sparse and no slug is derivable from a source filename.
- `target_spec_path` (optional) — set to update an existing spec instead of creating a new one.

**Output:** Spec folder containing `SPEC.md`, any companion files, and a `.memlog.md`. Headless callers receive a JSON response with the result status and the list of files written or modified.

## bmad-advanced-elicitation

[Section titled “bmad-advanced-elicitation”](https://docs.bmad-method.org/reference/core-tools/#bmad-advanced-elicitation)

**Push LLM output through iterative refinement methods.** — Selects from a library of elicitation techniques to systematically improve content through multiple passes.

**Use it when:**

- LLM output feels shallow or generic
- You want to explore a topic from multiple analytical angles
- You’re refining a critical document and want deeper thinking

**How it works:**

1. Loads method registry with 5+ elicitation techniques
2. Selects 5 best-fit methods based on content type and complexity
3. Presents an interactive menu — pick a method, reshuffle, or list all
4. Applies the selected method to enhance the content
5. Re-presents options for iterative improvement until you select “Proceed”

**Input:** Content section to enhance

**Output:** Enhanced version of the content with improvements applied

## bmad-review-adversarial-general

[Section titled “bmad-review-adversarial-general”](https://docs.bmad-method.org/reference/core-tools/#bmad-review-adversarial-general)

**Cynical review that assumes problems exist and searches for them.** — Takes a skeptical, jaded reviewer perspective with zero patience for sloppy work. Looks for what’s missing, not just what’s wrong.

**Use it when:**

- You need quality assurance before finalizing a deliverable
- You want to stress-test a spec, story, or document
- You want to find gaps in coverage that optimistic reviews miss

**How it works:**

1. Reads the content with a cynical, critical perspective
2. Identifies issues across completeness, correctness, and quality
3. Searches specifically for what’s missing — not just what’s present and wrong
4. Must find a minimum of 10 issues or re-analyzes deeper

**Input:**

- `content` (required) — Diff, spec, story, doc, or any artifact
- `also_consider` (optional) — Additional areas to keep in mind

**Output:** Markdown list of 10+ findings with descriptions

## bmad-review-edge-case-hunter

[Section titled “bmad-review-edge-case-hunter”](https://docs.bmad-method.org/reference/core-tools/#bmad-review-edge-case-hunter)

**Walk every branching path and boundary condition, report only unhandled cases.** — Pure path-tracing methodology that mechanically derives edge classes. Orthogonal to adversarial review — method-driven, not attitude-driven.

**Use it when:**

- You want exhaustive edge case coverage for code or logic
- You need a complement to adversarial review (different methodology, different findings)
- You’re reviewing a diff or function for boundary conditions

**How it works:**

1. Enumerates all branching paths in the content
2. Derives edge classes mechanically: missing else/default, unguarded inputs, off-by-one, arithmetic overflow, implicit type coercion, race conditions, timeout gaps
3. Tests each path against existing guards
4. Reports only unhandled paths — silently discards handled ones

**Input:**

- `content` (required) — Diff, full file, or function
- `also_consider` (optional) — Additional areas to keep in mind

**Output:** JSON array of findings, each with `location`, `trigger_condition`, `guard_snippet`, and `potential_consequence`

**Deletion check (secondary):** When the diff removes meaningful code, the hunter also flags deletions that drop behavior or contracts without replacement, tagged `kind: deletion` in the same array.

## bmad-editorial-review-prose

[Section titled “bmad-editorial-review-prose”](https://docs.bmad-method.org/reference/core-tools/#bmad-editorial-review-prose)

**Clinical copy-editing focused on communication clarity.** — Reviews text for issues that impede comprehension. Applies Microsoft Writing Style Guide baseline. Preserves author voice.

**Use it when:**

- You’ve drafted a document and want to polish the writing
- You need to ensure clarity for a specific audience
- You want communication fixes without style opinion changes

**How it works:**

1. Reads the content, skipping code blocks and frontmatter
2. Identifies communication issues (not style preferences)
3. Deduplicates same issues across multiple locations
4. Produces a three-column fix table

**Input:**

- `content` (required) — Markdown, plain text, or XML
- `style_guide` (optional) — Project-specific style guide
- `reader_type` (optional) — `humans` (default) for clarity/flow, or `llm` for precision/consistency

**Output:** Three-column markdown table: Original Text \| Revised Text \| Changes

## bmad-editorial-review-structure

[Section titled “bmad-editorial-review-structure”](https://docs.bmad-method.org/reference/core-tools/#bmad-editorial-review-structure)

**Structural editing — proposes cuts, merges, moves, and condensing.** — Reviews document organization and proposes substantive changes to improve clarity and flow before copy editing.

**Use it when:**

- A document was produced from multiple subprocesses and needs structural coherence
- You want to reduce document length while preserving comprehension
- You need to identify scope violations or buried critical information

**How it works:**

1. Analyzes document against 5 structure models (Tutorial, Reference, Explanation, Prompt, Strategic)
2. Identifies redundancies, scope violations, and buried information
3. Produces prioritized recommendations: CUT, MERGE, MOVE, CONDENSE, QUESTION, PRESERVE
4. Estimates total reduction in words and percentage

**Input:**

- `content` (required) — Document to review
- `purpose` (optional) — Intended purpose (e.g., “quickstart tutorial”)
- `target_audience` (optional) — Who reads this
- `reader_type` (optional) — `humans` or `llm`
- `length_target` (optional) — Target reduction (e.g., “30% shorter”)

**Output:** Document summary, prioritized recommendation list, and estimated reduction

## bmad-shard-doc

[Section titled “bmad-shard-doc”](https://docs.bmad-method.org/reference/core-tools/#bmad-shard-doc)

**Split large markdown files into organized section files.** — Uses level-2 headers as split points to create a folder of self-contained section files with an index.

**Use it when:**

- A markdown document has grown too large to manage effectively (500+ lines)
- You want to break a monolithic doc into navigable sections
- You need separate files for parallel editing or LLM context management

**How it works:**

1. Validates the source file exists and is markdown
2. Splits on level-2 (`##`) headers into numbered section files
3. Creates an `index.md` with section manifest and links
4. Prompts you to delete, archive, or keep the original

**Input:** Source markdown file path, optional destination folder

**Output:** Folder with `index.md` and `01-{section}.md`, `02-{section}.md`, etc.

## bmad-index-docs

[Section titled “bmad-index-docs”](https://docs.bmad-method.org/reference/core-tools/#bmad-index-docs)

**Generate or update an index of all documents in a folder.** — Scans a directory, reads each file to understand its purpose, and produces an organized `index.md` with links and descriptions.

**Use it when:**

- You need a lightweight index for quick LLM scanning of available docs
- A documentation folder has grown and needs an organized table of contents
- You want an auto-generated overview that stays current

**How it works:**

1. Scans the target directory for all non-hidden files
2. Reads each file to understand its actual purpose
3. Groups files by type, purpose, or subdirectory
4. Generates concise descriptions (3–10 words each)

**Input:** Target folder path

**Output:**`index.md` with organized file listings, relative links, and brief descriptions

## bmad-customize

[Section titled “bmad-customize”](https://docs.bmad-method.org/reference/core-tools/#bmad-customize)

**Create and verify customization overrides.** — Helps you change how an installed BMad agent or workflow behaves without hand-authoring TOML.

**Use it when:**

- You want to change an agent or workflow behavior
- You need to add persistent facts, activation hooks, or custom menu items
- You want the right override scope selected and verified automatically

**How it works:**

1. Scans installed BMad skills for customizable surfaces
2. Selects the right scope for your requested change
3. Writes override files under `_bmad/custom/`
4. Verifies the merged configuration

**Input:** Natural language description of the customization you want

**Output:** TOML override files under `_bmad/custom/`

For a detailed guide on customizing BMad, see [How to Customize BMad](https://docs.bmad-method.org/how-to/customize-bmad/).


## Source: https://docs.bmad-method.org/reference/commands/

[Skip to content](https://docs.bmad-method.org/reference/commands/#_top)

# Skills

Skills are pre-built prompts that load agents, run workflows, or execute tasks inside your IDE. The BMad installer generates them from your installed modules at install time. If you later add, remove, or change modules, re-run the installer to keep skills in sync (see [Troubleshooting](https://docs.bmad-method.org/reference/commands/#troubleshooting)).

## Skills vs. Agent Menu Triggers

[Section titled “Skills vs. Agent Menu Triggers”](https://docs.bmad-method.org/reference/commands/#skills-vs-agent-menu-triggers)

BMad offers two ways to start work, and they serve different purposes.

| Mechanism | How you invoke it | What happens |
| --- | --- | --- |
| **Skill** | Type the skill name (e.g. `bmad-help`) in your IDE | Directly loads an agent, runs a workflow, or executes a task |
| **Agent menu trigger** | Load an agent first, then type a short code (e.g. `DS`) | The agent interprets the code and starts the matching workflow while staying in character |

Agent menu triggers require an active agent session. Use skills when you know which workflow you want. Use triggers when you are already working with an agent and want to switch tasks without leaving the conversation.

## How Skills Are Generated

[Section titled “How Skills Are Generated”](https://docs.bmad-method.org/reference/commands/#how-skills-are-generated)

When you run `npx bmad-method install`, the installer reads the manifests for every selected module and writes one skill per agent, workflow, task, and tool. Each skill is a directory containing a `SKILL.md` file that instructs the AI to load the corresponding source file and follow its instructions.

The installer uses templates for each skill type:

| Skill type | What the generated file does |
| --- | --- |
| **Agent launcher** | Loads the agent persona file, activates its menu, and stays in character |
| **Workflow skill** | Loads the workflow config and follows its steps |
| **Task skill** | Loads a standalone task file and follows its instructions |
| **Tool skill** | Loads a standalone tool file and follows its instructions |

## Where Skill Files Live

[Section titled “Where Skill Files Live”](https://docs.bmad-method.org/reference/commands/#where-skill-files-live)

The installer writes skill files into an IDE-specific directory inside your project. The exact path depends on which IDE you selected during installation.

| IDE / CLI | Skills directory |
| --- | --- |
| Claude Code | `.claude/skills/` |
| Cursor | `.agents/skills/` |
| Windsurf | `.agents/skills/` |
| Other IDEs | See the installer output for the target path |

Each skill is a directory containing a `SKILL.md` file. For example, a Claude Code installation looks like:

```
.claude/skills/

├── bmad-help/

│   └── SKILL.md

├── bmad-prd/

│   └── SKILL.md

├── bmad-agent-dev/

│   └── SKILL.md

└── ...
```

The directory name determines the skill name in your IDE. For example, the directory `bmad-agent-dev/` registers the skill `bmad-agent-dev`.

## How to Discover Your Skills

[Section titled “How to Discover Your Skills”](https://docs.bmad-method.org/reference/commands/#how-to-discover-your-skills)

Type the skill name in your IDE to invoke it. Some platforms require you to enable skills in settings before they appear.

Run `bmad-help` for context-aware guidance on your next step.

## Skill Categories

[Section titled “Skill Categories”](https://docs.bmad-method.org/reference/commands/#skill-categories)

### Agent Skills

[Section titled “Agent Skills”](https://docs.bmad-method.org/reference/commands/#agent-skills)

Agent skills load a specialized AI persona with a defined role, communication style, and menu of workflows. Once loaded, the agent stays in character and responds to menu triggers.

| Example skill | Agent | Role |
| --- | --- | --- |
| `bmad-agent-dev` | Amelia (Developer) | Implements stories with strict adherence to specs |
| `bmad-agent-pm` | John (Product Manager) | Creates and validates PRDs |
| `bmad-agent-architect` | Winston (Architect) | Designs system architecture |

See [Agents](https://docs.bmad-method.org/reference/agents/) for the full list of default agents and their triggers.

### Workflow Skills

[Section titled “Workflow Skills”](https://docs.bmad-method.org/reference/commands/#workflow-skills)

Workflow skills run a structured, multi-step process without loading an agent persona first. They load a workflow configuration and follow its steps.

| Example skill | Purpose |
| --- | --- |
| `bmad-product-brief` | Create or update a product brief — guided discovery when your concept is clear |
| `bmad-prfaq` | [Working Backwards PRFAQ](https://docs.bmad-method.org/explanation/analysis-phase/#prfaq-working-backwards) challenge to stress-test your product concept |
| `bmad-prd` | Create, update, or validate a Product Requirements Document |
| `bmad-ux` | Design user experience |
| `bmad-create-architecture` | Design system architecture |
| `bmad-create-epics-and-stories` | Create epics and stories |
| `bmad-dev-story` | Implement a story |
| `bmad-code-review` | Run a code review |
| `bmad-quick-dev` | Implement a story or any other small intent — clarify, plan, implement, review, present |
| `bmad-dev-auto` | Run one unattended development-loop iteration — small intent in, code out, no human interaction |

See [Workflow Map](https://docs.bmad-method.org/reference/workflow-map/) for the complete workflow reference organized by phase.

### Task and Tool Skills

[Section titled “Task and Tool Skills”](https://docs.bmad-method.org/reference/commands/#task-and-tool-skills)

Tasks and tools are standalone operations that do not require an agent or workflow context.

**BMad-Help: Your Intelligent Guide**

`bmad-help` is your primary interface for discovering what to do next. It inspects your project, understands natural language queries, and recommends the next required or optional step based on your installed modules.

**Other Core Tasks and Tools**

The core module includes 12 built-in tools — specs, reviews, brainstorming, customization, document management, and more. See [Core Tools](https://docs.bmad-method.org/reference/core-tools/) for the complete reference.

## Naming Convention

[Section titled “Naming Convention”](https://docs.bmad-method.org/reference/commands/#naming-convention)

All skills use the `bmad-` prefix followed by a descriptive name (e.g., `bmad-agent-dev`, `bmad-prd`, `bmad-help`). See [Modules](https://docs.bmad-method.org/reference/modules/) for available modules.

## Troubleshooting

[Section titled “Troubleshooting”](https://docs.bmad-method.org/reference/commands/#troubleshooting)

**Skills not appearing after install.** Some platforms require skills to be explicitly enabled in settings. Check your IDE’s documentation or ask your AI assistant how to enable skills. You may also need to restart your IDE or reload the window.

**Expected skills are missing.** The installer only generates skills for modules you selected. Run `npx bmad-method install` again and verify your module selection. Check that the skill files exist in the expected directory.

**Skills from a removed module still appear.** The installer does not delete old skill files automatically. Remove the stale directories from your IDE’s skills directory, or delete the entire skills directory and re-run the installer for a clean set.


## Source: https://docs.bmad-method.org/reference/modules/

[Skip to content](https://docs.bmad-method.org/reference/modules/#_top)

# Official Modules

BMad extends through official modules that you select during installation. These add-on modules provide specialized agents, workflows, and tasks for specific domains beyond the built-in core and BMM (Agile suite).

## BMad Builder

[Section titled “BMad Builder”](https://docs.bmad-method.org/reference/modules/#bmad-builder)

Create custom agents, workflows, and domain-specific modules with guided assistance. BMad Builder is the meta-module for extending the framework itself.

- **Code:**`bmb`
- **npm:** [`bmad-builder`](https://www.npmjs.com/package/bmad-builder)
- **GitHub:** [bmad-code-org/bmad-builder](https://github.com/bmad-code-org/bmad-builder)

**Provides:**

- Agent Builder — create specialized AI agents with custom expertise and tool access
- Workflow Builder — design structured processes with steps and decision points
- Module Builder — package agents and workflows into shareable, publishable modules
- Interactive setup with YAML configuration and npm publishing support

## Creative Intelligence Suite

[Section titled “Creative Intelligence Suite”](https://docs.bmad-method.org/reference/modules/#creative-intelligence-suite)

AI-powered tools for structured creativity, ideation, and innovation during early-stage development. The suite provides multiple agents that facilitate brainstorming, design thinking, and problem-solving using proven frameworks.

- **Code:**`cis`
- **npm:** [`bmad-creative-intelligence-suite`](https://www.npmjs.com/package/bmad-creative-intelligence-suite)
- **GitHub:** [bmad-code-org/bmad-module-creative-intelligence-suite](https://github.com/bmad-code-org/bmad-module-creative-intelligence-suite)

**Provides:**

- Innovation Strategist, Design Thinking Coach, and Brainstorming Coach agents
- Problem Solver and Creative Problem Solver for systematic and lateral thinking
- Storyteller and Presentation Master for narratives and pitches
- Ideation frameworks including SCAMPER, Reverse Brainstorming, and problem reframing

## Game Dev Studio

[Section titled “Game Dev Studio”](https://docs.bmad-method.org/reference/modules/#game-dev-studio)

Structured game development workflows adapted for Unity, Unreal, Godot, and custom engines. Supports rapid prototyping through Quick Flow and full-scale production with epic-driven sprints.

- **Code:**`gds`
- **npm:** [`bmad-game-dev-studio`](https://www.npmjs.com/package/bmad-game-dev-studio)
- **GitHub:** [bmad-code-org/bmad-module-game-dev-studio](https://github.com/bmad-code-org/bmad-module-game-dev-studio)

**Provides:**

- Game Design Document (GDD) generation workflow
- Quick Dev mode for rapid prototyping
- Narrative design support for characters, dialogue, and world-building
- Coverage for 21+ game types with engine-specific architecture guidance

## Test Architect (TEA)

[Section titled “Test Architect (TEA)”](https://docs.bmad-method.org/reference/modules/#test-architect-tea)

Enterprise-grade test strategy, automation guidance, and release gate decisions through an expert agent and nine structured workflows. TEA goes well beyond the built-in QA agent with risk-based prioritization and requirements traceability.

- **Code:**`tea`
- **npm:** [`bmad-method-test-architecture-enterprise`](https://www.npmjs.com/package/bmad-method-test-architecture-enterprise)
- **GitHub:** [bmad-code-org/bmad-method-test-architecture-enterprise](https://github.com/bmad-code-org/bmad-method-test-architecture-enterprise)

**Provides:**

- Murat agent (Master Test Architect and Quality Advisor)
- Workflows for test design, ATDD, automation, test review, and traceability
- NFR assessment, CI setup, and framework scaffolding
- P0-P3 prioritization with optional Playwright Utils and MCP integrations

## Community Modules

[Section titled “Community Modules”](https://docs.bmad-method.org/reference/modules/#community-modules)

Community modules and a module marketplace are coming. Check the [BMad GitHub organization](https://github.com/bmad-code-org) for updates.


## Source: https://docs.bmad-method.org/reference/testing/

[Skip to content](https://docs.bmad-method.org/reference/testing/#_top)

# Testing Options

BMad provides two testing paths: a built-in QA workflow for fast test generation and an installable Test Architect module for enterprise-grade test strategy.

## Which Should You Use?

[Section titled “Which Should You Use?”](https://docs.bmad-method.org/reference/testing/#which-should-you-use)

| Factor | Built-in QA | TEA Module |
| --- | --- | --- |
| **Best for** | Small-medium projects, quick coverage | Large projects, regulated or complex domains |
| **Setup** | Nothing to install — included in BMM | Install separately via `npx bmad-method install` |
| **Approach** | Generate tests fast, iterate later | Plan first, then generate with traceability |
| **Test types** | API and E2E tests | API, E2E, ATDD, NFR, and more |
| **Strategy** | Happy path + critical edge cases | Risk-based prioritization (P0-P3) |
| **Workflow count** | 1 (Automate) | 9 (design, ATDD, automate, review, trace, and others) |

## Built-in QA Workflow

[Section titled “Built-in QA Workflow”](https://docs.bmad-method.org/reference/testing/#built-in-qa-workflow)

The built-in QA workflow (`bmad-qa-generate-e2e-tests`) is part of the BMM (Agile suite) module, available through the Developer agent. It generates working tests quickly using your project’s existing test framework — no configuration or additional installation required.

**Trigger:**`QA` (via the Developer agent) or `bmad-qa-generate-e2e-tests`

### What It Does

[Section titled “What It Does”](https://docs.bmad-method.org/reference/testing/#what-it-does)

The QA workflow (Automate) walks through five steps:

1. **Detect test framework** — scans `package.json` and existing test files for your framework (Jest, Vitest, Playwright, Cypress, or any standard runner). If none exists, analyzes the project stack and suggests one.
2. **Identify features** — asks what to test or auto-discovers features in the codebase.
3. **Generate API tests** — covers status codes, response structure, happy path, and 1-2 error cases.
4. **Generate E2E tests** — covers user workflows with semantic locators and visible-outcome assertions.
5. **Run and verify** — executes the generated tests and fixes failures immediately.

The workflow produces a test summary saved to your project’s implementation artifacts folder.

### Test Patterns

[Section titled “Test Patterns”](https://docs.bmad-method.org/reference/testing/#test-patterns)

Generated tests follow a “simple and maintainable” philosophy:

- **Standard framework APIs only** — no external utilities or custom abstractions
- **Semantic locators** for UI tests (roles, labels, text rather than CSS selectors)
- **Independent tests** with no order dependencies
- **No hardcoded waits or sleeps**
- **Clear descriptions** that read as feature documentation

### When to Use Built-in QA

[Section titled “When to Use Built-in QA”](https://docs.bmad-method.org/reference/testing/#when-to-use-built-in-qa)

- Quick test coverage for a new or existing feature
- Beginner-friendly test automation without advanced setup
- Standard test patterns that any developer can read and maintain
- Small-medium projects where comprehensive test strategy is unnecessary

## Test Architect (TEA) Module

[Section titled “Test Architect (TEA) Module”](https://docs.bmad-method.org/reference/testing/#test-architect-tea-module)

TEA is a standalone module that provides an expert agent (Murat) and nine structured workflows for enterprise-grade testing. It goes beyond test generation into test strategy, risk-based planning, quality gates, and requirements traceability.

- **Documentation:** [TEA Module Docs](https://bmad-code-org.github.io/bmad-method-test-architecture-enterprise/)
- **Install:**`npx bmad-method install` and select the TEA module
- **npm:** [`bmad-method-test-architecture-enterprise`](https://www.npmjs.com/package/bmad-method-test-architecture-enterprise)

### What TEA Provides

[Section titled “What TEA Provides”](https://docs.bmad-method.org/reference/testing/#what-tea-provides)

| Workflow | Purpose |
| --- | --- |
| Test Design | Create a comprehensive test strategy tied to requirements |
| ATDD | Acceptance-test-driven development with stakeholder criteria |
| Automate | Generate tests with advanced patterns and utilities |
| Test Review | Validate test quality and coverage against strategy |
| Traceability | Map tests back to requirements for audit and compliance |
| NFR Assessment | Evaluate non-functional requirements (performance, security) |
| CI Setup | Configure test execution in continuous integration pipelines |
| Framework Scaffolding | Set up test infrastructure and project structure |
| Release Gate | Make data-driven go/no-go release decisions |

TEA also supports P0-P3 risk-based prioritization and optional integrations with Playwright Utils and MCP tooling.

### When to Use TEA

[Section titled “When to Use TEA”](https://docs.bmad-method.org/reference/testing/#when-to-use-tea)

- Projects that require requirements traceability or compliance documentation
- Teams that need risk-based test prioritization across many features
- Enterprise environments with formal quality gates before release
- Complex domains where test strategy must be planned before tests are written
- Projects that have outgrown the built-in QA’s single-workflow approach

## How Testing Fits into Workflows

[Section titled “How Testing Fits into Workflows”](https://docs.bmad-method.org/reference/testing/#how-testing-fits-into-workflows)

The QA Automate workflow appears in Phase 4 (Implementation) of the BMad Method workflow map. It is designed to run **after a full epic is complete** — once all stories in an epic have been implemented and code-reviewed. A typical sequence:

1. For each story in the epic: implement with Dev (`DS`), then validate with Code Review (`CR`)
2. After the epic is complete: generate tests with `QA` (via the Developer agent) or TEA’s Automate workflow
3. Run retrospective (`bmad-retrospective`) to capture lessons learned

The built-in QA workflow works directly from source code without loading planning documents (PRD, architecture). TEA workflows can integrate with upstream planning artifacts for traceability.

For more on where testing fits in the overall process, see the [Workflow Map](https://docs.bmad-method.org/reference/workflow-map/).


## Source: https://docs.bmad-method.org/reference/dev-auto/

[Skip to content](https://docs.bmad-method.org/reference/dev-auto/#_top)

# Autonomous Development Loops

To use BMad in an autonomous development loop, use the `bmad-dev-auto` skill. It is like [Quick Dev](https://docs.bmad-method.org/explanation/quick-dev/), but designed to keep moving without human interaction. You can use it in an interactive session, but its main purpose is to be used by an orchestrator.

## What It Does

[Section titled “What It Does”](https://docs.bmad-method.org/reference/dev-auto/#what-it-does)

`bmad-dev-auto` performs one unattended development-loop iteration:

1. Clarify the incoming intent
2. Create (or find and resume) a spec file
3. Implement the change
4. Review the result
5. Finish by writing a terminal status to the spec file or fallback result artifact.

## Prerequisites

[Section titled “Prerequisites”](https://docs.bmad-method.org/reference/dev-auto/#prerequisites)

This skill relies on an ability to run subagents. If subagents are unavailable, the workflow halts `blocked` with `no subagents`. If you invoke the skill itself in a subagent session, e.g. “hey, Claude, implement stories 2-10, using a subagent running bmad-dev-auto skill for each story”, that session will need to spawn its own subagents.

Version control, while optional, is strongly recommended. If it’s present, there must be no uncommitted changes.

## Inputs

[Section titled “Inputs”](https://docs.bmad-method.org/reference/dev-auto/#inputs)

### Primary Invocation Input

[Section titled “Primary Invocation Input”](https://docs.bmad-method.org/reference/dev-auto/#primary-invocation-input)

The main input is the invocation prompt. `bmad-dev-auto` treats that prompt as workflow input, not as a finished implementation plan.

Supported intent shapes include:

- A short free-form change request
- A ticket, issue, or story identifier
- A path to an intent file
- A path to an existing spec file generated by this workflow

### Resume Input

[Section titled “Resume Input”](https://docs.bmad-method.org/reference/dev-auto/#resume-input)

If the invocation points to an existing spec file with one of the known `status` values in the frontmatter, the workflow resumes from that state:

| Spec status | Entry point |
| --- | --- |
| `draft` | plan |
| `ready-for-dev` | implement |
| `in-progress` | implement |
| `in-review` | review |
| `done` | review again as a fresh follow-up pass |
| `blocked` | halt immediately |

### Context Inputs

[Section titled “Context Inputs”](https://docs.bmad-method.org/reference/dev-auto/#context-inputs)

On activation, the workflow resolves:

- `_bmad/bmm/config.yaml`
- Any configured workflow customizations from `customize.toml`, team overrides, and user overrides
- Persistent facts listed in workflow config
- `project-context.md` files, if present

It may also look at:

- BMAD planning artifacts
- A cached or newly compiled epic context file for epic-based work
- The most recent completed prior-story spec from the same epic for continuity

## Spec Status

[Section titled “Spec Status”](https://docs.bmad-method.org/reference/dev-auto/#spec-status)

The spec frontmatter `status` is the main machine-readable state for orchestration:

| Spec Status | Meaning |
| --- | --- |
| `draft` | Spec exists but has not passed ready-for-dev validation |
| `ready-for-dev` | Spec is complete enough to implement |
| `in-progress` | Implementation is underway |
| `in-review` | Review/triage is underway |
| `done` | Workflow completed successfully |
| `blocked` | Workflow cannot safely continue unattended |

### On `done`

[Section titled “On done”](https://docs.bmad-method.org/reference/dev-auto/#on-done)

On successful completion, the workflow writes or updates the spec with:

- Final `status: done`
- An `Auto Run Result` section containing:

  - Summary of implemented change
  - Files changed
  - Review findings breakdown
  - Verification performed
  - Residual risks
- `followup_review_recommended` flag. True if LLM decided another review pass seems worthwhile. It’s a suggestion, not a must. Simplest way to give it a second review pass is to re-run the skill pointing it at the spec file.
- `baseline_revision` and `final_revision` — HEAD before implementation and after the final commit. Together they bracket the run’s commits: `git log baseline_revision..final_revision` lists exactly what it produced, and equal values mean no commits were made. Both are `NO_VCS` when version control is unavailable.

If version control is available, the workflow commits the change. It does not push.

### On `blocked`

[Section titled “On blocked”](https://docs.bmad-method.org/reference/dev-auto/#on-blocked)

On blocked completion, the workflow writes:

- Final `status: blocked` when a spec exists
- A blocking condition
- Supporting detail in the spec or fallback result artifact

Typical blocking conditions include:

- `unclear intent`
- `intent gaps`
- `no subagents`
- `missing spec_file before implementation`
- `implementation verification failed`
- `intent gap in intent contract`
- `review repair loop exceeded 5 iterations (non-convergence)`

## Output Artifacts

[Section titled “Output Artifacts”](https://docs.bmad-method.org/reference/dev-auto/#output-artifacts)

The workflow always tries to leave behind a durable artifact describing what happened.

### Primary Spec Artifact

[Section titled “Primary Spec Artifact”](https://docs.bmad-method.org/reference/dev-auto/#primary-spec-artifact)

For new work, the workflow creates:

`{implementation_artifacts}/spec-<slug>.md`

That spec is the contract between planning, implementation, and review. It contains:

- Frontmatter status
- The immutable `<intent-contract>` block
- Code map
- Tasks and acceptance criteria
- Spec change log
- Review triage log
- Verification notes

### Fallback Result Artifact

[Section titled “Fallback Result Artifact”](https://docs.bmad-method.org/reference/dev-auto/#fallback-result-artifact)

If the workflow halts before it has a valid `spec_file`, it writes:

`{implementation_artifacts}/bmad-dev-auto-result-<slug-or-timestamp>.md`

This records the terminal status and blocking condition.

### Additional Artifacts

[Section titled “Additional Artifacts”](https://docs.bmad-method.org/reference/dev-auto/#additional-artifacts)

Depending on the route, the workflow may also write:

- `{implementation_artifacts}/epic-<N>-context.md`
- `{implementation_artifacts}/deferred-work.md`

## Orchestrator Responsibilities

[Section titled “Orchestrator Responsibilities”](https://docs.bmad-method.org/reference/dev-auto/#orchestrator-responsibilities)

An orchestrator integrating `bmad-dev-auto` should:

- Pass one coherent intent at a time
- Prefer passing a spec path when resuming prior work
- Monitor the produced spec file or fallback result file for terminal state
- Read `status`, `blocking condition`, and `followup_review_recommended` rather than inferring success from chat output alone
- Use `baseline_revision..final_revision` to identify the commits the run produced, rather than inferring them from git state
- Expect autonomous file changes and possibly a local commit
- Handle `blocked` as a routing signal, not just a failure signal

In practice, `blocked` usually means the workflow ran into a situation where unattended execution would be unsafe. That is often the point where a higher-level orchestrator, another workflow, or a human should take over.

After resolving a blocked run, the orchestrator should usually start a fresh `bmad-dev-auto` run. If it reuses prior work, it should pass an explicit known-good spec path rather than relying on implicit discovery.
