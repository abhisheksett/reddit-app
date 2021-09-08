import "reflect-metadata";
import { MyContext } from 'src/types';
import { UserResolver } from './resolvers/user';
import { PostResolver } from './resolvers/post';
import { HelloResolver } from './resolvers/hello';
import { __prod__ } from './constants';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import Redis from "ioredis";
import session from 'express-session';
import connectRedis from 'connect-redis';
import cors from 'cors';
import { COOKIE_NAME } from './constants';
import dotenv from "dotenv";
import {createConnection} from "typeorm";
import { User } from './entities/User';
import { Post } from './entities/Post';

const main = async () => {
    dotenv.config();
    await createConnection({
        type: 'postgres',
        database: 'lireddit2',
        username: 'postgres',
        password: 'postgres',
        logging: true,
        synchronize: true,
        entities: [Post, User]
    });
    
    const app = express();

    const RedisStore = connectRedis(session);
    const redis = new Redis();

    app.use(
        session({
            name: COOKIE_NAME,
            store: new RedisStore({ 
                client: redis,
                disableTouch: true
            }),
            cookie: {
                maxAge: 1000 * 60 * 60 * 24 * 365 * 10, // 10 years
                httpOnly: true,
                secure: __prod__,
                sameSite: 'none'
            },
            saveUninitialized: false,
            secret: process.env.SESSION_SECRET || '', // This is coming from .env file
            resave: false
        })
    );

    app.use(cors({
        credentials: true,
        origin: 'http://localhost:3000'
    }))

    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers: [HelloResolver, PostResolver, UserResolver],
            validate: false
        }),
        context: ({ req, res }): MyContext => ({ req, res, redis })
    });

    await apolloServer.start();
    apolloServer.applyMiddleware({ 
        app, 
        cors: {
            credentials: false
        } 
    });

    app.listen(4000, () => {
        console.log('server started at port 4000')
    });
}


main();