import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectDB } from './database.js';

const app = express();
app.use(cors());
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname,'public')));

let db;
connectDB().then(d=>{
  db=d;
  console.log('DB ready');
});

// -------- BOOKS CRUD
app.get('/api/books', async (req,res)=> {
  const rows = await db.all('SELECT * FROM Book ORDER BY id DESC');
  res.json(rows);
});
app.get('/api/books/:id', async (req,res)=> {
  const r = await db.get('SELECT * FROM Book WHERE id=?',[req.params.id]);
  if(!r) return res.status(404).json({error:'Not found'});
  res.json(r);
});
app.post('/api/books', async (req,res)=> {
  const {title,author,publisher} = req.body;
  const r = await db.run('INSERT INTO Book (title,author,publisher) VALUES (?,?,?)',[title,author,publisher]);
  res.json({id:r.lastID});
});
app.put('/api/books/:id', async (req,res)=> {
  const {title,author,publisher} = req.body;
  await db.run('UPDATE Book SET title=?,author=?,publisher=? WHERE id=?',[title,author,publisher,req.params.id]);
  res.json({success:true});
});
app.delete('/api/books/:id', async (req,res)=> {
  await db.run('DELETE FROM Book WHERE id=?',[req.params.id]);
  res.json({success:true});
});

// -------- MEMBERS CRUD
app.get('/api/members', async (req,res)=> {
  const rows = await db.all('SELECT * FROM Member ORDER BY id DESC');
  res.json(rows);
});
app.post('/api/members', async (req,res)=> {
  const {membername,joindate} = req.body;
  const r = await db.run('INSERT INTO Member (membername,joindate) VALUES (?,?)',[membername,joindate]);
  res.json({id:r.lastID});
});
app.delete('/api/members/:id', async (req,res)=> {
  await db.run('DELETE FROM Member WHERE id=?',[req.params.id]);
  res.json({success:true});
});

// -------- ISSUED (with join)
app.get('/api/issued', async (req,res)=> {
  const rows = await db.all(`
    SELECT Issued.id, Issued.issuedate, Issued.returndate, Member.membername, Book.title
    FROM Issued
    JOIN Member ON Issued.member_id = Member.id
    JOIN Book   ON Issued.book_id = Book.id
    ORDER BY Issued.id DESC
  `);
  res.json(rows);
});
app.post('/api/issued', async (req,res)=> {
  const { member_id, book_id, issuedate, returndate } = req.body;
  const r = await db.run('INSERT INTO Issued (member_id,book_id,issuedate,returndate) VALUES (?,?,?,?)',[member_id,book_id,issuedate,returndate]);
  res.json({id:r.lastID});
});
app.delete('/api/issued/:id', async (req,res)=> {
  await db.run('DELETE FROM Issued WHERE id=?',[req.params.id]);
  res.json({success:true});
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=> console.log(`Server running at http://localhost:${PORT}`));
