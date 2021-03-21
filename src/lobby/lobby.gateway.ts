import { Body, Inject, UsePipes } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { LobbyPipeDTO } from './lobby.dto';
import { LobbyEmitEvent, LobbySubEvent } from './lobby.events';
import { LobbyPipe } from './lobby.pipe';
import { LobbyService } from './lobby.service';

@WebSocketGateway()
export class LobbyGateway implements OnGatewayDisconnect {
  private userIdsToSockets: Record<string, Socket> = {};
  private socketIdsToUserIds: Record<string, string> = {};

  @WebSocketServer()
  protected server: Server;

  constructor(private moduleRef: ModuleRef, private lobbyService: LobbyService) {}

  handleDisconnect(client: Socket) {
    const userId = this.socketIdsToUserIds[client.id];
    delete this.userIdsToSockets[userId];
    delete this.socketIdsToUserIds[client.id];
    Object.keys(client.rooms).forEach(lobbyId => this.lobbyService.removeUser({ userId, lobbyId }));
  }

  @SubscribeMessage(LobbySubEvent.Join)
  async handleJoin(@ConnectedSocket() client: Socket, @MessageBody(LobbyPipe) { user, lobby }: LobbyPipeDTO) {
    lobby.users.push(user);
    client.join(lobby.id);
    this.userIdsToSockets[user.id] = client;
    this.socketIdsToUserIds[client.id] = user.id;
    this.server.to(lobby.id).emit(LobbyEmitEvent.Update, lobby);
  }

  @SubscribeMessage(LobbySubEvent.Remove)
  async handleRemove(@MessageBody(LobbyPipe) { user, lobby }: LobbyPipeDTO) {
    lobby.removeUser(user);
    this.userIdsToSockets[user.id].leave(lobby.id);
    this.server.to(lobby.id).emit(LobbyEmitEvent.Update, lobby);
  }
}
