import type { QuizQuestion } from '../types/Question';

export const questions: QuizQuestion[] = [
  {
    id: 1,
    text: "Quel hook est utilisé pour gérer l'état dans un composant fonctionnel React ?",
    options: ["useEffect", "useState", "useContext", "useReducer"],
    correctAnswer: "useState",
  },
  {
    id: 2,
    text: "Quelle propriété CSS est utilisée pour créer une grille ?",
    options: ["display: flex", "display: block", "display: grid", "float: left"],
    correctAnswer: "display: grid",
  },
  {
    id: 3,
    text: "Dans Framer Motion, quelle prop définit l'état initial d'une animation ?",
    options: ["animate", "exit", "initial", "transition"],
    correctAnswer: "initial",
  },
];
