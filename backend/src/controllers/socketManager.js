import { Server } from "socket.io";

let connections = {};
let messages = {};
let timeOnline = {};

export const connectToSocket = (server) => {
  const io = new Server(server);

  io.on("connection", (socket) => {


    socket.on("join-call", (path) => {
        if(connections[path] === undefined){
            connections[path] = socket.id;
            messages[path] = [];
            timeOnline[path] = new Date();

            // connections[path].forEach(element => {
            //     io.to(element);
            // });

            for(let a = 0; a < connections[path].length; a++){
                io.to(connections[path][a]).emit("user-joined", socket.id, connections[path]);
            }

            if(messages[path] === undefined) {
                for(let a = 0; a < messages[path].length; ++a){
                    io.to(socket.is).emit("chat-message", messages[path][a]['data'], messages[path][a]['sender'], messages[path][a]['socket-id-sender'])
                }
            }
        }
    })


    socket.on("signal", (toId, message) => {
        io.to(toId).emit("signal", socket.id, message);
    })


    socket.on("chat-message", (data, sender) => {
        const [matchingRoom, found] = Object.entries(connections)
        .reduce(([room, isFound], [roomKey, roomValue]) => {
            if(!isFound && roomValue.includes(socket.id)) {
                return [roomKey, true];
            }
            return [room, isFound];
        }, ['', false]);
        
        if(found === true){
            if(messages[matchingRoom] === undefined){
                messages[matchingRoom] = [];
            }

            messages[matchingRoom].push({ 'sender': sender, 'data': data, 'socket-id-sender': socket.id });
            console.log("message", key, ":", sender, data);
            
            connections[matchingRoom].forEach((element) => {
                io.to(element).emit("chat-message", data, sender, socket.id);
            })
        }
    })


    socket.on("disconnect", () => {
        var diffTime = Math.abs(timeOnline[socket.id] - new Date());
        var key;
        for(const [k, v] of JSON.parse(JSON.stringify(Object.entries(connections)))){
            for(let a = 0; a < v.length; ++a){
                if(v[a] === socket.id){
                    key = k;
                    for(let a = 0; a < connections[key].length; ++a){
                        io.to(connections[key][a]).emit('user-left', socket.id)
                    }
                    var index = connections[key].indexOf(socket.id);
                    connections[key].splice(index, 1);
                    if(connections[key].length === 0){
                        delete connections[key];
                    }
                }
            }
        }
    })


  });

  return io;
};