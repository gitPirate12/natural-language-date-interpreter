import { mysqlTable, serial, text, json, timestamp } from 'drizzle-orm/mysql-core';

export const requestsTable = mysqlTable('requests_table', {
  id: serial('id').primaryKey(),
  request: text('request').notNull(),
  responseJson: json('response_json').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});