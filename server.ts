import express from 'express';
import path from 'path';
import cors from 'cors';
import { createServer as createViteServer } from 'vite';
import { flagsData } from './src/data/flags';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // === API ROUTES ===

  // 1. GET /api/flags
  // Get all flags, with optional ?search and ?region query params
  app.get('/api/flags', (req, res) => {
    try {
      let filteredFlags = [...flagsData];
      const search = req.query.search?.toString().toLowerCase();
      const region = req.query.region?.toString().toLowerCase();

      if (search) {
        filteredFlags = filteredFlags.filter(
          (f) =>
            f.name.toLowerCase().includes(search) ||
            f.code.toLowerCase().includes(search)
        );
      }

      if (region) {
        filteredFlags = filteredFlags.filter((f) => f.region.toLowerCase() === region);
      }

      res.status(200).json({ success: true, data: filteredFlags });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Internal server error' });
    }
  });

  // 2. GET /api/flags/:code
  // Get a flag by its 2-letter ISO code
  app.get('/api/flags/:code', (req, res) => {
    try {
      const code = req.params.code.toUpperCase();
      const flag = flagsData.find((f) => f.code === code);

      if (!flag) {
        // Must use return here
        res.status(404).json({ success: false, error: 'Flag not found' });
        return;
      }

      res.status(200).json({ success: true, data: flag });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Internal server error' });
    }
  });

  // === VITE MIDDLEWARE ===
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
