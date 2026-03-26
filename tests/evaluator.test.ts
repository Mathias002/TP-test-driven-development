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

  it("should identify Two Pair (choosing the 2 highest pairs and best kicker)", () => {
    const board = [
      // Paire 1 : Eight
      new Card(Rank.Eight, Suit.Spades),
      new Card(Rank.Eight, Suit.Hearts),

      // Paire 2 : Six
      new Card(Rank.Six, Suit.Clubs),
      new Card(Rank.Six, Suit.Diamonds),

      new Card(Rank.Ace, Suit.Spades),
    ];
    const holeCards = [
      // Paire 3 : Jack -> la plus haute
      new Card(Rank.Jack, Suit.Hearts), // Deuxième Valet -> Paire
      new Card(Rank.Jack, Suit.Clubs), // Meilleur kicker
    ];

    const result = evaluateBestHand(board, holeCards);

    expect(result.category).toBe("Two pair");
    // Ordre attendu : paire de valets, paire de huit, puis As
    expect(result.chosen5.map((c) => c.rank)).toEqual([
      Rank.Jack,
      Rank.Jack,
      Rank.Eight,
      Rank.Eight,
      Rank.Ace,
    ]);
  });

  it("should identify Three of a Kind and its two best kickers", () => {
    const board = [
      new Card(Rank.Nine, Suit.Spades),
      new Card(Rank.Nine, Suit.Clubs),
      new Card(Rank.Nine, Suit.Hearts), // Brelan de 9
      new Card(Rank.Four, Suit.Diamonds),
      new Card(Rank.Two, Suit.Spades),
    ];
    const holeCards = [
      new Card(Rank.Ace, Suit.Clubs),
      new Card(Rank.King, Suit.Hearts),
    ];

    const result = evaluateBestHand(board, holeCards);

    expect(result.category).toBe("Three of a kind");
    // Ordre : les trois 9, puis Ace, puis King
    expect(result.chosen5.map((c) => c.rank)).toEqual([
      Rank.Nine,
      Rank.Nine,
      Rank.Nine,
      Rank.Ace,
      Rank.King,
    ]);
  });

  it("should identify Four of a Kind and the best kicker", () => {
    const board = [
      new Card(Rank.Seven, Suit.Spades),
      new Card(Rank.Seven, Suit.Clubs),
      new Card(Rank.Seven, Suit.Hearts),
      new Card(Rank.Seven, Suit.Diamonds), // Carré de 7
      new Card(Rank.Two, Suit.Spades),
    ];
    const holeCards = [
      new Card(Rank.Ace, Suit.Clubs),
      new Card(Rank.Six, Suit.Hearts),
    ];

    const result = evaluateBestHand(board, holeCards);

    expect(result.category).toBe("Four of a kind");
    // Ordre : les quatre 7, puis l'As
    expect(result.chosen5.map((c) => c.rank)).toEqual([
      Rank.Seven,
      Rank.Seven,
      Rank.Seven,
      Rank.Seven,
      Rank.Ace,
    ]);
  });

  it("should identify a Full House ( the best triplet and best pair)", () => {
    const board = [
      new Card(Rank.Ten, Suit.Spades),
      new Card(Rank.Ten, Suit.Clubs),
      new Card(Rank.Ten, Suit.Hearts), // Brelan de 10
      new Card(Rank.Four, Suit.Diamonds),
      new Card(Rank.Four, Suit.Spades), // Paire de 4
    ];
    const holeCards = [
      new Card(Rank.Ace, Suit.Clubs),
      new Card(Rank.Ace, Suit.Hearts), // Paire d'As
    ];

    const result = evaluateBestHand(board, holeCards);

    expect(result.category).toBe("Full house");
    // Ordre : Le brelan de 10, puis la paire d'As
    expect(result.chosen5.map((c) => c.rank)).toEqual([
      Rank.Ten,
      Rank.Ten,
      Rank.Ten,
      Rank.Ace,
      Rank.Ace,
    ]);
  });
});
