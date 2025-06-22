const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const vaultRoutes = require('./routes/vaultRoutes');
const verifyToken = require('./middleware/authMiddleware');

require('dotenv').config();

const app = express();
app.use(cors({
  origin: '*', // allow all origins during development
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/vault', vaultRoutes);

const PORT = process.env.PORT || 5000;

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log(err));

app.get('/', (req, res) => {
  res.send('SecureVault API running');
});

app.get('/api/protected', verifyToken, (req, res) => {
  res.json({ message: 'Protected content', userId: req.user });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
