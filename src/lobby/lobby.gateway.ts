import { Body, Inject, UsePipes } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UserIdDTO } from 'src/user/user.dto';
import Lobby from './lobby';
import { LobbyPipeDTO } from './lobby.dto';
import { LobbyEmitEvent, LobbySubEvent } from './lobby.events';
import { LobbyPipe } from './lobby.pipe';
import { LobbyService } from './lobby.service';

@WebSocketGateway()
export class LobbyGateway implements OnGatewayDisconnect, OnGatewayConnection {
  private userIdsToSockets: Record<string, Socket> = {};
  private socketIdsToUserIds: Record<string, string> = {};
  private userIdsToLobby: Record<string, Lobby> = {};

  @WebSocketServer()
  protected server: Server;

  constructor(private lobbyService: LobbyService, private jwtService: JwtService) {}

  handleConnection(client: Socket) {
    const { token } = client.handshake.query;
    const { userId } = this.jwtService.verify<UserIdDTO>(token);
    this.userIdsToSockets[userId] = client;
    this.socketIdsToUserIds[client.id] = userId;
  }

  async handleDisconnect(client: Socket) {
    const userId = this.socketIdsToUserIds[client.id];

    const lobby = this.userIdsToLobby[userId]?.removeUserById(userId);

    if (lobby) this.server.to(lobby.id).emit(LobbyEmitEvent.Update, lobby);

    delete this.userIdsToSockets[userId];
    delete this.socketIdsToUserIds[client.id];
    delete this.userIdsToLobby[userId];
  }

  @SubscribeMessage(LobbySubEvent.Join)
  async handleJoin(@ConnectedSocket() client: Socket, @MessageBody(LobbyPipe) { user, lobby }: LobbyPipeDTO) {
    lobby.users.push(user);
    client.join(lobby.id);

    this.userIdsToLobby[user.id]?.removeUser(user);
    this.userIdsToLobby[user.id] = lobby;

    this.server.to(lobby.id).emit(LobbyEmitEvent.Update, lobby);
  }

  @SubscribeMessage(LobbySubEvent.Remove)
  async handleRemove(@MessageBody(LobbyPipe) { user, lobby }: LobbyPipeDTO) {
    lobby.removeUser(user);
    this.server.to(lobby.id).emit(LobbyEmitEvent.Update, lobby);
    this.userIdsToSockets[user.id].leave(lobby.id);
    delete this.userIdsToLobby[user.id];
  }
}
