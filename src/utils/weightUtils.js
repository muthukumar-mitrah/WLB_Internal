/**
 * Calculates the weight progress percentage based on start, current, and goal weight.
 * @param {number} startWeight 
 * @param {number} currentWeight 
 * @param {number} goalWeight 
 * @returns {number} The progress percentage from 0 to 100
 */
export const calculateWeightProgress = (startWeight, currentWeight, goalWeight) => {
  if (startWeight == null || currentWeight == null || goalWeight == null) {
    return 0;
  }

  const totalToLose = startWeight - goalWeight;
  const lostWeight = startWeight - currentWeight;

  if (totalToLose === 0) {
    return currentWeight <= goalWeight ? 100 : 0;
  }

  return Math.max(0, Math.min(100, (lostWeight / totalToLose) * 100));
};
