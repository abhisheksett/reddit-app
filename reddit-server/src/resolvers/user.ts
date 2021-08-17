import { User } from "../entities/User";
import { MyContext } from "src/types";
import { Arg, Ctx, Field, InputType, Mutation, ObjectType, Query } from "type-graphql";
import argon2 from 'argon2';

@InputType()
class UserInput {
    @Field()
    username: string;

    @Field()
    password: string;
}

@ObjectType()
class FieldError {
    @Field()
    field: string;

    @Field()
    message: string;

}

@ObjectType()
class UserResponse {
    @Field(() => [FieldError], { nullable: true })
    errors?: FieldError[];

    @Field(() => User, { nullable: true })
    user?: User
}

export class UserResolver {

    @Mutation(() => UserResponse)
    async register(
        @Arg("options") options: UserInput,
        @Ctx() { em, req }: MyContext
    ): Promise<UserResponse> {
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

        const hashedPassword = await argon2.hash(options.password);
        const user = em.create(User, { 
            userName: options.username,
            password: hashedPassword
        });
        try {
            await em.persistAndFlush(user);
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
        req.session.userId = user;
        return {user};
    }

    @Mutation(() => UserResponse)
    async login(
        @Arg("options") options: UserInput,
        @Ctx() { em, req }: MyContext
    ): Promise<UserResponse> {
        const user = await em.findOne(User, { userName: options.username});
        if (!user) {
            return {
                errors: [
                    {
                        field: "username",
                        message: "User doesn't exist"
                    }
                ]
            }
        }

        const valid = await argon2.verify(user.password, options.password);
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

        req.session.userId = user;

        return {
            user
        }
    }

    @Query(() => User, { nullable: true })
    async me(
        @Ctx() { em, req }: MyContext
    ) {
        const userId = req.session.userId;
        // Not logged in
        if (!userId) {
            return null;
        }

        const user = await em.findOne(User, { id: userId });
        return user;
    }
}