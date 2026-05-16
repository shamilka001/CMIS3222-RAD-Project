import { pgTable, serial, text, varchar, timestamp, integer } from 'drizzle-orm/pg-core';

// 1. Users Table
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: text('password').notNull(), // Store hashed passwords only!
  createdAt: timestamp('created_at').defaultNow(),
});

// 2. Movies Table
export const movies = pgTable('movies', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  genre: text('genre').notNull(),
  description: text('description'),
  posterUrl: text('poster_url').notNull(),   // For the Home Cards
  portraitUrl: text('portrait_url').notNull(), // For the John Wick Detail Page
  duration: varchar('duration', { length: 50 }),
  rating: text('rating'),
});