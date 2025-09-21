# AI Interaction Prompts & Documentation

## 📋 Overview

This document tracks key AI interactions, prompts, and development patterns used during the Reddit Product Idea Generator project development. It serves as a reference for understanding the AI-assisted development workflow.

**Project**: Reddit Product Idea Generator
**AI Assistant**: Claude Sonnet 4 (Cursor)
**Development Time**: 8 hours maximum
**Started**: September 21, 2025

---

## 🎯 Key Development Prompts

### 1. Project Initialization & Setup

**Prompt Category**: Foundation Setup
**Usage**: Project initialization and dependency management

```
Initialize a Next.js project with TypeScript for a Reddit Product Idea Generator SaaS.
Include Supabase for auth/database, Tailwind CSS, Shadcn UI components, and necessary
dependencies for Reddit API and OpenAI integration.
```

**Context**: Used at project start to establish the technical foundation.

---

### 2. Database Schema Design

**Prompt Category**: Database Architecture
**Usage**: Supabase schema creation

```
Design a PostgreSQL schema for a Reddit Product Idea Generator with tables for:
- users (auth integration)
- ideas (generated product ideas with scoring)
- subreddits (tracked subreddits)
- subscriptions (email preferences)
- reddit_posts (source data)

Include proper relationships, indexes, and constraints.
```

**Context**: Core data structure for the MVP.

---

### 3. Reddit API Integration

**Prompt Category**: External API Integration
**Usage**: Reddit data extraction and processing

```
Create a Reddit API client for extracting posts and comments from specific subreddits
focused on problems and pain points. Include rate limiting, error handling, and data
cleaning for LLM processing.
```

**Context**: Primary data source for idea generation.

---

### 4. LLM Integration & Prompt Engineering

**Prompt Category**: AI/LLM Integration
**Usage**: OpenAI API integration for idea generation

```
Implement OpenAI GPT integration to analyze Reddit discussions and generate scored
product ideas. Create structured prompts that extract:
- Problem identification
- Target audience
- Solution concept
- Market viability score (0-100)
- Implementation difficulty
```

**Context**: Core AI functionality for transforming problems into product ideas.

---

### 5. UI Component Development

**Prompt Category**: Frontend Development
**Usage**: React component creation with Shadcn UI

```
Create responsive React components for displaying product ideas including:
- Idea cards with scoring visualization
- Filtering and search interface
- Loading states and error handling
- Mobile-first responsive design using Tailwind CSS
```

**Context**: User interface for browsing and filtering generated ideas.

---

## 🔄 Development Workflow Patterns

### Pattern 1: Incremental Feature Development

1. Define feature requirements from scope.md
2. Break down into smaller components
3. Implement with TypeScript interfaces
4. Add error handling and loading states
5. Test and iterate

### Pattern 2: AI-Assisted Debugging

- Use AI to analyze error messages and suggest fixes
- Leverage AI for code review and optimization suggestions
- Get help with complex integration patterns

### Pattern 3: Documentation-First Approach

- Update this PROMPTS.md file after each major interaction
- Document decision rationale and alternatives considered
- Track prompt evolution and refinement

---

## 📊 Interaction Statistics

| Category        | Count | Success Rate | Notes                  |
| --------------- | ----- | ------------ | ---------------------- |
| Setup & Config  | 0     | -            | Initial project setup  |
| Database Design | 0     | -            | Schema and migrations  |
| API Integration | 0     | -            | Reddit and OpenAI APIs |
| UI Development  | 0     | -            | React components       |
| Debugging       | 0     | -            | Error resolution       |
| Documentation   | 1     | 100%         | This file creation     |

_Statistics will be updated throughout development_

---

## 🎯 Prompt Optimization Notes

### Effective Prompt Strategies

- Provide clear context about project constraints (8-hour limit)
- Reference existing code structure and conventions
- Specify TypeScript and Next.js patterns
- Include error handling requirements
- Request mobile-responsive solutions

### Common Refinements

- Add specific file structure requirements
- Include performance considerations
- Request accessibility compliance
- Specify testing approaches

---

## 🔍 Key Learning Insights

### What Works Well

- Detailed technical requirements in prompts
- Breaking complex features into smaller tasks
- Providing existing code context
- Requesting multiple implementation options

### Areas for Improvement

- More specific error handling requirements
- Better integration testing guidance
- Clearer performance optimization requests

---

## 📝 Development Log

### Session 1 - Project Setup (September 21, 2025)

- **Time**: Start of development
- **Focus**: Foundation setup and documentation
- **Key Interactions**:
  - Project scope review
  - PROMPTS.md initialization
- **Next Steps**: Database schema design and authentication setup

---

## 🚀 Future Prompt Templates

### Template: Feature Implementation

```
Implement [FEATURE_NAME] for the Reddit Product Idea Generator with:
- TypeScript interfaces
- Error handling
- Loading states
- Mobile-responsive design
- Integration with existing [CONTEXT]
- Following Next.js and Supabase best practices
```

### Template: Bug Fix

```
Debug and fix [ISSUE_DESCRIPTION] in [FILE_PATH].
Current error: [ERROR_MESSAGE]
Expected behavior: [EXPECTED_BEHAVIOR]
Relevant code context: [CODE_SNIPPET]
```

### Template: Code Review

```
Review and optimize [COMPONENT/FUNCTION] for:
- Performance
- TypeScript best practices
- Accessibility
- Error handling
- Code maintainability
```

---

_This document will be updated throughout the development process to track AI interactions and improve prompt effectiveness._
