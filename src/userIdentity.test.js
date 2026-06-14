import { createUserId, makeDisplayNameKey, normalizeDisplayName } from './userIdentity';

describe('user identity helpers', () => {
  test('normalizes display names without making them unique', () => {
    expect(normalizeDisplayName('  John   Mathew  ')).toBe('John Mathew');
    expect(makeDisplayNameKey('  John   Mathew  ')).toBe('john mathew');
  });

  test('creates different user IDs for people with the same display name', () => {
    const first = createUserId('John');
    const second = createUserId('John');

    expect(first).not.toBe(second);
    expect(first).toMatch(/^reader_john_[a-z0-9]+$/);
    expect(second).toMatch(/^reader_john_[a-z0-9]+$/);
  });

  test('keeps generated IDs safe for Firebase Realtime Database paths', () => {
    const userId = createUserId('Jane.#$[] / Smith');

    expect(userId).not.toMatch(/[.#$[\]/]/);
  });
});
