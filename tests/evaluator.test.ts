import { Card, Rank, Suit } from "../src/domain/Card";
import { evaluateBestHand } from "../src/domain/HandEvaluator";

describe("HandEvaluator", () => {
  it("should identify the best 5 cards for a High Card hand", () => {
    const board = [
      new Card(Rank.Two, Suit.Spades),
      new Card(Rank.Four, Suit.Hearts),
      new Card(Rank.Eight, Suit.Clubs),
      new Card(Rank.Six, Suit.Spades),
      new Card(Rank.Queen, Suit.Hearts),
    ];

    const holeCards = [
      new Card(Rank.Nine, Suit.Hearts),
      new Card(Rank.Ace, Suit.Spades),
    ];

    const result = evaluateBestHand(board, holeCards);

    expect(result.category).toBe("High card");

    expect(result.chosen5.map((c) => c.rank)).toEqual([
      Rank.Ace,
      Rank.Queen,
      Rank.Nine,
      Rank.Eight,
      Rank.Six,
    ]);
  });

  it("should identify a Pair and return the pair first then kickers", () => {
    const board = [
      new Card(Rank.Jack, Suit.Spades),
      new Card(Rank.Four, Suit.Hearts),
      new Card(Rank.Six, Suit.Clubs),
      new Card(Rank.Eight, Suit.Diamonds),
      new Card(Rank.Two, Suit.Spades),
    ];
    const holeCards = [
      new Card(Rank.Jack, Suit.Hearts), // Deuxième Valet -> Paire
      new Card(Rank.Ace, Suit.Clubs), // Meilleur kicker
    ];

    const result = evaluateBestHand(board, holeCards);

    expect(result.category).toBe("One pair");
    // Ordre attendu : les deux Valets, puis Ace, Eight, Six
    expect(result.chosen5.map((c) => c.rank)).toEqual([
      Rank.Jack,
      Rank.Jack,
      Rank.Ace,
      Rank.Eight,
      Rank.Six,
    ]);
  });
});
