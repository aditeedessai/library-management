import sqlite3 from "sqlite3";
import { open } from "sqlite";

export async function connectDB(){
  const db = await open({
    filename: "./library.db",
    driver: sqlite3.Database
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS Book (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      author TEXT,
      publisher TEXT
    );
    CREATE TABLE IF NOT EXISTS Member (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      membername TEXT NOT NULL,
      joindate TEXT
    );
    CREATE TABLE IF NOT EXISTS Issued (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      member_id INTEGER NOT NULL,
      book_id INTEGER NOT NULL,
      issuedate TEXT NOT NULL,
      returndate TEXT,
      FOREIGN KEY(member_id) REFERENCES Member(id),
      FOREIGN KEY(book_id) REFERENCES Book(id)
    );
  `);

  return db;
}
