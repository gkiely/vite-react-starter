import { Hono } from 'hono';
import { prettyJSON } from 'hono/pretty-json';
import { z } from 'zod';
const postSchema = z.object({
    id: z.string(),
    title: z.string(),
});
export const validate = (schema) => {
    return async (c, next) => {
        const { req } = c;
        try {
            schema.parse(req.body);
            await next();
        }
        catch (e) {
            c.text('Error validating route' + req.url, 400);
        }
    };
};
const app = new Hono();
const t = 10;
app.get('/api/posts', prettyJSON(), c => {
    const posts = [
        { id: 1, title: 'Good Morning' },
        { id: 2, title: 'Good Aternoon' },
        { id: 3, title: 'Good Evening' },
        { id: 4, title: 'Good Night' },
    ];
    return c.json(posts);
});
app.post('/api/post/:id', validate(postSchema), async (c) => {
    const { req } = c;
    const id = req.param('id');
    const body = await req.json();
    return c.json({});
});
export default app;
