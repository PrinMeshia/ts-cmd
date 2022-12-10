import { IsNotEmpty, IsOptional } from "class-validator";

export class CreateArticleDto {
    @IsNotEmpty()
    readonly title: string;

    @IsNotEmpty()
    readonly body: string;

    @IsOptional()
    readonly description: string;

    @IsOptional()
    readonly tags : string[];
}
