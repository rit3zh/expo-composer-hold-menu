import type { SUGGESTION_IDS } from '../constants/suggestion.constants';

type TSuggestionId = (typeof SUGGESTION_IDS)[keyof typeof SUGGESTION_IDS];

export type { TSuggestionId };
