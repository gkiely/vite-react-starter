import { Context, Hono, Next } from 'hono';
import { AnyZodObject } from 'zod';
export declare const validate: (schema: AnyZodObject) => (c: Context, next: Next) => Promise<void>;
declare const app: Hono<import("hono").Env, "/">;
export default app;
