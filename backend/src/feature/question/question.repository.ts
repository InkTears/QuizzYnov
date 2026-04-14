import { AppDataSource } from "../../data-source"
import { AnswerOption, Question } from "../../entity/Question"

export type CreateQuestionPayload = {
    content: string
    optionA: string
    optionB: string
    optionC: string
    optionD: string
    correctAnswer: AnswerOption
}

class QuestionRepository {
    private readonly repository = AppDataSource.getRepository(Question)

    findAll() {
        return this.repository.find({ order: { id: "ASC" } })
    }

    findById(id: number) {
        return this.repository.findOne({ where: { id } })
    }

    findRandom(limit: number) {
        return this.repository
            .createQueryBuilder("question")
            .orderBy("RAND()")
            .limit(limit)
            .getMany()
    }

    async createQuestion(payload: CreateQuestionPayload) {
        const question = this.repository.create(payload)
        return this.repository.save(question)
    }

    async updateQuestion(id: number, payload: Partial<CreateQuestionPayload>) {
        await this.repository.update(id, payload)
        return this.findById(id)
    }

    async deleteQuestion(id: number) {
        const result = await this.repository.delete(id)
        return result.affected === 1
    }

    async seedQuestionsIfEmpty(questions: CreateQuestionPayload[]) {
        const count = await this.repository.count()
        if (count > 0) {
            return
        }

        const entities = this.repository.create(questions)
        await this.repository.save(entities)
    }

    async createManyQuestions(questions: CreateQuestionPayload[]) {
        const entities = this.repository.create(questions)
        return this.repository.save(entities)
    }
}

export const questionRepository = new QuestionRepository()

