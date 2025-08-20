
function calculateAverage(categories) {
  if (!Array.isArray(categories) || categories.length === 0) return null;
  const sum = categories.reduce((acc, c) => acc + (c.rating || 0), 0);
  return sum / categories.length;
}