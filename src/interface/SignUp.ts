import { Login } from "./Login";
export interface SignUp extends Login {
  first_name: string;
  email: string;
}
