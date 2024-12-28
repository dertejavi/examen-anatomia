import React, { useState, useEffect } from "react";
import LoadingScreen from "./components/ExamComponents/LoadingScreen.jsx";
import StartScreen from "./components/ExamComponents/StartScreen.jsx";
import ExamScreen from "./components/ExamComponents/ExamScreen.jsx";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import questionsData from './assets/questions.json'
import backgroundImage from './assets/fondo1.jpg'

function App() {
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [questionDatabase, setQuestionDatabase] = useState([]);
  const [showStartScreen, setShowStartScreen] = useState(true);
  const [numQuestions, setNumQuestions] = useState(10);
  const [questions, setQuestions] = useState([]);
  const [totalCorrectAnswers, setTotalCorrectAnswers] = useState(0);
  const [totalIncorrectAnswers, setTotalIncorrectAnswers] = useState(0);
  const [averageScore, setAverageScore] = useState(0);
  const [questionCounts, setQuestionCounts] = useState({});
  const [showStats, setShowStats] = useState(false);
  const [selectedRange, setSelectedRange] = useState(null);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [selectedExam, setSelectedExam] = useState(null);
  const [examCounter, setExamCounter] = useState(1);

useEffect(() => {
    const fetchQuestions = async () => {
      try {
        // En lugar de fetch, usa directamente los datos importados
        setQuestionDatabase(questionsData);
      } catch (error) {
        console.error("Error loading questions:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuestions();

    const storedExamCounter = localStorage.getItem("examCounter");
    if (storedExamCounter) {
      setExamCounter(parseInt(storedExamCounter, 10));
    }
  }, []);

  useEffect(() => {
    const updateGlobalStats = () => {
      const exams = getExamData();
      let totalCorrect = 0;
      let totalIncorrect = 0;
      const questionCounts = {};

      exams.forEach((exam) => {
        totalCorrect += exam.correctAnswers.length;
        totalIncorrect += exam.questions.length - exam.correctAnswers.length;

        exam.questions.forEach((questionId) => {
          questionCounts[questionId] = (questionCounts[questionId] || 0) + 1;
        });
      });

      setTotalCorrectAnswers(totalCorrect);
      setTotalIncorrectAnswers(totalIncorrect);
      setAverageScore(
        exams.length > 0
          ? ((totalCorrect / (totalCorrect + totalIncorrect)) * 10).toFixed(2)
          : 0
      );
      setQuestionCounts(questionCounts);
    };

    updateGlobalStats();
    window.addEventListener("storage", updateGlobalStats);
    return () => window.removeEventListener("storage", updateGlobalStats);
  }, []);

  const getRandomQuestions = (num) => {
    const shuffledQuestions = [...questionDatabase];
    for (let i = shuffledQuestions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledQuestions[i], shuffledQuestions[j]] = [
        shuffledQuestions[j],
        shuffledQuestions[i],
      ];
    }
    return shuffledQuestions.slice(0, num);
  };

  const handleAnswerSelection = (questionId, answer) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  const handleSubmit = () => {
    let correct = 0;
    questions.forEach((question) => {
      if (selectedAnswers[question.id] === question.correctAnswer) {
        correct++;
      }
    });
    setScore((correct / questions.length) * 10);
    setIsSubmitted(true);

    const examData = {
      id: `Examen ${examCounter}`,
      date: new Date(),
      questions: questions.map((q) => q.id),
      answers: { ...selectedAnswers },
      correctAnswers: questions
        .filter((q) => selectedAnswers[q.id] === q.correctAnswer)
        .map((q) => q.id),
      score: (correct / questions.length) * 10,
    };

    saveExamData(examData);

    setExamCounter((prevCounter) => prevCounter + 1);
    localStorage.setItem("examCounter", (examCounter + 1).toString());

    setTotalCorrectAnswers((prev) => prev + correct);
    setTotalIncorrectAnswers((prev) => prev + (questions.length - correct));
    const totalExams = totalCorrectAnswers + totalIncorrectAnswers + 1;
    setAverageScore(
      totalExams > 0
        ? (((totalCorrectAnswers + correct) / totalExams) * 10).toFixed(2)
        : 0
    );
    setQuestionCounts((prevCounts) => {
      const newCounts = { ...prevCounts };
      questions.forEach((question) => {
        newCounts[question.id] = (newCounts[question.id] || 0) + 1;
      });
      return newCounts;
    });
  };

  const saveExamData = (examData) => {
    try {
      const exams = JSON.parse(localStorage.getItem("exams") || "[]");
      localStorage.setItem("exams", JSON.stringify([...exams, examData]));
    } catch (error) {
      console.error("Error al guardar los datos del examen:", error);
    }
  };

  const getExamData = () => {
    try {
      const exams = JSON.parse(localStorage.getItem("exams") || "[]");
      return exams;
    } catch (error) {
      console.error("Error al obtener los datos del examen:", error);
      return [];
    }
  };

  const getAnswerStyle = (question, optionLetter) => {
    if (!isSubmitted) return "bg-white hover:bg-gray-50";

    const isSelected = selectedAnswers[question.id] === optionLetter;
    const isCorrect = question.correctAnswer === optionLetter;

    if (isCorrect) return "bg-green-100";
    if (isSelected && !isCorrect) return "bg-red-100";
    return "bg-white";
  };

  const handleStartExam = () => {
    setQuestions(getRandomQuestions(numQuestions));
    setShowStartScreen(false);
    setIsSubmitted(false);
    setSelectedAnswers({});
    setScore(0); // Resetear la puntuación
  };

  const handleNumQuestionsChange = (event) => {
    setNumQuestions(parseInt(event.target.value, 10));
  };

  const handleGoBackToStart = () => {
    setShowStartScreen(true);
    setIsSubmitted(false);
    setSelectedAnswers({});
    setScore(0);
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (showStats) {
    const exams = getExamData();

    return (
      <div
        className="max-w-7xl mx-auto p-6 pb-24 relative"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="bg-white bg-opacity-80 p-8 rounded-lg">
          {/* Botón Volver arriba */}
          <div className="flex justify-end mb-4">
            <button
              onClick={() => {
                setShowStats(false);
                setSelectedRange(null);
              }}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors duration-200"
            >
              Volver arriba
            </button>
          </div>

          <h2 className="text-2xl font-bold mb-4">Estadísticas</h2>
          <p>Respuestas correctas totales: {totalCorrectAnswers}</p>
          <p>Respuestas incorrectas totales: {totalIncorrectAnswers}</p>
          <p>Nota media global: {averageScore}</p>

          {/* Selección de rango */}
          <h3 className="text-xl font-bold mt-6 mb-4">
            Seleccione un rango de preguntas:
          </h3>
          <div className="grid grid-cols-3 gap-4 mb-6">
            {[...Array(6)].map((_, index) => {
              const start = index * 100 + 1;
              const end = (index + 1) * 100;
              return (
                <button
                  key={index}
                  onClick={() => setSelectedRange(index)}
                  className={`bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 
                          ${selectedRange === index ? "bg-blue-700" : ""}`}
                >
                  Preguntas {start} - {end}
                </button>
              );
            })}
          </div>

          {/* Mostrar estadísticas del rango seleccionado */}
          {selectedRange !== null && (
            <div className="border p-4 rounded">
              <h4 className="font-semibold mb-2">
                Preguntas {selectedRange * 100 + 1} -{" "}
                {(selectedRange + 1) * 100}
              </h4>
              {questionDatabase
                .slice(selectedRange * 100, (selectedRange + 1) * 100)
                .map((question) => {
                  const timesAppeared = questionCounts[question.id] || 0;
                  const timesCorrect = exams.reduce((acc, exam) => {
                    const isCorrectlyAnswered =
                      exam.correctAnswers.includes(question.id);
                    return acc + (isCorrectlyAnswered ? 1 : 0);
                  }, 0);
                  const timesIncorrect = timesAppeared - timesCorrect;
                  return (
                    <div key={question.id} className="mb-2">
                      <button
                        onClick={() => setSelectedQuestion(question)}
                        className="font-semibold text-blue-500 hover:underline"
                      >
                        Pregunta {question.id}
                      </button>
                      {selectedQuestion === question && (
                        <div className="ml-4 mt-2">
                          <p>{question.question}</p>
                          <ul>
                            {Object.entries(question.options).map(
                              ([letter, text]) => (
                                <li
                                  key={letter}
                                  className={
                                    question.correctAnswer === letter
                                      ? "font-bold text-green-500"
                                      : ""
                                  }
                                >
                                  {letter}) {text}
                                </li>
                              )
                            )}
                          </ul>
                        </div>
                      )}
                      <p className="mt-1 flex items-center space-x-4">
                        <span>Apariciones: {timesAppeared}</span>
                        <span className="font-bold text-green-500 flex items-center">
                          <FaCheckCircle className="mr-1" /> Acertadas:{" "}
                          {timesCorrect}
                        </span>
                        <span className="font-bold text-red-500 flex items-center">
                          <FaTimesCircle className="mr-1" /> Falladas:{" "}
                          {timesIncorrect}
                        </span>
                      </p>
                      <hr className="my-2" />
                    </div>
                  );
                })}
            </div>
          )}

          <h3 className="text-xl font-bold mt-6">Exámenes:</h3>
          <ul>
            {exams.map((exam) => (
              <li key={exam.id}>
                <button onClick={() => setSelectedExam(exam)}>
                  {exam.id} - {exam.date.toLocaleString()}
                </button>
              </li>
            ))}
          </ul>

          {selectedExam && (
            <div>
              <h4 className="text-lg font-bold mt-4">
                Detalles del examen {selectedExam.id}:
              </h4>
              <p>Fecha: {selectedExam.date.toLocaleString()}</p>
              <p>Preguntas: {selectedExam.questions.join(", ")}</p>
              <p>Puntuación: {selectedExam.score}</p>
            </div>
          )}

          <button
            onClick={() => {
              setShowStats(false);
              setSelectedRange(null);
            }}
            className="bg-blue-600 text-white px-8 py-3 rounded-md hover:bg-blue-700 transition-colors duration-200 mt-8"
          >
            Volver
          </button>
        </div>
      </div>
    );
  }

  if (showStartScreen) {
    return (
      <StartScreen
        numQuestions={numQuestions}
        questionDatabase={questionDatabase}
        handleNumQuestionsChange={handleNumQuestionsChange}
        handleStartExam={handleStartExam}
        setShowStats={setShowStats}
      />
    );
  }

  return (
    <ExamScreen
      score={score}
      isSubmitted={isSubmitted}
      selectedAnswers={selectedAnswers}
      questions={questions}
      handleAnswerSelection={handleAnswerSelection}
      handleSubmit={handleSubmit}
      getAnswerStyle={getAnswerStyle}
      handleStartExam={handleStartExam}
      handleGoBackToStart={handleGoBackToStart}
    />
  );
}

export default App;
