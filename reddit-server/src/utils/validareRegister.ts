import { UserInput } from "../types/UserInput";

export const validateRegister = (options: UserInput) => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    
     if (options.username.length <= 2) {
            return {
                errors: [
                    {
                        field: "username",
                        message: "Length must be greater than 2"
                    }
                ]
            }
        }

        if (options.username.includes("@")) {
            return {
                errors: [
                    {
                        field: "username",
                        message: "Can't include '@'"
                    }
                ]
            }
        }
        
    if(!re.test(String(options.email).toLowerCase())) {
            return {
                    errors: [
                        {
                            field: "email",
                            message: "Not a valid email"
                        }
                    ]
                }
        }

        if (options.password.length <= 2) {
            return {
                errors: [
                    {
                        field: "password",
                        message: "Password must be greater than 2"
                    }
                ]
            }
        }

        return null;
}