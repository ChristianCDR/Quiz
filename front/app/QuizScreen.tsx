import { StyleSheet, Text, TouchableOpacity, View, StatusBar } from "react-native";
import { Svg, Path } from 'react-native-svg';
import { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import CountdownTimer from "@/components/CountdownTimer";
import { RootStackNavigationProp, QuizScreenRouteProp, Option } from "../utils/Types";
import Feather from '@expo/vector-icons/Feather';
import Octicons from '@expo/vector-icons/Octicons';
import { Audio } from 'expo-av';

type Props = {
  route: QuizScreenRouteProp
}

export default function QuizScreen({route} : Props) {
  const {quizData, categoryName} = route.params;
  // console.log(JSON.stringify(quizData, null, "\t"))
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [nextQuestion, setNextQuestion] = useState(2);
  const [score, setScore] = useState(0);
  const [reset, setReset] = useState(false);
  const [isLastQuestion, setIsLastQuestion] = useState(false);
  const navigation = useNavigation<RootStackNavigationProp>();
  const [showCorrectAnswer, setShowCorrectAnswer] = useState<boolean>(false);
  const [userAnswers, setUserAnswers] = useState<(boolean | null)[]>(Array(quizData.length).fill(null)); // Tableau rempli de Null pour avoir la couleur grise
  const newAnswers = [...userAnswers]; // Deuxieme tableau qui va progressivement se substituer au premier
  const [selectedOption, setSelectedOption] = useState<Option>();
  const [pressed, setPressed] = useState<boolean>(false);


  const getOptionStyle = (item: Option) => { 
    if (item.is_correct) return [styles.itemButton, styles.correctAnswer];
    else if (selectedOption !== item) return styles.itemButton;
    else return [styles.itemButton, styles.wrongAnswer];    
  }

  const getIcon = (item: Option) => {
    switch (true) {
      case (item.is_correct): 
        return <Feather name="check-circle" size={24} color="#5ce65c" />
        break;
      case (selectedOption != item):
        return <Feather name="circle" size={24} color="#1E3C58" />
        break;
      default:
        return <Feather name="x-circle" size={24} color="#ff0000" />
        break;
    }  
  }

  const goToNextQuestion = () => {
    setPressed(false);
    setShowCorrectAnswer(false);
    setReset(true);
    setCurrentQuestion(currentQuestion +1);
    setTimeout(() => setReset(false), 100);
  }
  
  const handleAnswer = (item: Option) => { 
    setPressed(true);
    setSelectedOption(item);
    setShowCorrectAnswer(true);
    playSound(item);

    setNextQuestion((prevQuestion) => {
      const nextQuestion = prevQuestion + 1;
      
      if (nextQuestion < quizData.length +1) {
        setIsLastQuestion(false);
      } else {
        setIsLastQuestion(true);
      }

      switch (true) {
        case (item.is_correct && !isLastQuestion):
          setScore((prevScore) => prevScore + 1);
          newAnswers[currentQuestion] = true;
          setTimeout(()=> goToNextQuestion(), 1000) //Pour laisser le temps au user de voir le changement de couleur des options
        break;
        case (item.is_correct && isLastQuestion):
          setScore((prevScore) => {
            const updatedScore = prevScore + 1;
            setTimeout(() => {
              navigation.replace('Result', { score: updatedScore, quizLength: quizData.length });
            }, 100)
            return updatedScore;
          })
        break;
        case (!item.is_correct && isLastQuestion): 
          setTimeout(() => {
            navigation.replace('Result', { score: score, quizLength: quizData.length  });
          }, 100)
        break;
        case (!item.is_correct && !isLastQuestion):
          newAnswers[currentQuestion] = false;
          setTimeout(()=> goToNextQuestion(), 1000); //Pour laisser le temps au user de voir le changement de couleur des options
        break;
      }

      setUserAnswers(newAnswers);
      return nextQuestion;
    });
     
  }

  const handleTimerEnd = () => {
    handleAnswer ({text: '', is_correct: false});
    if(newAnswers[currentQuestion] == null) newAnswers[currentQuestion] = false;
  }
  
  const number = currentQuestion +1;
  const formattedNumber = (number) < 10 ? `0${number}` : number.toString();

  const playSound = async (item: Option) => {

    try {
      const soundFile = item.is_correct 
      ? require('@/assets/sounds/correct_answer.mp3') 
      : require('@/assets/sounds/wrong_answer.mp3');

      const { sound } = await Audio.Sound.createAsync(
        soundFile,
        { shouldPlay: true }
      );

      // Libérer les ressources après la lecture
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          sound.unloadAsync();
        }
      });
    }
    catch (error) {
      console.log('Erreur lors de la lecture du son :', error);
    }
  }

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
              style={[ pressed ? getOptionStyle(item) : styles.itemButton]}
              disabled={showCorrectAnswer}
            > 
              <Text style={styles.optionText}> {item.text} </Text>
              { pressed ? 
                getIcon(item) : <Feather name="circle" size={24} color="#1E3C58" />  
              } 
            </TouchableOpacity> 
          })}
        </View>
      </View>

      <View style= {styles.buttonView}>
        <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
          <Text style={styles.buttonText}> Quitter</Text>
         </TouchableOpacity>
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
  },
  buttonView: {
    width: '90%',
    alignItems: 'flex-end',
    marginTop: 30
  },
  button: {
    height: 50,
    width: 100,
    backgroundColor: "#1E3C58",
    justifyContent: 'center',
    borderRadius: 10
  },
  buttonText: {
    textAlign: 'center',
    color: '#fff',
  }
})