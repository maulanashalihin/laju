const express = require('express');
const app = express();
const port = 3005;

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.listen(port, () => {
  console.log(`Server running at http://127.0.0.1:${port}/`);
});
