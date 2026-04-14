import { AppDataSource } from "../data-source";
import { Question } from "../entity/Question";
import { QuizSession } from "../entity/QuizSession";
import { User } from "../entity/User";

function toIsoDate(date: Date): string {
    return date.toISOString().slice(0, 10);
}

export async function seedMockData() {
    const userRepository = AppDataSource.getRepository(User);
    const questionRepository = AppDataSource.getRepository(Question);
    const quizSessionRepository = AppDataSource.getRepository(QuizSession);

    // -------------------------
    // USERS
    // -------------------------
    const userCount = await userRepository.count();

    if (userCount === 0) {
        await userRepository.save([
            userRepository.create({
                name: "Alice",
                email: "alice@test.com",
                password: "123456",
            }),
            userRepository.create({
                name: "Bob",
                email: "bob@test.com",
                password: "123456",
            }),
            userRepository.create({
                name: "Chloe",
                email: "chloe@test.com",
                password: "123456",
            }),
            userRepository.create({
                name: "David",
                email: "david@test.com",
                password: "123456",
            }),
            userRepository.create({
                name: "Guest",
                email: "guest@test.com",
                password: "123456",
            }),
        ]);
    }

    // -------------------------
    // QUESTIONS
    // -------------------------
    const questionCount = await questionRepository.count();

    if (questionCount === 0) {
        await questionRepository.save([
            questionRepository.create({
                content: "Quelle est la capitale de l'Allemagne ?",
                optionA: "Berlin",
                optionB: "Munich",
                optionC: "Hambourg",
                optionD: "Francfort",
                correctAnswer: "A",
            }),
            questionRepository.create({
                content: "Combien de continents existe-t-il ?",
                optionA: "5",
                optionB: "6",
                optionC: "7",
                optionD: "8",
                correctAnswer: "C",
            }),
            questionRepository.create({
                content: "Quel langage est exécuté dans le navigateur ?",
                optionA: "TypeScript",
                optionB: "Java",
                optionC: "C",
                optionD: "JavaScript",
                correctAnswer: "D",
            }),
            questionRepository.create({
                content: "Quel est le résultat de 7 x 8 ?",
                optionA: "54",
                optionB: "56",
                optionC: "58",
                optionD: "64",
                correctAnswer: "B",
            }),
            questionRepository.create({
                content: "Quel océan borde la côte ouest de la France ?",
                optionA: "Atlantique",
                optionB: "Pacifique",
                optionC: "Indien",
                optionD: "Arctique",
                correctAnswer: "A",
            }),
            questionRepository.create({
                content: "Qui a peint la Joconde ?",
                optionA: "Van Gogh",
                optionB: "Picasso",
                optionC: "Léonard de Vinci",
                optionD: "Monet",
                correctAnswer: "C",
            }),
        ]);
    }

    // -------------------------
    // QUIZ SESSIONS
    // -------------------------
    const sessionCount = await quizSessionRepository.count();

    if (sessionCount === 0) {
        const users = await userRepository.find({ order: { id: "ASC" } });

        const today = toIsoDate(new Date());
        const yesterday = toIsoDate(new Date(Date.now() - 86400000));

        const todayScores = [16, 20, 12, 18];
        const yesterdayScores = [14, 17, 10, 15];

        const sessions = users.slice(0, 4).flatMap((user, index) => {
            return [
                quizSessionRepository.create({
                    userId: user.id,
                    date: today,
                    score: todayScores[index] || 10,
                    duration: 90 + index * 15,
                }),
                quizSessionRepository.create({
                    userId: user.id,
                    date: yesterday,
                    score: yesterdayScores[index] || 8,
                    duration: 110 + index * 12,
                }),
            ];
        });

        if (sessions.length > 0) {
            await quizSessionRepository.save(sessions);
        }
    }
}