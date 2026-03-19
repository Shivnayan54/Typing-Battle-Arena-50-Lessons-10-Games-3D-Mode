import { useState, useEffect, useCallback, useMemo } from 'react';

export const useTypingEngine = (text) => {
  const [userInput, setUserInput] = useState('');
  const [status, setStatus] = useState('idle'); // idle, typing, finished
  const [correctKeyStrokes, setCorrectKeyStrokes] = useState(0);
  const [totalKeyStrokes, setTotalKeyStrokes] = useState(0);
  const [errors, setErrors] = useState(0);

  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  const reset = useCallback(() => {
    setUserInput('');
    setStatus('idle');
    setCorrectKeyStrokes(0);
    setTotalKeyStrokes(0);
    setErrors(0);
    setElapsedSeconds(0);
  }, []);

  useEffect(() => {
    let interval;
    if (status === 'typing') {
      interval = setInterval(() => {
        setElapsedSeconds(s => s + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [status]);

  const handleCharInput = useCallback((value) => {
    if (status === 'finished') return;
    if (status === 'idle') {
      setStatus('typing');
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
    }
  }, [status, text, userInput.length]);

  const wpm = useMemo(() => {
    const minutes = elapsedSeconds / 60;
    if (minutes === 0) return 0;
    return Math.round((correctKeyStrokes / 5) / minutes);
  }, [correctKeyStrokes, elapsedSeconds]);

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
