import { buildApp } from './app.js';

const HOST = '127.0.0.1';
const PORT = 8787;

async function startServer() {
  const app = buildApp();

  try {
    await app.listen({
      host: HOST,
      port: PORT,
    });

    app.log.info(`Local API listening on http://${HOST}:${PORT}`);
  } catch (error) {
    app.log.error(error);
    process.exitCode = 1;
  }
}

void startServer();
