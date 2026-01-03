import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { getCertificatesCollection, closeClient } from '../cluster/mongo-client.js';

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/api/health', (_req, res) => {
  res.json({ ok: true });
});

app.get('/api/verify/:id', async (req, res) => {
  const searchId = decodeURIComponent(req.params.id || '').trim();
  if (!searchId) return res.status(400).json({ message: 'Credential id required' });

  try {
    const collection = await getCertificatesCollection();
    const doc = await collection.findOne({
      $or: [{ id: searchId }, { verificationCode: searchId }],
    });

    if (!doc) return res.status(404).json({ message: 'Certificate not found' });

    const { _id, ...rest } = doc;
    const issueDate = doc.issueDate instanceof Date
      ? doc.issueDate.toISOString().slice(0, 10)
      : doc.issueDate;

    return res.json({ ...rest, issueDate });
  } catch (err) {
    console.error('Verification lookup failed', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// Graceful shutdown
const gracefulShutdown = async (signal) => {
  console.log(`\n${signal} received. Closing server gracefully...`);
  await closeClient();
  process.exit(0);
};

process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));

// Start server locally
app.listen(PORT, () => {
  console.log(`✓ API server running on http://localhost:${PORT}`);
  console.log(`✓ Health check: http://localhost:${PORT}/api/health`);
});

// Export for Vercel serverless
export default app;
