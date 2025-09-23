/**
 * Prompt Template Loader
 *
 * Handles loading and rendering prompt templates with variable substitution
 */

import fs from 'fs';
import path from 'path';
import type { GenerationConfig } from '../llm/openai-client';

// ============================================================================
// INTERFACES
// ============================================================================

export interface PromptVariables {
  [key: string]: string | number | string[] | undefined;
}

export interface SystemPromptVariables {
  minScore: number;
  creativityLevel: string;
  creativityGuidance: string;
}

export interface IdeaGenerationPromptVariables {
  contextSection: string;
  problemsSection: string;
  maxIdeas: number;
  minScore: number;
  creativityLevel: string;
  focusCategories: string;
  totalProblems: number;
}

// ============================================================================
// PROMPT LOADER CLASS
// ============================================================================

export class PromptLoader {
  private readonly TEMPLATES_DIR = path.join(__dirname, 'templates');
  private templateCache = new Map<string, string>();

  /**
   * Load and render system prompt template
   */
  async getSystemPrompt(variables: SystemPromptVariables): Promise<string> {
    const template = await this.loadTemplate('system-prompt.md');
    return this.renderTemplate(template, variables);
  }

  /**
   * Load and render idea generation prompt template
   */
  async getIdeaGenerationPrompt(
    variables: IdeaGenerationPromptVariables,
  ): Promise<string> {
    const template = await this.loadTemplate('idea-generation-prompt.md');
    return this.renderTemplate(template, variables);
  }

  /**
   * Get creativity guidance text based on level
   */
  getCreativityGuidance(level: GenerationConfig['creativityLevel']): string {
    switch (level) {
      case 'conservative':
        return `- Focus on proven business models and markets
- Emphasize incremental improvements to existing solutions
- Prioritize low-risk, high-probability opportunities`;
      case 'creative':
        return `- Explore novel approaches and emerging trends
- Consider unconventional business models
- Think beyond obvious solutions`;
      default:
        return `- Balance innovation with market validation
- Mix proven concepts with creative twists
- Consider both incremental and breakthrough opportunities`;
    }
  }

  /**
   * Load template from file system with caching
   */
  private async loadTemplate(filename: string): Promise<string> {
    if (this.templateCache.has(filename)) {
      return this.templateCache.get(filename)!;
    }

    try {
      const filePath = path.join(this.TEMPLATES_DIR, filename);
      const content = await fs.promises.readFile(filePath, 'utf-8');

      // Cache the template for future use
      this.templateCache.set(filename, content);

      return content;
    } catch (error) {
      throw new Error(
        `Failed to load prompt template: ${filename}. Error: ${error}`,
      );
    }
  }

  /**
   * Render template with variable substitution
   */
  private renderTemplate(template: string, variables: PromptVariables): string {
    let rendered = template;

    // Replace all template variables {{variableName}}
    for (const [key, value] of Object.entries(variables)) {
      const placeholder = `{{${key}}}`;
      const replacement = Array.isArray(value)
        ? value.join(', ') || 'All categories'
        : String(value ?? '');

      rendered = rendered.replace(new RegExp(placeholder, 'g'), replacement);
    }

    // Check for any unreplaced variables and warn
    const unreplacedVars = rendered.match(/\{\{[^}]+\}\}/g);
    if (unreplacedVars) {
      console.warn('Unreplaced template variables:', unreplacedVars);
    }

    return rendered;
  }

  /**
   * Clear template cache (useful for development/testing)
   */
  clearCache(): void {
    this.templateCache.clear();
  }

  /**
   * Preload all templates for better performance
   */
  async preloadTemplates(): Promise<void> {
    const templates = ['system-prompt.md', 'idea-generation-prompt.md'];

    await Promise.all(
      templates.map(async (template) => {
        try {
          await this.loadTemplate(template);
        } catch (error) {
          console.error(`Failed to preload template ${template}:`, error);
        }
      }),
    );
  }

  /**
   * Validate that all required templates exist
   */
  async validateTemplates(): Promise<{ valid: boolean; missing: string[] }> {
    const requiredTemplates = ['system-prompt.md', 'idea-generation-prompt.md'];
    const missing: string[] = [];

    for (const template of requiredTemplates) {
      try {
        const filePath = path.join(this.TEMPLATES_DIR, template);
        await fs.promises.access(filePath, fs.constants.F_OK);
      } catch {
        missing.push(template);
      }
    }

    return {
      valid: missing.length === 0,
      missing,
    };
  }
}

// Export singleton instance
export const promptLoader = new PromptLoader();
