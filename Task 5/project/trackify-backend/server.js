const express = require('express');
const connectDB = require('./DB');

const app = express();
const PORT = process.env.PORT || 5000;


connectDB();

app.use(express.json());


app.get('/', (req, res) => {
  res.send('Trackify backend running...');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
