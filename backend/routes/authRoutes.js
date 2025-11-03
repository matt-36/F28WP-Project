const router = require('express').Router();
const { readData, writeData } = require('../utils/dataHandler');
const { hashPassword } = require('../utils/cryptoUtils');

const generateId = (arr) => arr.length ? Math.max(...arr.map(item => item.id)) + 1 : 101;


router.post('/users/register', (req, res) => {
    const { username, password, role, email } = req.body;

    if (!username || !password || !role) {
        return res.status(400).json({ message: 'Missing required fields: username, password, role' });
    }

    const { hash, salt } = hashPassword(password);

    const users = readData('users.json');
    if (users.some(u => u.username === username)) {
        return res.status(409).json({ message: 'Username already exists' });
    }

    const newUser = {
        id: generateId(users),
        username,
        passwordHash: hash,
        salt,
        role,
        email: email
    };

    users.push(newUser);
    writeData('users.json', users);

    res.status(201).json({ message: 'User registered successfully', userId: newUser.id });
});

module.exports = router;