import { motion } from "framer-motion";
import type { AnswerOption, Question } from "../../types/Question";
import "../../css/quiz.css";

interface ResultProps {
  score: number;
  total: number;
  questions: Question[];
  answers: Record<number, AnswerOption>;
}

export const Result = ({ score, total, questions, answers }: ResultProps) => {
  const getOptionContent = (question: Question, option: AnswerOption) => {
    const options: Record<AnswerOption, string> = {
      A: question.optionA,
      B: question.optionB,
      C: question.optionC,
      D: question.optionD,
    };
    return options[option];
  };

  return (
    <motion.div 
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="quiz-result"
    >
      <h2>Résultats</h2>
      <p>
        Tu as obtenu <span>{score}</span> sur {total} points !
      </p>
      <div className="quiz-result__summary">
        <h3>Récapitulatif des réponses</h3>
        <ul className="quiz-result__list">
          {questions.map((question, questionIndex) => {
            const userAnswer = answers[question.id];
            const isCorrect = userAnswer === question.correctAnswer;
            return (
              <li key={question.id} className="quiz-result__item">
                <p className="quiz-result__question">
                  <strong>Question {questionIndex + 1} :</strong> {question.content}
                </p>
                <p className={isCorrect ? "quiz-result__status quiz-result__status--correct" : "quiz-result__status quiz-result__status--wrong"}>
                  {isCorrect ? "Bonne réponse" : "Mauvaise réponse"}
                </p>
                <p className="quiz-result__answer">
                  Ta réponse : <span>{userAnswer ? `${userAnswer} — ${getOptionContent(question, userAnswer)}` : "Aucune réponse"}</span>
                </p>
                <p className="quiz-result__answer">
                  Bonne réponse : <span>{question.correctAnswer} — {getOptionContent(question, question.correctAnswer)}</span>
                </p>
              </li>
            );
          })}
        </ul>
      </div>
    </motion.div>
  );
};
