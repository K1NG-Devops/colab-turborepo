import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import { db } from './db.js';
import path from 'path';
import { fileURLToPath } from 'url';
// import { CreateServer } from 'http';
import { Server } from 'socket.io';
import { createProxyMiddleware } from 'http-proxy-middleware';


// const { createServer } = require('http');


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, './.env') });

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use('/react-app', createProxyMiddleware({
    target: 'http://localhost:5173', // React development server
    changeOrigin: true,
    pathRewrite: {
      '^/react-app': '', // remove the /react-app prefix before forwarding
    },
  }));

app.use(cors());
app.use(express.json());
app.use('/angular-app/', express.static(path.join(__dirname, '../../dist/angular-app/')));
app.get('', (req, res) => {
    res.sendFile(path.join(__dirname, '../../angular-app/dist/angular-app/browser/index.html'));
});

app.use('/react-app', express.static(path.join(__dirname, '../../react-app/dist')));
app.get('/react-app', (req, res) => {
    res.sendFile(path.join(__dirname, '../../react-app/dist/index.html'));
})

const upload = multer({ dest: 'uploads/' });


app.get('/api/user', async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT * FROM users')
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(port, () => {
    console.log(`API is running on http://localhost:${port}`);
});