import { StyleSheet, Text, TouchableOpacity, View, StatusBar } from "react-native";
import { Svg, Path } from 'react-native-svg';
import { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import CountdownTimer from "@/components/CountdownTimer";
import { QuizScreenNavigationProp, QuizScreenRouteProp } from "../utils/Types";
import Feather from '@expo/vector-icons/Feather';
import Octicons from '@expo/vector-icons/Octicons';
import AntDesign from '@expo/vector-icons/AntDesign';
import Entypo from '@expo/vector-icons/Entypo';

type Props = {
  route: QuizScreenRouteProp
}

export default function QuizScreen({route} : Props) {
  const {quizData, categoryName} = route.params
  // console.log(JSON.stringify(quizData, null, "\t"))
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [nextQuestion, setNextQuestion] = useState(2)
  const [score, setScore] = useState(0)
  const [reset, setReset] = useState(false)
  const [isLastQuestion, setIsLastQuestion] = useState(false)
  const navigation = useNavigation<QuizScreenNavigationProp>()
  const [showCorrectAnswer, setShowCorrectAnswer] = useState<boolean>(false)
  const [userAnswers, setUserAnswers] = useState<(boolean | null)[]>(Array(quizData.length).fill(null)) // Tableau rempli de Null pour avoir la couleur grise
  const newAnswers = [...userAnswers] // Deuxieme tableau qui va progressivement se substituer au premier
  const [selectedOption, setSelectedOption] = useState()


  const getOptionStyle = (item: any) => { 
    if (selectedOption != item) return styles.itemButton
    
    if (item.is_correct) {
      return [styles.itemButton, styles.correctAnswer]
    }   
    else {
      return [styles.itemButton, styles.wrongAnswer]
    }
    
  }

  const getIcon = (item: any) => {
    if (selectedOption != item) return <Feather name="circle" size={24} color="#1E3C58" />

    if (item.is_correct) {
      return <AntDesign name="checkcircle" size={24} color="#5ce65c" />
    } 
    else {
      return <Entypo name="circle-with-cross" size={24} color="#ff0000" />
    }
  }

  const goToNextQuestion = () => {
    setShowCorrectAnswer(false)
    setReset(true)
    setCurrentQuestion(currentQuestion +1)
    setTimeout(() => setReset(false), 100)
  }
  
  const handleAnswer = (item: any) => { 
    setSelectedOption(item) 
    setShowCorrectAnswer(true) 
    setNextQuestion((prevQuestion) => {
      const nextQuestion = prevQuestion + 1;
      
      if (nextQuestion < quizData.length +1) {
        setIsLastQuestion(false)
      } else {
        setIsLastQuestion(true)
      }

      switch (true) {
        case (item.is_correct && !isLastQuestion):
          setScore((prevScore) => prevScore + 1)
          newAnswers[currentQuestion] = true
          setTimeout(()=> goToNextQuestion(), 400) //Pour laisser le temps au user de voir le changement de couleur des options
        break
        case (item.is_correct && isLastQuestion):
          setScore((prevScore) => {
            const updatedScore = prevScore + 1
            setTimeout(() => {
              navigation.replace('Result', { score: updatedScore, quizLength: quizData.length })
            }, 100)
            return updatedScore
          })
        break
        case (!item.is_correct && isLastQuestion): 
          setTimeout(() => {
            navigation.replace('Result', { score: score, quizLength: quizData.length  });
          }, 100)
        break
        case (!item.is_correct && !isLastQuestion):
          newAnswers[currentQuestion] = false
          setTimeout(()=> goToNextQuestion(), 400) //Pour laisser le temps au user de voir le changement de couleur des options
        break
      }

      setUserAnswers(newAnswers)
      return nextQuestion
    });
     
  }

  const handleTimerEnd = () => {
    handleAnswer ({"is_correct": false})
    if(newAnswers[currentQuestion] == null) newAnswers[currentQuestion] = false
  }
  
  const number = currentQuestion +1
  const formattedNumber = (number) < 10 ? `0${number}` : number.toString()

  return (
    <View style={styles.container}>
      <StatusBar
        backgroundColor="#1E3C58"
        barStyle="light-content"   
      />
      <View style={styles.topScreen}>
        <View style={styles.topContainer}>
          <Text style= {styles.category}>{categoryName}</Text>
          <Svg width="24" height="24" viewBox="0 0 24 24">
            <Path fill="#1E3C58" d="M9 3V1h6v2zm2 11h2V8h-2zm1 8q-1.85 0-3.488-.712T5.65 19.35t-1.937-2.863T3 13t.713-3.488T5.65 6.65t2.863-1.937T12 4q1.55 0 2.975.5t2.675 1.45l1.4-1.4l1.4 1.4l-1.4 1.4Q20 8.6 20.5 10.025T21 13q0 1.85-.713 3.488T18.35 19.35t-2.863 1.938T12 22m0-2q2.9 0 4.95-2.05T19 13t-2.05-4.95T12 6T7.05 8.05T5 13t2.05 4.95T12 20m0-7"/>
          </Svg>
          <CountdownTimer initialSeconds={30} reset={reset} onTimerEnd={handleTimerEnd} isLastQuestion={isLastQuestion} />
        </View>

        <Text style= {styles.progressText}>Question <Text style={styles.formattedNumber}>{formattedNumber}</Text> / {quizData.length}</Text>

        <View style={styles.dashes}>
          {quizData.map((_, index) => {
            return <Octicons key={index} name="dash" size={24} color= {
              userAnswers[index] === null
                ? '#2A2B31' // Gris pour les réponses non encore import QuizScreen from './QuizScreen';données
                : userAnswers[index]
                ? '#5ce65c' // Vert si correct
                : '#ff0000' // Rouge si incorrect
            } />
          })} 
        </View>
      </View>
      
      <View style={styles.quiz}>
        
          <View style={styles.questionContainer}>
            <Text style={styles.questionText}> {quizData[currentQuestion]?.questionText} </Text>
          </View> 
          
        <View style={styles.optionContainer}>
          {quizData[currentQuestion]?.options.map((item, index) => {
            return <TouchableOpacity key={index} 
              onPress={()=>{handleAnswer(item)}} 
              style={getOptionStyle(item)}
              disabled={showCorrectAnswer}
            > 
              <Text style={styles.optionText}> {item.text} </Text>
              { getIcon(item) }
            </TouchableOpacity> 
          })}
        </View>
      </View>
           
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#ECE6D6"
  },
  quiz: {
    width: '100%'
  },
  topScreen: {
    height: '20%',
    justifyContent: 'space-around',
    marginVertical: 15
  },
  topContainer: {
    width: '90%',
    height: 30,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  category: {
    textAlign: 'left',
    width: '80%', 
    fontSize: 24,
    fontWeight: 'bold'
  },
  progressText: {
    textAlign: 'left',
    width: '90%',
    fontSize: 20,
    fontWeight: 'bold'   
  },
  formattedNumber: {
    fontSize: 28,
    fontWeight: 'bold' 
  },
  questionContainer: {
    width: '90%',
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#1E3C58",
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
  },
  itemButton: {
    borderWidth: 1,
    borderColor: "#1E3C58",
    borderRadius: 15,
    flexDirection: 'row',
    justifyContent: "space-between",
    padding: 15
  },
  correctAnswer: {
    borderWidth: 2,
    borderColor: "#5ce65c",
  },
  wrongAnswer: {
    borderWidth: 2,
    borderColor: "#ff0000",
  },
  dashes: {
    width: '90%',
    flexDirection: 'row',
    justifyContent: 'space-between'
  }
})