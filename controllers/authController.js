const db = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  const { name, email, password, role = 'user' } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  const sql = `INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)`;

  db.query(sql, [name, email, hashedPassword, role], (err) => {
    if (err) return res.status(500).json({ error: 'User already exists or error!' });
    res.json({ message: 'User registered successfully!' });
  });
};

exports.login = (req, res) => {
  const { email, password } = req.body;

 
  db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
    if (err || results.length === 0) return res.status(401).json({ error: 'Invalid email or password' });
    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) return res.status(401).json({ error: 'Invalid email or password' });
    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '30m',
    });
 
    res.json({ message: 'Login successful!', token,user: {id: user.id,name: user.name, email: user.email, role: user.role} });
  });
};

exports.activity=(req, res) => {
   const {ip_address,email,action} = req.body;
   const sql = `INSERT INTO activity_logs (ip_address,useremail, action) VALUES (?, ?, ?)`;
  db.query(sql, [ip_address,email, action], (err) => {
    if (err) return res.status(500).json({ error: 'User already exists or error!' });
    res.json({ message: 'User registered successfully!' });
  });
};

exports.activities = (req, res) => {
  const { email, page = 1, limit = 10000 } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }
  let sql;
  let countSql;
  const offset = (page - 1) * limit;
  if (email=="admin@gmail.com"){
  const sql1 = 'SELECT * FROM activity_logs  ORDER BY timestamp DESC LIMIT ? OFFSET ?'
  sql=sql1;
  countSql = 'SELECT COUNT(*) as count FROM activity_logs ';

    db.query(sql, [ parseInt(limit), parseInt(offset)], (err, results) => {
    if (err) return res.status(500).json({ error: 'Database error' });

    db.query(countSql, (countErr, countResults) => {
      if (countErr) return res.status(500).json({ error: 'Count query error' });

      const total = countResults[0].count;
      const totalPages = Math.ceil(total / limit);
      res.json({ activities: results, totalPages, currentPage: parseInt(page) });
    });
  });
  
  }else
  {
  const sql2 = 'SELECT * FROM activity_logs  WHERE useremail = ? ORDER BY timestamp DESC LIMIT ? OFFSET ?';
  countSql = 'SELECT COUNT(*) as count FROM activity_logs WHERE useremail = ?';
  sql=sql2;

  db.query(sql, [email, parseInt(limit), parseInt(offset)], (err, results) => {
    if (err) return res.status(500).json({ error: 'Database error' });

    db.query(countSql, [email], (countErr, countResults) => {
      if (countErr) return res.status(500).json({ error: 'Count query error' });

      const total = countResults[0].count;
      const totalPages = Math.ceil(total / limit);
      res.json({ activities: results, totalPages, currentPage: parseInt(page) });
    });
  });

  }
  


  
};
