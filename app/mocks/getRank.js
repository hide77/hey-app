export default karma => {
  if (karma > 20) return 'rank-1';
  if (karma > 300) return 'rank-2';
  if (karma > 5000) return 'rank-3';
  if (karma > 40000) return 'rank-4';
  if (karma > 100000) return 'rank-5';
  if (karma > 1000000) return 'rank-6';
  return 'rank-0';
};
