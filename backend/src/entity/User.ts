import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @Column({ nullable: true })
    email?: string;

    @Column()
    password!: string

    @Column({ default: 'user' })
    role: string

    @Column({ nullable: true })
    refreshToken?: string
}