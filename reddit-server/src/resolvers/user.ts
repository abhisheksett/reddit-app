import { validateRegister } from './../utils/validareRegister';
import { User } from "../entities/User";
import { MyContext } from "src/types";
import { Arg, Ctx, Field, Mutation, ObjectType, Query } from "type-graphql";
import argon2 from 'argon2';
import { COOKIE_NAME, FORGET_PASSWORD_PREFIX } from '../constants'
import { UserInput } from "../types/UserInput";
import { FieldError } from "../types/FieldError";
import { sendEmail } from '../utils/sendEmail';
import { v4 } from 'uuid';
import { getConnection } from 'typeorm';

@ObjectType()
class UserResponse {
    @Field(() => [FieldError], { nullable: true })
    errors?: FieldError[];

    @Field(() => User, { nullable: true })
    user?: User
}

export class UserResolver {

    @Mutation(() => UserResponse)
    async changePassword(
        @Arg("token") token: string,
        @Arg("newPassword") newPassword: string,
        @Ctx() { redis }: MyContext
    ): Promise<UserResponse> {
        if (newPassword.length <= 2) {
            return {
                errors: [
                    {
                        field: "newPassword",
                        message: "Password must be greater than 2"
                    }
                ]
            }
        }
        const key = FORGET_PASSWORD_PREFIX+token;
        const userId = await redis.get(key);
        if(!userId) {
            return {
                errors: [
                    {
                        field: "token",
                        message: "Token expired"
                    }
                ]
            }
        }

        const user = await User.findOne(parseInt(userId)) as User;
        const hashedPassword = await argon2.hash(newPassword);
        user.password = hashedPassword;
        await User.update({ id: parseInt(userId)}, { password: hashedPassword });
        await redis.del(key);
        
        return { user }
    }

    @Mutation(() => Boolean)
    async forgotPassword(
        @Arg("email") email: string,
        @Ctx() { redis }: MyContext
    ) {
        const user = await User.findOne({ where: { email }});
        if (!user) {
            return true;
        }
        const token = v4();
        await redis.set(FORGET_PASSWORD_PREFIX+token, user.id, 'ex', 1000 * 60 * 60 * 24); //expires token after 24 hours
        const resetTemplate = `<a href=http://localhost:3000/change-password/${token}>Reset password</a>`;
        await sendEmail(email, resetTemplate);
        return true;
    }

    @Mutation(() => UserResponse)
    async register(
        @Arg("options") options: UserInput,
        @Ctx() { req }: MyContext
    ): Promise<UserResponse> {
        const response = validateRegister(options);
        if (response) {
            return response;
        }
        const hashedPassword = await argon2.hash(options.password);
        let user;
        try {
            const result = await getConnection().createQueryBuilder().insert().into(User).values({
                userName: options.username,
                password: hashedPassword,
                email: options.email
            })
            .returning("*")
            .execute();
            user = result.raw[0];
        } catch(e) {
            if (e.code === '23505') {
                return {
                errors: [
                    {
                        field: "username",
                        message: "Username already exists"
                    }
                ]
            }
            }
        }
        // login user after they register
        req.session.userId = user.id;
        return { user }
    }

    @Mutation(() => UserResponse)
    async login(
        @Arg("usernameOrEmail") usernameOrEmail: string,
        @Arg("password") password: string,
        @Ctx() { req }: MyContext
    ): Promise<UserResponse> {
        if (!usernameOrEmail) {
            return {
                errors: [
                    {
                        field: "usernameOrEmail",
                        message: "Invalid username or email"
                    }
                ]
            }
        }
        const useUserNameOrEmail = usernameOrEmail.includes('@') ? { email: usernameOrEmail } : { userName : usernameOrEmail };
        const user = await User.findOne({ where: useUserNameOrEmail });
        if (!user) {
            return {
                errors: [
                    {
                        field: "usernameOrEmail",
                        message: "User doesn't exist"
                    }
                ]
            }
        }

        const valid = await argon2.verify(user.password, password);
        if (!valid) {
            return {
                errors: [
                    {
                        field: "password",
                        message: "Incorrect password"
                    }
                ]
            }
        }

        req.session.userId = user.id;

        return {
            user
        }
    }

    @Query(() => User, { nullable: true })
    async me(
        @Ctx() { req }: MyContext
    ) {
        const userId = req.session.userId;
        // Not logged in
        if (!userId) {
            return null;
        }

        return await User.findOne(userId as number);
    }

    @Mutation(() => Boolean)
    logout(
        @Ctx() { req , res}: MyContext
    ) {
        return new Promise(resolve => req.session.destroy(err => {
            res.clearCookie(COOKIE_NAME);
            if(err) {
                console.log(err);
                resolve(false);
                return 
            }
            return resolve(true);
        }))
    }
}