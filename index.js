 const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/curd-app', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define Model
const Item = mongoose.model('Items', { name: String });

// Routes
app.get('/items', (req, res) => {
  Item.find().then(data => res.json(data));  // ✅ fixed here
});

app.post('/items', (req, res) => {
  new Item({ name: req.body.name })
    .save()
    .then(data => res.json(data));
});

app.put('/items/:id', (req, res) => {
  Item.findByIdAndUpdate(req.params.id, { name: req.body.name }, { new: true })
    .then(data => res.json(data));
});

app.delete('/items/:id', (req, res) => {
  Item.findByIdAndDelete(req.params.id).then(() => res.json({ success: true }));
});

// Start server
app.listen(5000, () => console.log('✅ Server started on http://localhost:5000'));
