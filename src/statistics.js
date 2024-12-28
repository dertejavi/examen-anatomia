export const saveExamData = (examData) => {
    try {
      const exams = JSON.parse(localStorage.getItem("exams") || "[]");
  
      // Calcular estadísticas para el examen actual
      let correctAnswersInExam = 0;
      examData.questions.forEach((questionId) => {
        if (examData.answers[questionId] === examData.correctAnswers.find(q => q.id === questionId)?.correctAnswer) {
          correctAnswersInExam++;
        }
      });
  
      // Actualizar estadísticas globales
      let totalCorrectAnswers = parseInt(localStorage.getItem("totalCorrectAnswers")) || 0;
      let totalIncorrectAnswers = parseInt(localStorage.getItem("totalIncorrectAnswers")) || 0;
      let questionCounts = JSON.parse(localStorage.getItem("questionCounts")) || {};
  
      totalCorrectAnswers += correctAnswersInExam;
      totalIncorrectAnswers += (examData.questions.length - correctAnswersInExam);
  
      examData.questions.forEach((questionId) => {
        if (!questionCounts[questionId]) {
          questionCounts[questionId] = { appearances: 0, correct: 0, incorrect: 0 };
        }
        questionCounts[questionId].appearances++;
        if (examData.answers[questionId] === examData.correctAnswers.find(q => q.id === questionId)?.correctAnswer) {
          questionCounts[questionId].correct++;
        } else {
          questionCounts[questionId].incorrect++;
        }
      });
  
      // Guardar estadísticas actualizadas en localStorage
      localStorage.setItem("totalCorrectAnswers", totalCorrectAnswers);
      localStorage.setItem("totalIncorrectAnswers", totalIncorrectAnswers);
      localStorage.setItem("questionCounts", JSON.stringify(questionCounts));
      localStorage.setItem("averageScore", ((totalCorrectAnswers / (totalCorrectAnswers + totalIncorrectAnswers)) * 10).toFixed(2));
  
      // Guardar el examen actual
      localStorage.setItem('exams', JSON.stringify([...exams, examData]));
    } catch (error) {
      console.error("Error al guardar los datos del examen:", error);
    }
  };
  
  export const getExamData = () => {
    try {
      const exams = JSON.parse(localStorage.getItem("exams") || "[]");
      return exams;
    } catch (error) {
      console.error("Error al obtener los datos del examen:", error);
      return [];
    }
  };
  
  // Funciones para obtener estadísticas globales
  export const getTotalCorrectAnswers = () => parseInt(localStorage.getItem("totalCorrectAnswers")) || 0;
  export const getTotalIncorrectAnswers = () => parseInt(localStorage.getItem("totalIncorrectAnswers")) || 0;
  export const getQuestionCounts = () => JSON.parse(localStorage.getItem("questionCounts")) || {};
  export const getAverageScore = () => parseFloat(localStorage.getItem("averageScore")).toFixed(2) || "0.00";