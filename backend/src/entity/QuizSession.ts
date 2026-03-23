import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    Unique,
} from "typeorm"
import { User } from "./User"

@Entity()
@Unique("UQ_quiz_session_user_date", ["userId", "date"])
export class QuizSession {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ name: "user_id" })
    userId: number

    @ManyToOne(() => User, { nullable: false, onDelete: "CASCADE" })
    @JoinColumn({ name: "user_id" })
    user: User

    @Column({ type: "date" })
    date: string

    @Column({ type: "int" })
    score: number

    @Column({ type: "int", nullable: true })
    duration: number | null

    @CreateDateColumn({ name: "completed_at" })
    completedAt: Date
}

