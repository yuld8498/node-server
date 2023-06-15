const axios = require("axios");

const App = require("../models/App.model");

const URL = App.BASE_URL_MESSAGE;

let createRoom = (socket, roomName, listRooms) => {
  socket.roomByRooms = roomName;

  if (listRooms.indexOf(roomName) >= 0) {
  } else {
    listRooms.push(roomName);
  }
  // _io.sockets.emit("server-send-rooms", listRooms);
  // socket.emit("server-send-room-socket", roomName);
  // socket.broadcast.emit("server-send-room-socket", roomName);
};

let sendMessageNewRoom = (socket, data, listRooms) => {
  console.log("send msg new room");
  createRoom(socket,data.roomChatId,listRooms);

  const url = `${URL}/users/${data.roomChatId}?recipientId=${data.recipientId}&senderId=${data.userId}`;
  axios
    .post(url, data.sendMsg, {
      headers: { "Content-Type": "application/text" },
    })
    .then((res) => {
      socket.emit("newRoom-message","newRoom");
      // let roomId = res.data.roomChatDTO.id;
      socket.in(data.roomChatId).emit("server-send-message", res.data);
    })
};

const joinAllRooms = (socket, rooms, listRooms) => {
  rooms.forEach((roomName) => {
    socket.roomByRooms = roomName;
    if (listRooms.indexOf(roomName) >= 0) {
    } else {
      listRooms.push(roomName);
    }
  });
};

let sendMessageToRoom = (socket, data) => {
  if (data.type === "user chat") {
    //call api create message user with user
    const url = `${URL}/users/${data.roomChatId}?recipientId=${data.recipientId}&senderId=${data.userId}`;
   
    axios
      .post(url, data.sendMsg, {
        headers: { "Content-Type": "application/text" },
      })
      .then((res) => {
        // let roomId = res.data.roomChatDTO.id;
        socket.in(data.roomChatId).emit("server-send-message",res.data );
      })
  }
  if (data.type === "group chat") {
    const url = `${URL}/group/${data.roomChatId}?userId=${data.userId}`;

    axios
      .post(url, data.sendMsg, {
        headers: { "Content-Type": "application/text" },
      })
      .then((res) => {
        socket.in(data.roomChatId).emit("server-send-message", res.data);
      })
  }
  socket.emit("new-message-new",data);
};

let RoomService = {
  createRoom,
  sendMessageToRoom,
  sendMessageNewRoom,
  joinAllRooms,
};

module.exports = RoomService;
