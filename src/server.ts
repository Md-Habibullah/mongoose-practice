import { Server } from 'http'
import app from './app'
const mongoose = require('mongoose');

let server: Server;
const PORT = 5000;

async function main() {
    try {
        await mongoose.connect('mongodb+srv://mongodb:mongodb@cluster0.swvhuu2.mongodb.net/advanced-note-app?retryWrites=true&w=majority&appName=Cluster0');
        server = app.listen(PORT, () => {
            console.log(`app is listening at port ${PORT}`)
        })
    } catch (error) {
        console.log(error)
    }
};

main();