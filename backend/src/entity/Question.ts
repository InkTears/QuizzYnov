import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm"

export type AnswerOption = "A" | "B" | "C" | "D"

@Entity()
export class Question {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ type: "text" })
    content: string

    @Column({ name: "option_a" })
    optionA: string

    @Column({ name: "option_b" })
    optionB: string

    @Column({ name: "option_c" })
    optionC: string

    @Column({ name: "option_d" })
    optionD: string

    @Column({ name: "correct_answers", type: "simple-array" })
    correctAnswers: AnswerOption[]

    @CreateDateColumn({ name: "created_at" })
    createdAt: Date
}

