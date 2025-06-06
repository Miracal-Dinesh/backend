const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);



const PORT = 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
