const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config(); // ✅ .env file load karne ke liye

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ Connected to MongoDB"))
.catch(err => console.error("❌ MongoDB connection error:", err));

// Define Model
const Item = mongoose.model('Items', { name: String });

// Routes
app.get('/items', (req, res) => {
  Item.find().then(data => res.json(data));
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

// Start server (✅ Dynamic port)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
