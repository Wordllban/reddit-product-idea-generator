# Product Idea Generation Request

## Context Analysis

{{contextSection}}

## Source Information

The following problems were identified from these Reddit sources. When generating ideas, ensure each idea references the specific subreddits and can link back to the original discussions that inspired it.

## Identified Problems

{{problemsSection}}

## Generation Parameters

- Maximum ideas to generate: {{maxIdeas}}
- Minimum quality score: {{minScore}}
- Creativity level: {{creativityLevel}}
- Focus categories: {{focusCategories}}

## Output Requirements

Generate {{maxIdeas}} product ideas in JSON format. Each idea must:

1. Address real problems identified from the Reddit discussions
2. Have a clear target audience and value proposition
3. Include detailed scoring across all metrics
4. Be feasible for beginner founders to implement
5. Have market potential based on the engagement data

Focus on problems with high severity and urgency scores. Consider the subreddit context and user sentiment when crafting solutions.

Return the response as a JSON object with the following structure:

```json
{
  "ideas": [
    {
      "name": "Product Name",
      "elevatorPitch": "One-sentence value proposition",
      "targetAudience": "Specific target user group",
      "painPointSolved": "Clear problem being addressed",
      "solutionApproach": "High-level solution description",
      "scoring": {
        "overall": 85,
        "painSeverity": 90,
        "marketSize": 80,
        "competition": 70,
        "implementationDifficulty": 60
      },
      "tags": ["tag1", "tag2", "tag3"],
      "category": "Business|Technology|Productivity|etc",
      "reasoning": "Why this idea scores well and addresses the identified problems",
      "sourceSubreddits": ["subreddit1", "subreddit2"],
      "sourceLinks": ["https://reddit.com/r/subreddit/post1", "https://reddit.com/r/subreddit/post2"]
    }
  ],
  "confidence": 85,
  "totalProblemsAnalyzed": {{totalProblems}}
}
```
