# Prompts Module

This module manages LLM prompt templates for the Reddit Product Idea Generator.

## Structure

```
lib/prompts/
├── templates/           # Prompt template files
│   ├── system-prompt.md        # System prompt for OpenAI
│   └── idea-generation-prompt.md  # User prompt template
├── prompt-loader.ts     # Template loader and renderer
├── index.ts            # Module exports
└── README.md           # This file
```

## Usage

```typescript
import { promptLoader } from '@/lib/prompts';

// Load system prompt
const systemPrompt = await promptLoader.getSystemPrompt({
  minScore: 65,
  creativityLevel: 'balanced',
  creativityGuidance: 'Mix proven concepts with creative twists',
});

// Load idea generation prompt
const ideaPrompt = await promptLoader.getIdeaGenerationPrompt({
  contextSection: 'Source subreddits: entrepreneur, startups',
  problemsSection: 'Problems identified...',
  maxIdeas: 5,
  minScore: 65,
  creativityLevel: 'balanced',
  focusCategories: 'All categories',
  totalProblems: 15,
});
```

## Template Variables

### System Prompt Variables

- `{{minScore}}` - Minimum quality score threshold
- `{{creativityLevel}}` - Creative approach level
- `{{creativityGuidance}}` - Specific creativity instructions

### Idea Generation Prompt Variables

- `{{contextSection}}` - Reddit source context
- `{{problemsSection}}` - Identified problems
- `{{maxIdeas}}` - Maximum ideas to generate
- `{{minScore}}` - Quality threshold
- `{{creativityLevel}}` - Creative approach
- `{{focusCategories}}` - Target categories
- `{{totalProblems}}` - Number of problems analyzed

## Features

- ✅ **Template Caching** - Templates are cached for performance
- ✅ **Variable Substitution** - Mustache-style `{{variable}}` replacement
- ✅ **Validation** - Template existence validation
- ✅ **Error Handling** - Graceful error handling with meaningful messages
- ✅ **TypeScript Support** - Full type safety for variables

## Adding New Templates

1. Create a new `.md` file in `templates/`
2. Use `{{variableName}}` for dynamic content
3. Add corresponding interface in `prompt-loader.ts`
4. Add loader method in `PromptLoader` class
5. Export types in `index.ts`
