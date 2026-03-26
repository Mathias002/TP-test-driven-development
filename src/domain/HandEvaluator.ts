import { Card } from "./Card";

export interface EvaluationResult {
  category: string;
  chosen5: Card[];
}

export function evaluateBestHand(
  board: Card[],
  holeCards: Card[],
): EvaluationResult {
  const allCards = [...board, ...holeCards];

  // Tri par ordre décroissant
  const sortedCards = allCards.sort((a, b) => b.rank - a.rank);

  // On garde les 5 cartes les plus haute
  const chosen5 = sortedCards.slice(0, 5);

  return {
    category: "High card",
    chosen5: chosen5,
  };
}
