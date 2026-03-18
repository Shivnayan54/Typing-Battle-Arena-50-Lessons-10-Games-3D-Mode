import { useState, useEffect, useCallback, useMemo } from 'react';

export const useTypingEngine = (text, timerDurationMinutes = 1) => {
  const [userInput, setUserInput] = useState('');
  const [status, setStatus] = useState('idle'); // idle, typing, finished
  const [correctKeyStrokes, setCorrectKeyStrokes] = useState(0);
  const [totalKeyStrokes, setTotalKeyStrokes] = useState(0);
  const [errors, setErrors] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);

  const reset = useCallback(() => {
    setUserInput('');
    setStatus('idle');
    setCorrectKeyStrokes(0);
    setTotalKeyStrokes(0);
    setErrors(0);
    setStartTime(null);
    setEndTime(null);
  }, []);

  const handleCharInput = useCallback((value) => {
    if (status === 'finished') return;
    if (status === 'idle') {
      setStatus('typing');
      setStartTime(Date.now());
    }

    const isBackspace = value.length < userInput.length;
    
    if (!isBackspace) {
      setTotalKeyStrokes(prev => prev + 1);
      const lastCharIndex = value.length - 1;
      if (value[lastCharIndex] === text[lastCharIndex]) {
        setCorrectKeyStrokes(prev => prev + 1);
      } else {
        setErrors(prev => prev + 1);
      }
    }
    
    setUserInput(value);

    // End condition
    if (value.length === text.length) {
      setStatus('finished');
      setEndTime(Date.now());
    }
  }, [status, text, userInput.length]);

  const elapsedTimeInMinutes = useMemo(() => {
    if (!startTime) return 0;
    const finalTime = endTime || Date.now();
    return (finalTime - startTime) / 60000;
  }, [startTime, endTime, status]); // status added to trigger re-renders ideally on tick, but for now it's static on render

  const wpm = useMemo(() => {
    if (elapsedTimeInMinutes === 0) return 0;
    return Math.round((correctKeyStrokes / 5) / elapsedTimeInMinutes);
  }, [correctKeyStrokes, elapsedTimeInMinutes]);

  const accuracy = useMemo(() => {
    if (totalKeyStrokes === 0) return 100;
    return Math.round((correctKeyStrokes / totalKeyStrokes) * 100);
  }, [correctKeyStrokes, totalKeyStrokes]);

  return {
    userInput,
    status,
    wpm,
    accuracy,
    errors,
    correctKeyStrokes,
    totalKeyStrokes,
    handleCharInput,
    reset,
    setStatus
  };
};
