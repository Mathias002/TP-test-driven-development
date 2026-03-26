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

  // Rangs ayant exactement 2 cartes, triés par rang décroissant
  const pairRanks = Object.keys(groups)
    .map(Number)
    .filter(rank => groups[rank].length === 2)
    .sort((a, b) => b - a);

  // Deux paires
  if (pairRanks.length >= 2) {
    const highPair = groups[pairRanks[0]];
    const lowPair = groups[pairRanks[1]];
    
    const usedCards = [...highPair, ...lowPair];
    const kicker = allCards
      .filter(c => !usedCards.includes(c))
      .sort((a, b) => b.rank - a.rank)[0];

    return {
      category: 'Two pair',
      chosen5: [...highPair, ...lowPair, kicker]
    };
  }

  // Une paire
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
