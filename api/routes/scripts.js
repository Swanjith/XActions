/**
 * Browser Script Download Routes
 *
 * Serves XActions browser scripts (src/ and src/automation/) behind x402 micropayments.
 * Payment is verified by the x402 middleware before these handlers run.
 *
 * Routes:
 *   GET /api/scripts          — list all scripts with prices (free)
 *   GET /api/scripts/src/:name       — download a src/ script
 *   GET /api/scripts/automation/:name — download an automation script
 *
 * @author nichxbt
 */

import { Router } from 'express';
import { readFile } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { SCRIPT_PRICES } from '../config/x402-config.js';

const router = Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const SRC_ROOT = path.resolve(__dirname, '../../src');

// Only allow safe camelCase / known filename characters
const SAFE_NAME = /^[a-zA-Z0-9_-]+$/;

/**
 * GET /api/scripts
 * Free listing of all available scripts with their x402 prices.
 */
router.get('/', (req, res) => {
  const scripts = Object.entries(SCRIPT_PRICES).map(([scriptPath, price]) => {
    const [collection, name] = scriptPath.split('/');
    return {
      path: scriptPath,
      name,
      collection,
      endpoint: `/api/scripts/${scriptPath}`,
      price,
    };
  });

  res.json({
    count: scripts.length,
    currency: 'USDC',
    payment: 'x402',
    scripts,
  });
});

/**
 * GET /api/scripts/src/:name
 * Serve a browser script from src/ — requires x402 payment.
 */
router.get('/src/:name', async (req, res) => {
  const { name } = req.params;

  if (!SAFE_NAME.test(name)) {
    return res.status(400).json({ error: 'Invalid script name' });
  }

  const scriptPath = `src/${name}`;
  if (!SCRIPT_PRICES[scriptPath]) {
    return res.status(404).json({ error: 'Script not found' });
  }

  const filePath = path.resolve(SRC_ROOT, `${name}.js`);
  // Guard against path traversal (resolve must stay within SRC_ROOT)
  if (!filePath.startsWith(SRC_ROOT + path.sep) && filePath !== SRC_ROOT) {
    return res.status(403).json({ error: 'Access denied' });
  }

  try {
    const content = await readFile(filePath, 'utf8');
    res.set('Content-Type', 'application/javascript; charset=utf-8');
    res.set('X-Script-Name', name);
    res.set('X-Script-Price', SCRIPT_PRICES[scriptPath]);
    res.send(content);
  } catch {
    res.status(404).json({ error: 'Script not found' });
  }
});

/**
 * GET /api/scripts/automation/:name
 * Serve a browser automation script from src/automation/ — requires x402 payment.
 */
router.get('/automation/:name', async (req, res) => {
  const { name } = req.params;

  if (!SAFE_NAME.test(name)) {
    return res.status(400).json({ error: 'Invalid script name' });
  }

  const scriptPath = `automation/${name}`;
  if (!SCRIPT_PRICES[scriptPath]) {
    return res.status(404).json({ error: 'Script not found' });
  }

  const filePath = path.resolve(SRC_ROOT, 'automation', `${name}.js`);
  const automationRoot = path.resolve(SRC_ROOT, 'automation');
  if (!filePath.startsWith(automationRoot + path.sep) && filePath !== automationRoot) {
    return res.status(403).json({ error: 'Access denied' });
  }

  try {
    const content = await readFile(filePath, 'utf8');
    res.set('Content-Type', 'application/javascript; charset=utf-8');
    res.set('X-Script-Name', name);
    res.set('X-Script-Price', SCRIPT_PRICES[scriptPath]);
    res.send(content);
  } catch {
    res.status(404).json({ error: 'Script not found' });
  }
});

export default router;
