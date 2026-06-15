import express from 'express';
import cors from 'cors';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { flagsData } from './src/data/flags.js';

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Allow unrestricted cross-origin requests
  app.use(cors());
  app.use(express.json());

  // === API ROUTES ===
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
        filteredFlags = filteredFlags.filter(
          (f) => f.region.toLowerCase() === region
        );
      }

      res.json({ success: true, count: filteredFlags.length, data: filteredFlags });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Failed to fetch flags' });
    }
  });

  app.get('/api/flags/:code', (req, res) => {
    try {
      const code = req.params.code.toUpperCase();
      const flag = flagsData.find((f) => f.code === code);

      if (!flag) {
        res.status(404).json({ success: false, error: 'Flag not found' });
        return;
      }

      res.json({ success: true, data: flag });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Failed to fetch flag details' });
    }
  });

  // Vite middleware for SPA
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
