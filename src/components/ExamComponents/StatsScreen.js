import React from 'react';
import { getExamData } from '../statistics';

const StatsScreen = ({
  totalCorrectAnswers,
  totalIncorrectAnswers,
  averageScore,
  questionCounts,
  questionDatabase
}) => {
  // Función para renderizar las estadísticas de cada pregunta
  const renderQuestionStats = (question) => {
    const stats = questionCounts[question.id] || { appearances: 0, correct: 0, incorrect: 0 };
    return (
      <div key={question.id} className="mb-2">
        <div className="flex justify-between items-center">
          <button
            className="font-semibold text-blue-500 hover:underline"
          >
            Pregunta {question.id}
          </button>
          <div>
            <span className="ml-4">
              Apariciones: {stats.appearances}, Acertadas: {stats.correct}, Falladas: {stats.incorrect}
            </span>
            {stats.appearances > 0 && (
              <span className="ml-4">
                (Tasa de acierto: {((stats.correct / stats.appearances) * 100).toFixed(1)}%)
              </span>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div
      className="max-w-7xl mx-auto p-6 pb-24 relative"
      style={{
        backgroundImage: `url(/fondo1.jpg)`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="bg-white bg-opacity-80 p-8 rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Estadísticas</h2>
        <p className="text-lg">Respuestas correctas totales: {totalCorrectAnswers}</p>
        <p className="text-lg">Respuestas incorrectas totales: {totalIncorrectAnswers}</p>
        <p className="text-lg">Nota media global: {averageScore}</p>

        <h3 className="text-xl font-bold mt-6 mb-4">Estadísticas por pregunta:</h3>
        <div className="border p-4 rounded">
          {questionDatabase.map(renderQuestionStats)}
        </div>

        <h3 className="text-xl font-bold mt-6">Exámenes realizados:</h3>
        <div className="mt-4 max-h-60 overflow-y-auto">
          <ul className="space-y-2">
            {getExamData().map(exam => (
              <li key={exam.id} className="border-b pb-2">
                Examen {new Date(exam.date).toLocaleDateString()} - {new Date(exam.date).toLocaleTimeString()}
              </li>
            ))}
          </ul>
        </div>

        <button
          onClick={() => window.location.reload()}
          className="bg-blue-600 text-white px-8 py-3 rounded-md hover:bg-blue-700 transition-colors duration-200 mt-8"
        >
          Volver
        </button>
      </div>
    </div>
  );
};

export default StatsScreen;