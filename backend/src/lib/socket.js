// socket.io is a library that enables real-time,
// bidirectional and event-based communication
//  between the browser and the server.
//  It consists of two parts: a client-side library
//  that runs in the browser, and a server-side library for Node.js.
// The server-side library is used to create a WebSocket server
// that listens for incoming connections and emits events to the connected clients.
//  The client-side library is used to connect to the server
//  and listen for events emitted by the server.
// one user sends a message socket.io receives the message and sends it to the other user in real-time
// and also it saves the message in the database.
// server side socket.io is named as socket.js
// client side socket.io is named as socket.io-client

import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"],
  },
});

export function getReceiverSocketId(userId) { // it is used to get the receiver socketId when the userId is passed for message controllers
    return userSocketMap[userId];
}

// used to store the online users
const userSocketMap = {}; // { userId: socketId }

io.on("connection", (socket) => { // it is used to listen the connection event
    console.log("User connected", socket.id);

    const userId = socket.handshake.query.userId; // get the userId from the query params and store it in userId variable and this query.userId is passed from the client side in connectSocket function in useAuthStore.js in query params

    if (userId) userSocketMap[userId] = socket.id; // store the userId and socketId in userSocketMap array

    io.emit("getOnlineUsers", Object.keys(userSocketMap)); // it is used to send or broadcast the event to all the connected users that how many users are online



    socket.on("disconnect", () => { // it is used to listen the disconnect event
        console.log("User disconnected", socket.id);
        delete userSocketMap[userId]; // delete the userId and socketId from the userSocketMap array
        io.emit("getOnlineUsers", Object.keys(userSocketMap)); // it is used to send or broadcast the event to all the connected users that how many users are online
    }); // use this getOnlineUsers event to get the online users in the frontend in useAuthStore.js
    
});

export { io, app, server };