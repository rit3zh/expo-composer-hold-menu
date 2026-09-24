const EMPTY_STATE_LAYOUT: Record<string, number> = {
  CARD_SIZE: 70,
  CARD_RADIUS: 16,
  ARC_RADIUS: 400,
  ARC_STEP: 15,
  TITLE_MARGIN_TOP: 40,
  DESCRIPTION_MARGIN_TOP: 8,
  ACTION_MARGIN_TOP: 28,
  ACTION_HEIGHT: 48,
  ACTION_PADDING_HORIZONTAL: 30,
  PADDING_HORIZONTAL: 32,
} as const;

const EMPTY_STATE_IMAGES: readonly string[] = [
  'https://i.pinimg.com/736x/c2/1e/e9/c21ee98364d89c1c4febc6c4c2bcc36d.jpg',
  'https://i.pinimg.com/736x/a0/89/3b/a0893bd0babbda5689dbd801365e8467.jpg',
  'https://i.pinimg.com/736x/d0/5d/48/d05d482bb7d42b3f26aa9ff985c9e969.jpg',
  'https://i.pinimg.com/1200x/81/71/a4/8171a465b637b892105b9ce9bec1b7b5.jpg',
  'https://i.pinimg.com/736x/1a/44/05/1a4405dc3d9523a732eecdab9b2dbd1e.jpg',
];

const EMPTY_STATE_FADE_LOCATIONS = [0, 0.2, 0.8, 1] as const;

export { EMPTY_STATE_FADE_LOCATIONS, EMPTY_STATE_IMAGES, EMPTY_STATE_LAYOUT };
