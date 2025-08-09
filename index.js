const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// CORS Configuration

app.use(cors({
  origin: 'https://frontend-coral-pi-99.vercel.app'  // frontend ka URL
}));
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ Connected to MongoDB"))
.catch(err => console.error("❌ MongoDB connection error:", err));

// Model
const Item = mongoose.model('Item', { name: String });

// Routes
app.get('/items', async (req, res) => {
  try {
    const data = await Item.find();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/items', async (req, res) => {
  try {
    const newItem = new Item({ name: req.body.name });
    const savedItem = await newItem.save();
    res.json(savedItem);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/items/:id', async (req, res) => {
  try {
    const updatedItem = await Item.findByIdAndUpdate(
      req.params.id,
      { name: req.body.name },
      { new: true }
    );
    res.json(updatedItem);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/items/:id', async (req, res) => {
  try {
    await Item.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
