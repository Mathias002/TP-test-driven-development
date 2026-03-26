import { Card, Rank } from "./Card";

export interface EvaluationResult {
  category: string;
  chosen5: Card[];
}

interface HandGroups {
  cardsByRank: Record<number, Card[]>;
  ranksByCount: Record<number, number[]>; // { 3: [9], 2: [14, 8] } pour un brelan de 9 et paires d'As et 8
}

function getHandGroups(cards: Card[]): HandGroups {
  const cardsByRank: Record<number, Card[]> = {};

  // Grouper les instances de cartes en fonction de leur rang
  cards.forEach((card) => {
    cardsByRank[card.rank] = cardsByRank[card.rank] || [];
    cardsByRank[card.rank].push(card);
  });

  const ranksByCount: Record<number, number[]> = { 4: [], 3: [], 2: [], 1: [] };

  Object.keys(cardsByRank).forEach((rankStr) => {
    const rank = Number(rankStr);
    const count = cardsByRank[rank].length;
    if (ranksByCount[count]) {
      ranksByCount[count].push(rank);
    }
  });

  Object.keys(ranksByCount).forEach((count) => {
    ranksByCount[Number(count)].sort((a, b) => b - a);
  });

  return { cardsByRank, ranksByCount };
}

export function evaluateBestHand(
  board: Card[],
  holeCards: Card[],
): EvaluationResult {
  const allCards = [...board, ...holeCards];
  const { cardsByRank, ranksByCount } = getHandGroups(allCards);

  // Carré
  if (ranksByCount[4].length > 0) {
    const quadRank = ranksByCount[4][0];
    const quadCards = cardsByRank[quadRank];
    const kicker = allCards
      .filter((c) => c.rank !== quadRank)
      .sort((a, b) => b.rank - a.rank)[0];

    return { category: "Four of a kind", chosen5: [...quadCards, kicker] };
  }

  // Full House
  const hasTrip = ranksByCount[3].length > 0;
  const hasAdditionalPair =
    ranksByCount[2].length > 0 || ranksByCount[3].length > 1;

  if (hasTrip && hasAdditionalPair) {
    const mainTripRank = ranksByCount[3][0];
    const tripCards = cardsByRank[mainTripRank];

    // La paire peut provenir des rangs de taille 2 OU d'un autre rang de taille 3
    const potentialPairRanks = [
      ...ranksByCount[3].filter((r) => r !== mainTripRank),
      ...ranksByCount[2],
    ].sort((a, b) => b - a); // On prend la paire la plus haute

    const pairRank = potentialPairRanks[0];
    const pairCards = cardsByRank[pairRank].slice(0, 2); // On ne prend que 2 cartes

    return {
      category: "Full house",
      chosen5: [...tripCards, ...pairCards],
    };
  }

  // 3. Couleur (Flush)
  const cardsBySuit: Record<string, Card[]> = {};
  allCards.forEach((card) => {
    cardsBySuit[card.suit] = cardsBySuit[card.suit] || [];
    cardsBySuit[card.suit].push(card);
  });

  const flushSuit = Object.keys(cardsBySuit).find(
    (suit) => cardsBySuit[suit].length >= 5,
  );

  if (flushSuit) {
    const flushCards = cardsBySuit[flushSuit]
      .sort((a, b) => b.rank - a.rank)
      .slice(0, 5);

    return {
      category: "Flush",
      chosen5: flushCards,
    };
  }

  // Brelan
  if (ranksByCount[3].length > 0) {
    const tripRank = ranksByCount[3][0];
    const tripCards = cardsByRank[tripRank];
    const kickers = allCards
      .filter((c) => c.rank !== tripRank)
      .sort((a, b) => b.rank - a.rank)
      .slice(0, 2);

    return { category: "Three of a kind", chosen5: [...tripCards, ...kickers] };
  }

  // Deux Paires
  if (ranksByCount[2].length >= 2) {
    const highPairRank = ranksByCount[2][0];
    const lowPairRank = ranksByCount[2][1];
    const pairsCards = [
      ...cardsByRank[highPairRank],
      ...cardsByRank[lowPairRank],
    ];
    const kicker = allCards
      .filter((c) => c.rank !== highPairRank && c.rank !== lowPairRank)
      .sort((a, b) => b.rank - a.rank)[0];

    return { category: "Two pair", chosen5: [...pairsCards, kicker] };
  }

  // Une Paire
  if (ranksByCount[2].length === 1) {
    const pairRank = ranksByCount[2][0];
    const pairCards = cardsByRank[pairRank];
    const kickers = allCards
      .filter((c) => c.rank !== pairRank)
      .sort((a, b) => b.rank - a.rank)
      .slice(0, 3);

    return { category: "One pair", chosen5: [...pairCards, ...kickers] };
  }

  // Carte Haute
  const sortedCards = [...allCards].sort((a, b) => b.rank - a.rank);
  return { category: "High card", chosen5: sortedCards.slice(0, 5) };
}
