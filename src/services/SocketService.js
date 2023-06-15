const axios = require('axios');

const RoomService = require('./RoomService');

var listRooms = [];

class SocketService {
    connection(socket) {

        socket.use((packet, next)=>{
            global.instanceAxios = axios.create({
                timeout: 10000,
                withCredentials: true
            });
            next();
        })

        console.log("Connected: " + socket.id);
        console.log("rooms ========");
        console.log(socket.adapter.rooms);
    
        socket.emit("server-connection", socket.id);

        socket.on("create-room", roomName => {
            socket.join(roomName);
            RoomService.createRoom(socket, roomName, listRooms);
        });

        socket.on("connect-all-room", rooms =>{
            RoomService.joinAllRooms(socket,rooms, listRooms)
        })

        socket.on("client-send-message-to-room",(data)=>{

            RoomService.sendMessageToRoom(socket,data);
        })
        socket.on("client-send-message-new-room", data =>{
            RoomService.sendMessageNewRoom(socket,data,listRooms);
        })
    }
}
module.exports = new SocketService();