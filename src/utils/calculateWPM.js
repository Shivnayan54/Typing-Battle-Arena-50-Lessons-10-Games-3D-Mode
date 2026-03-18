export const calculateWPM = (correctStrokes, timeElapsedInSeconds) => {
  if (timeElapsedInSeconds === 0) return 0;
  // Standard formula: (Correct Keystrokes / 5) / TimeInMinutes
  const timeInMinutes = timeElapsedInSeconds / 60;
  return Math.round((correctStrokes / 5) / timeInMinutes);
};

export const calculateCPM = (correctStrokes, timeElapsedInSeconds) => {
  if (timeElapsedInSeconds === 0) return 0;
  const timeInMinutes = timeElapsedInSeconds / 60;
  return Math.round(correctStrokes / timeInMinutes);
};

export const calculateAccuracy = (correctStrokes, totalStrokes) => {
  if (totalStrokes === 0) return 100;
  return Math.round((correctStrokes / totalStrokes) * 100);
};
