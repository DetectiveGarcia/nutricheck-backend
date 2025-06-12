import express from 'express';
import { registerUser } from './controllers/users.controller';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.get('/register', registerUser)

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});