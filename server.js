const express = require('express');
const app = express();

app.use((req, res, next) => {
    if (req.path.endsWith('.wasm')) {
        res.set('Content-Type', 'application/wasm');
    }
    next();
});

app.use(express.static('./'));

app.listen(1024, () => console.log('Server running on port 1024'));
// Go to localhost:1024/src/ in your browser
