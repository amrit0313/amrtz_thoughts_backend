import 'dotenv/config';
import { DataSource } from 'typeorm';

export default new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  synchronize: false,
  ssl: {
    rejectUnauthorized: false,
  },
  entities: ['src/**/*.entity.ts', 'src/**/*.entitiy.ts'],
  migrations: ['src/migrations/*.ts'],
});
