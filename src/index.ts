import { Hono, Context } from 'hono';
import { handleGetRequest } from './handleGetRequest';

const app = new Hono<{ Bindings: Env }>();

app.get('/*', handleGetRequest);

export default app;
