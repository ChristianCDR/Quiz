import React, { useState, useEffect } from 'react';
import { Text, StyleSheet } from 'react-native';

interface CountdownTimerProps {
  initialSeconds: number;
  reset: boolean;
  onTimerEnd: () => void; // Fonction appelée lorsque le timer atteint 0
  isLastQuestion: boolean;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({initialSeconds, reset, onTimerEnd, isLastQuestion}) => {
  const [secondsRemaining, setSecondsRemaining] = useState(initialSeconds);

  useEffect(()=>{
    if(reset) {
      setSecondsRemaining(30);
    }
  },[reset]);

  useEffect(()=>{
    if(isLastQuestion) {
      setSecondsRemaining(30);
    }
  },[isLastQuestion]);

  useEffect(() => {
    if (secondsRemaining > 0) {
      const timer = setInterval(() => {
        setSecondsRemaining((prevSeconds) => prevSeconds - 1);
      }, 1000);

      // Nettoyage de l'intervalle lorsque les : voidsecondes atteignent 0
      return () => clearInterval(timer);
    }
    else {
      onTimerEnd ();
    }
  }, [secondsRemaining]);

  const formatTime = (seconds: number) => {
    const secs = seconds % 60;
    return `${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
      <Text style={styles.timerText}>{formatTime(secondsRemaining)}s</Text>
  );
};

const styles = StyleSheet.create({
  timerText: {
    fontSize: 20,
  },
});

export default CountdownTimer;
