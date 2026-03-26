import { Card, Rank } from "./Card";

export interface EvaluationResult {
  category: string;
  chosen5: Card[];
}

export function evaluateBestHand(
  board: Card[],
  holeCards: Card[],
): EvaluationResult {
  const allCards = [...board, ...holeCards];

  // Grouper les cartes par rang
  const groups = allCards.reduce(
    (acc, card) => {
      acc[card.rank] = acc[card.rank] || [];
      acc[card.rank].push(card);
      return acc;
    },
    {} as Record<number, Card[]>,
  );

  // Extraire les paires
  const pairRanks = Object.keys(groups)
    .map(Number)
    .filter((rank) => groups[rank].length === 2)
    .sort((a, b) => b - a); // Si il y a plusieurs paire on prend la plus haute

  if (pairRanks.length > 0) {
    const mainPair = groups[pairRanks[0]];
    const others = allCards
      .filter((c) => c.rank !== pairRanks[0])
      .sort((a, b) => b.rank - a.rank);

    return {
      category: "One pair",
      chosen5: [...mainPair, ...others.slice(0, 3)], // Paire + 3 kickers
    };
  }

  // High Card
  const sortedCards = allCards.sort((a, b) => b.rank - a.rank);
  return {
    category: "High card",
    chosen5: sortedCards.slice(0, 5),
  };
}
