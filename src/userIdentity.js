const USER_ID_PREFIX = 'reader';

export const normalizeDisplayName = (name) => (
  (name || '').trim().replace(/\s+/g, ' ')
);

export const makeDisplayNameKey = (name) => (
  normalizeDisplayName(name).toLowerCase()
);

const makeSlug = (name) => {
  const slug = makeDisplayNameKey(name)
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 24);
  return slug || 'reader';
};

const makeRandomPart = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID().replace(/-/g, '').slice(0, 12);
  }

  return Math.random().toString(36).slice(2, 14).padEnd(12, '0');
};

export const createUserId = (name) => (
  `${USER_ID_PREFIX}_${makeSlug(name)}_${makeRandomPart()}`
);
