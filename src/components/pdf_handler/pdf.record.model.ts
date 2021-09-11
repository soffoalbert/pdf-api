import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class PDFRecord {

    @PrimaryGeneratedColumn()
    id?: number;

    @Column({ nullable: false })
    pdfUrl: string;

    @Column({ nullable: false })
    processed: boolean;

    @CreateDateColumn()
    createdDate?: Date;

    @UpdateDateColumn()
    lastModifiedDate?: Date;
}
