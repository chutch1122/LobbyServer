var port = 9090;
var io = require('socket.io')(port);
var ClientManagerService = require('./app/services/ClientManagerService');
var LobbyManagerService = require('./app/services/LobbyManagerService');

console.log("---------------------------");
console.log("League Sandbox Lobby Server");
console.log("Listening on port " + port);
console.log("---------------------------");

io.on('connection', function(client){
  console.log("Client connected");
  ClientManagerService.connected(client);

  client.on('lobby.list', function(){
    var lobbies = LobbyManagerService.getLobbies();
    //Send all the lobbies (list)
    client.emit('lobby.list', lobbies);
  });

  client.on('lobby.create', function(options){
    var newLobby = LobbyManagerService.create(options);
    //We send all the info to let clients add the new server to the list
    client.emit('lobbylist-add', newLobby); 
    console.log("New lobby created with ID " + LobbyManagerService.getLobbyId);
  });

  client.on('disconnect', function(){
    console.log("Client disconnected");
    ClientManagerService.disconnected(client);
  });
});
