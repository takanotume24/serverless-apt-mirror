import { Hono, Context } from 'hono';
import { handleRelease } from './handleRelease';
import { handleCacheableGetRequest } from './handleCacheableGetRequest';

const app = new Hono<{ Bindings: Env }>();

app.get('/ubuntu/dists/*', handleRelease);
app.get('/ubuntu/*', handleCacheableGetRequest);

export default app;
