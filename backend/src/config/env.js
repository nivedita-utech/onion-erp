import { z } from 'zod';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

// Resolve .env from the backend root (src/config/ → ../../.env)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

/**
 * Environment variable schema — validates all required config at startup.
 * dotenv is loaded above before validation runs.
 */
const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().default('5000'),

  // .url() rejects mongodb+srv:// — use .min(1) instead
  DB_URI: z.string().min(1, 'DB_URI is required in .env'),

  JWT_SECRET: z.string().min(10, 'JWT_SECRET must be at least 10 characters'),
  JWT_EXPIRE: z.string().default('30d'),

  // Optional — only needed in production
  FRONTEND_URL: z.string().optional(),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error('❌ Invalid environment variables:');
  _env.error.errors.forEach((e) => {
    console.error(`  • ${e.path.join('.')}: ${e.message}`);
  });
  process.exit(1);
}

export const env = _env.data;
