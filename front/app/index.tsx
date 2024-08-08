import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Svg, Path } from 'react-native-svg';
import { useState } from "react";
import CountdownTimer from "@/components/CountdownTimer";

export default function Index() {

  const [currentQuestion, setcurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [reset, setReset] = useState(false);

  const quizData= [
    { question: 'Que veut dire SAP?',
      options: ['truc1', 'Secours à personne', 'truc2', 'truc3'],
      answer: 'Secours à personne'
    },
    { question: 'Que veut dire FPT?',
      options: ['Fourgon pompe tonne','truc1', 'truc2', 'truc3'],
      answer: 'Fourgon pompe tonne'
    },
    { question: 'Que veut dire FI?',
      options: ['truc1', 'Formation Incendie', 'truc2', 'truc3'],
      answer: 'Formation Incendie'
    }
  ]

  const progress = (currentQuestion +1) / quizData.length

  const handleNextQuestion = () => {
    const nextQuestion = currentQuestion + 1;
    if (nextQuestion < quizData.length) {
      setcurrentQuestion(nextQuestion);
      setReset(true);
      setTimeout(() => setReset(false), 100);
    }
    else {
      setShowScore(true);
    }
  }

  const [userAnswers, setUserAnswers] = useState<(boolean | null)[]>(Array(quizData.length).fill(null)); // Tableau rempli de Null pour avoir la couleur grise
  const newAnswers = [...userAnswers]; // Deuxieme tableau qui va progressivement se substituer au premier

  const handleAnswer = (item: any) => {
    const answer = quizData[currentQuestion]?.answer; 
    if (item == answer) {
      setScore(score + 1);
      newAnswers[currentQuestion] = true;
    } else {
      newAnswers[currentQuestion] = false;
    }
    setUserAnswers(newAnswers);
    handleNextQuestion();
  }

  const handleTimerEnd = () => {
    handleNextQuestion();
    newAnswers[currentQuestion] = false;
    setUserAnswers(newAnswers);
  }
  
  return (
    <View style={styles.container}>
      <View style={styles.topContainer}>
        <Text style= {styles.category}>Quiz Category Name</Text>
        <Svg width="24" height="24" viewBox="0 0 24 24">
          <Path fill="#ff4901" d="M9 3V1h6v2zm2 11h2V8h-2zm1 8q-1.85 0-3.488-.712T5.65 19.35t-1.937-2.863T3 13t.713-3.488T5.65 6.65t2.863-1.937T12 4q1.55 0 2.975.5t2.675 1.45l1.4-1.4l1.4 1.4l-1.4 1.4Q20 8.6 20.5 10.025T21 13q0 1.85-.713 3.488T18.35 19.35t-2.863 1.938T12 22m0-2q2.9 0 4.95-2.05T19 13t-2.05-4.95T12 6T7.05 8.05T5 13t2.05 4.95T12 20m0-7"/>
        </Svg>
        <CountdownTimer initialSeconds={30} reset={reset} onTimerEnd={handleTimerEnd} />
      </View>

      <Text style= {styles.progressText}>Question {currentQuestion +1} / {quizData.length}</Text>
      <View style= {styles.progressBar}>
        <View style= {[styles.progress, { width: `${progress * 100}%` }]} />
      </View>
      
      { showScore ? <View> 
          <Text> {score} </Text> 
        </View> :
        <View style={styles.quiz}>
          <View style={styles.questionContainer}>
            <Text style={styles.questionText}> {quizData[currentQuestion]?.question} </Text>
          </View>
            
          <View style={styles.optionContainer}>
            {quizData[currentQuestion]?.options.map((item) => {
              return <TouchableOpacity onPress={()=>{handleAnswer(item)}}>
                <Text style={styles.optionText}> {item} </Text>
              </TouchableOpacity> 
            })}
          </View>
        </View>
      }
      <View style={styles.dots}>
        {quizData.map((_, index) => {
          return <Svg key={index} width="24" height="24" viewBox="0 0 24 24">
            <Path
              fill={
                userAnswers[index] === null
                  ? '#e0e0e0' // Gris pour les réponses non encore données
                  : userAnswers[index]
                  ? '#5ce65c' // Vert si correct
                  : '#ff4901' // Rouge si incorrect
              }
              d="M12 18a6 6 0 1 0 0-12a6 6 0 0 0 0 12"
            />
          </Svg>
        })} 
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  quiz: {
    width: '100%'
  },
  topContainer: {
    width: '90%',
    height: 30,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  category: {
    textAlign: 'left',
    width: '80%' 
  },
  progressText: {
    textAlign: 'left',
    width: '90%'   
  },
  progressBar: {
    height: 10,
    width: '90%',
    backgroundColor: '#e0e0e0',
    borderRadius: 10,
    overflow: 'hidden',
    marginVertical: 20,
  },
  progress: {
    height: '100%',
    backgroundColor: '#3b82f6',
  },
  questionContainer: {
    width: '90%',
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#ff4901",
    borderRadius: 30,
    height: 150,
    margin: 'auto'
  },
  questionText: {
    fontSize: 28,
    textAlign: "center"
  },
  optionContainer: {
    width: '90%',
    justifyContent: "space-between",
    height: 300,
    margin: 'auto',
    marginTop: 50
  },
  optionText: {
    fontSize: 22,
    textAlign: 'center',
    borderWidth: 1,
    borderColor: "#ff4901",
    borderRadius: 15,
    paddingVertical: 10
  },
  dots: {
    marginTop: 30,
    flexDirection: 'row'
  }
})
