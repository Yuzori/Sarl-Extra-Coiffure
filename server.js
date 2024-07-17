const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const fs = require('fs');

const app = express();
const server = http.createServer(app);  // Création du serveur HTTP avec Express
const io = socketIo(server);  // Attacher Socket.IO au serveur HTTP

app.use(express.static(path.join(__dirname)));
app.use(express.json());

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/reservation', (req, res) => {
    const reservation = req.body;
    console.log('Réservation reçue:', reservation);

    const reservationData = `
Nom: ${reservation.nom}
Date: ${reservation.date}
Heure: ${reservation.heure}
------------------------------
`;

    fs.appendFile('reser.txt', reservationData, (err) => {
        if (err) {
            console.error('Erreur lors de l\'écriture dans le fichier:', err);
            return res.status(500).send('Erreur du serveur');
        }
        console.log('Réservation enregistrée avec succès');
        res.status(200).send('Réservation enregistrée avec succès');
    });
});

// Connexion à Socket.IO
io.on('connection', (socket) => {
    console.log('Nouvelle connexion socket.io');

    socket.on('message', (message) => {
        console.log('Message reçu:', message);
        io.emit('message', message);
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
});
