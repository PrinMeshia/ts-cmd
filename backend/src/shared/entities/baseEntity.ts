import { BeforeUpdate, CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm"

export class BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @CreateDateColumn({select: false })
    createdAt: Date

    @UpdateDateColumn({select: false })
    updatedAt: Date
}