import { Card, Rank, Suit } from "../src/domain/Card";
import { evaluateBestHand } from "../src/domain/HandEvaluator";

describe("HandEvaluator -> High Card", () => {
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
});
