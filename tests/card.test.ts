import { Card, Suit, Rank } from '../src/domain/Card';

describe('Card', () => {
  it('should have a rank and a suit', () => {
    const card = new Card(Rank.Ace, Suit.Hearts);
    expect(card.rank).toBe(Rank.Ace);
    expect(card.suit).toBe(Suit.Hearts);
  });
});