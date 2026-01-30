import { GameState } from '../types/gameState';
import { PlayerCharacter } from '../types/character';

export interface VariableInterpolatorI18n {
  formatNumber?(value: number): string;
}

const VARIABLE_PATTERN = /\{\{(.+?)\}\}/g;
const DEFAULT_NUMBER_FORMATTER = new Intl.NumberFormat('bg-BG');

export class VariableInterpolator {
  public static interpolate(
    text: string,
    gameState: GameState,
    character: PlayerCharacter,
    i18n?: VariableInterpolatorI18n
  ): string {
    if (!text.includes('{{')) {
      return text;
    }

    return text.replace(VARIABLE_PATTERN, (match, rawVariable) => {
      const variable = rawVariable.trim();
      const resolved = this.resolveVariable(variable, gameState, character, i18n);

      if (resolved === undefined) {
        console.warn(`Unknown variable: ${variable}`);
        return match;
      }

      return resolved;
    });
  }

  private static resolveVariable(
    variable: string,
    gameState: GameState,
    character: PlayerCharacter,
    i18n?: VariableInterpolatorI18n
  ): string | undefined {
    const conditionalSeparatorIndex = variable.indexOf(':');

    if (conditionalSeparatorIndex !== -1) {
      const type = variable.slice(0, conditionalSeparatorIndex);
      const rest = variable.slice(conditionalSeparatorIndex + 1);

      if (type === 'flag') {
        return this.resolveFlagConditional(rest, gameState);
      }
    }

    const formatterSeparatorIndex = variable.indexOf('|');

    if (formatterSeparatorIndex !== -1) {
      const varName = variable.slice(0, formatterSeparatorIndex).trim();
      const formatter = variable.slice(formatterSeparatorIndex + 1).trim();
      const value = this.getSimpleVariable(varName, gameState, character, i18n);

      if (value === undefined) {
        return undefined;
      }

      return this.formatValue(value, formatter, i18n);
    }

    return this.getSimpleVariable(variable, gameState, character, i18n);
  }

  private static getSimpleVariable(
    name: string,
    gameState: GameState,
    character: PlayerCharacter,
    _i18n?: VariableInterpolatorI18n
  ): string | undefined {
    switch (name) {
      case 'playerName':
        return character.name;
      case 'gold':
        return character.gold.toString();
      case 'level':
        return character.level.toString();
      case 'health':
        return character.health.toString();
      case 'maxHealth':
        return character.maxHealth.toString();
      case 'location':
        return gameState.location;
      case 'day':
        return gameState.gameTime.day.toString();
      case 'hour':
      case 'gameTime.hour':
        return gameState.gameTime.hour.toString();
      default:
        return undefined;
    }
  }

  private static resolveFlagConditional(rest: string, gameState: GameState): string {
    const [flagNameRaw, trueTextRaw, falseTextRaw] = rest.split('|');
    const flagName = flagNameRaw?.trim();

    if (!flagName) {
      console.warn('Flag conditional missing flag name');
      return '';
    }

    const trueText = trueTextRaw?.trim() ?? '';
    const falseText = falseTextRaw?.trim() ?? '';
    const flagValue = Boolean(gameState.flags[flagName]);

    return flagValue ? trueText : falseText;
  }

  private static formatValue(value: string, formatter: string, i18n?: VariableInterpolatorI18n): string {
    switch (formatter) {
      case 'number': {
        const numericValue = Number(value);

        if (Number.isNaN(numericValue)) {
          return value;
        }

        if (i18n?.formatNumber) {
          return i18n.formatNumber(numericValue);
        }

        return DEFAULT_NUMBER_FORMATTER.format(numericValue);
      }
      case 'upper':
        return value.toUpperCase();
      case 'lower':
        return value.toLowerCase();
      default:
        return value;
    }
  }
}
