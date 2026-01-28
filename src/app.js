const express = require('express');
const postRoutes = require('./routes/postRoutes');
const commentRoutes = require('./routes/commentRoutes');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/health', (req, res) => {
  res.json({ status: 'OK' });
});

app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);

module.exports = app;