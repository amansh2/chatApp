const express = require('express');
const cors = require('cors');
const axios = require('axios');
const app = express();
const dbConnect = require('./configs/database.config');
const {userModel} = require('../Backend/models/user.model');
const roomModel = require('../Backend/models/room.model');
const { listenerCount } = require('process');
require('dotenv').config();

dbConnect();
const httpServer = require('http').createServer(app);
const io = require('socket.io')(httpServer);

const corsOptions = {
    origin: 'http://localhost:4200',  // Allow requests from this origin (Angular app running on localhost:4200)
    methods: 'GET,POST',              // Allow only specific HTTP methods
    allowedHeaders: 'Content-Type',   // Allow only Content-Type header
};
app.use(express.json());
app.use(cors(corsOptions));



app.post('/api/authenticate', async (req, res) => {
    const userJsonUrl= req.body.userJsonUrl
    axios.get(userJsonUrl)  
    .then(async (response) => {
      console.log('Data from user JSON URL:', response.data); 
      const user = await userModel.find({phone: response.data.user_phone_number});

      if(user.length > 0){
        return res.send({
            name: response.data.user_first_name + ' ' + response.data.user_last_name,
            phone: response.data.user_phone_number
        });
      }

      userModel.create({
        name: response.data.user_first_name + ' ' + response.data.user_last_name,
        phone: response.data.user_phone_number
      }).then(() => {
          res.send({
            name: response.data.user_first_name + ' ' + response.data.user_last_name,
            phone: response.data.user_phone_number
        });
      }).catch((error)=>{
        res.status(400).send(error)
      })
    })
    .catch(error => {
      console.error('Error fetching data:', error);
      res.status(500).send('Error fetching data from user JSON URL');
    });
});

app.get('/api/getAllUsers', async (req, res) => {
    try{
        const users = await userModel.find();
        console.log(users);
        res.send(users);
    }catch(error){
        res.status(400).send(error)
    }

})

app.post('/api/getChatsForRoom', async (req, res) => {
    try{
        let room = await roomModel.find({roomId: req.body.roomId});
        if(room.length ==0){
            await roomModel.create({roomId: req.body.roomId, chatsArray: []});
            room = await roomModel.find({roomId: req.body.roomId});
        }
        return res.send(room[0]);
    }catch(error){
        res.status(400).send(error)
    }
})

io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('join',(data)=>{
        socket.join(data.room);
        socket.broadcast.to(data.room).emit('user joined')
    })
    
    socket.on('message', (data)=>{

        io.in(data.room).emit('new message',{user: data.user, message: data.message, roomId : data.room});

        (async () => {
            try {
              let roomDoc = await roomModel.findOne({ roomId: data.room });
              if (!roomDoc) {
                roomDoc = new roomModel({
                  roomId: room,
                  chatsArray: [{ user: data.user, message: data.message }]
                });
              } else {
                roomDoc.chatsArray.push({ user: data.user, message: data.message });
              }
              await roomDoc.save();
            } catch (error) {
              console.error('Error saving message:', error);
            }
          })();
    })

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});




const port = process.env.PORT || 3000;
httpServer.listen(port, () => {
    console.log(`listening on *:${port}`);
});