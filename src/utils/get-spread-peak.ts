const getSpreadPeak = <T extends number>(move: T): T => {
  'worklet';
  const spread = Math.min(Math.max(move, 0), 1);
  return (4 * spread * (1 - spread)) as T;
};

export { getSpreadPeak };
