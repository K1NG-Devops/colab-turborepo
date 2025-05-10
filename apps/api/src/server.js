const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send('API is running ON PORT ' + port);
});

app.listen(port, () => {
    console.log(`API is running on http://localhost:${port}`);
});