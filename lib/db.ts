import { Pool } from 'pg';

// Проверяем наличие переменной окружения
if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not set in environment variables');
}

// Создаем и экспортируем пул подключений
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Проверяем подключение при инициализации
pool.connect((err, client, release) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  release();
  console.log('✅ Successfully connected to PostgreSQL');
});
