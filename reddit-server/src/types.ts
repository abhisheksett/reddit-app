import { Session } from 'express-session';
import { Request, Response } from "express";
import { Redis } from 'ioredis';

export type SessionWithUser = Session & { userId?: number | {}};

export type MyContext = {
    req: Request & { session: SessionWithUser};
    redis: Redis;
    res: Response;
}