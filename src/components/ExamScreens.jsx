import React from 'react';

const ExamScreen = ({
  score,
  isSubmitted,
  selectedAnswers,
  questions,
  handleAnswerSelection,
  handleSubmit,
  getAnswerStyle
}) => {
  return (
    <div className="max-w-4xl mx-auto p-6 pb-24 relative">
      {/* Encabezado fijo */}
      <div className="sticky top-0 bg-white z-10 mb-6 pb-4 border-b">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">
            Examen de Anatomía Patológica
          </h1>
          {isSubmitted && (
            <div className="text-xl font-semibold">
              Nota: {score.toFixed(2)}/10
            </div>
          )}
        </div>

        {/* Barra de progreso */}
        {!isSubmitted && (
          <div className="mt-4">
            <div className="text-sm text-gray-600">
              Preguntas respondidas: {Object.keys(selectedAnswers).length} de{" "}
              {questions.length}
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${
                    (Object.keys(selectedAnswers).length / questions.length) *
                    100
                  }%`,
                }}
              ></div>
            </div>
          </div>
        )}
      </div>

      {/* Preguntas */}
      <div className="space-y-6">
        {questions.map((question) => (
          <div key={question.id} className="p-4 border rounded-lg shadow-sm">
            <h2 className="font-semibold mb-3">{question.question}</h2>
            <div className="grid gap-2">
              {Object.entries(question.options).map(([letter, text]) => (
                <label
                  key={letter}
                  className={`flex items-center space-x-2 p-2 rounded-md cursor-pointer ${getAnswerStyle(
                    question,
                    letter
                  )} transition-colors duration-200`}
                >
                  <input
                    type="radio"
                    name={`question-${question.id}`}
                    value={letter}
                    checked={selectedAnswers[question.id] === letter}
                    onChange={() => handleAnswerSelection(question.id, letter)}
                    disabled={isSubmitted}
                    className="form-radio h-4 w-4"
                  />
                  <span>
                    {letter}) {text}
                  </span>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Botón fijo en la parte inferior */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4">
        <div className="max-w-4xl mx-auto flex justify-center">
          {!isSubmitted ? (
            <button
              onClick={handleSubmit}
              className="bg-blue-600 text-white px-8 py-3 rounded-md hover:bg-blue-700 transition-colors duration-200"
            >
              Enviar Examen
            </button>
          ) : (
            <button
              onClick={() => window.location.reload()}
              className="bg-green-600 text-white px-8 py-3 rounded-md hover:bg-green-700 transition-colors duration-200"
            >
              Nuevo Examen
            </button>
          )}
        </div>
      </div>

      {/* Resultados */}
      {isSubmitted && (
        <div className="mt-6 mb-20 bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold mb-2">Resultados:</h3>
          <p>
            Respuestas correctas:{" "}
            {Math.round((score / 10) * questions.length)} de {questions.length}
          </p>
          <p>Nota final: {score.toFixed(2)}/10</p>
        </div>
      )}
    </div>
  );
};

export default ExamScreen;