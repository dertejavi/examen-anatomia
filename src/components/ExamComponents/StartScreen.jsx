// src/components/ExamComponents/StartScreen.js
import React from 'react';

const StartScreen = ({ 
  numQuestions, 
  questionDatabase, 
  handleNumQuestionsChange, 
  handleStartExam, 
  setShowStats 
}) => {
  return (
    <div
      className="flex flex-col justify-center items-center h-screen"
      style={{
        backgroundImage: `url(${import.meta.env.BASE_URL}fondo1.jpg)`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="bg-white bg-opacity-80 p-8 rounded-lg">
        <h1 className="text-3xl font-bold mb-4">Examenes Aleatorios</h1>
        <p className="text-lg mb-4">
          OPE, FEA, ANATOMIA PATOLOGICA
        </p>
        <p className="mb-8">
          Creado por Javier Santana - Anatomia patologica Dr. Negrín
        </p>

        <div className="mb-4">
          <label htmlFor="numQuestions" className="mr-2">
            Número de preguntas:
          </label>
          <input
            type="number"
            id="numQuestions"
            min="1"
            max={questionDatabase.length}
            value={numQuestions}
            onChange={handleNumQuestionsChange}
            className="border border-gray-400 px-2 py-1 rounded"
          />
        </div>

        <div className="mt-4">
          <button
            onClick={handleStartExam}
            className="bg-blue-600 text-white px-8 py-3 rounded-md hover:bg-blue-700 transition-colors duration-200 w-full"
          >
            Comenzar Examen
          </button>
        </div>

        <div className="mt-4">
          <button
            onClick={() => setShowStats(true)}
            className="bg-blue-600 text-white px-8 py-3 rounded-md hover:bg-blue-700 transition-colors duration-200 w-full"
          >
            Estadísticas
          </button>
        </div>

        <p className="text-xs mt-8 text-gray-500">
          No me hago responsable de los errores que pueda contener.
        </p>
      </div>
    </div>
  );
};

export default StartScreen;
