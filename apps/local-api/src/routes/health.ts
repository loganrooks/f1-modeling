import type { FastifyPluginAsync } from 'fastify';

const healthRoutes: FastifyPluginAsync = async (app) => {
  app.get('/api/health', async () => ({
    status: 'ok',
    service: 'local-api',
    host: '127.0.0.1',
    port: 8787,
    checkedAt: new Date().toISOString(),
  }));
};

export default healthRoutes;
