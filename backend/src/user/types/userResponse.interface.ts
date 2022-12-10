import { UserType } from "./user.type";

export interface UserResponseInterface {
    user: UserType & {access_token:string}
}