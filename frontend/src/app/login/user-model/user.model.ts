import { integer } from "../../shared/integer";

export interface User {
    id: integer;
    email: string;
    password: string;
}
