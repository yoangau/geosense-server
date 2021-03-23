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
import { LobbyPipeDTO } from './lobby.dto';
import { LobbyEmitEvent, LobbySubEvent } from './lobby.events';
import { LobbyPipe } from './lobby.pipe';
import { LobbyService } from './lobby.service';

@WebSocketGateway()
export class LobbyGateway implements OnGatewayDisconnect, OnGatewayConnection {
  private userIdsToSockets: Record<string, Socket> = {};
  private socketIdsToUserIds: Record<string, string> = {};
  private userIdsToLobbyIds: Record<string, string[]> = {};

  @WebSocketServer()
  protected server: Server;

  constructor(private lobbyService: LobbyService, private jwtService: JwtService) {}

  handleConnection(client: Socket) {
    const { token } = client.handshake.query;
    const { userId } = this.jwtService.verify<UserIdDTO>(token);
    this.userIdsToSockets[userId] = client;
    this.socketIdsToUserIds[client.id] = userId;
    this.userIdsToLobbyIds[userId] = [];
  }

  async handleDisconnect(client: Socket) {
    const userId = this.socketIdsToUserIds[client.id];
    await Promise.all(
      this.userIdsToLobbyIds[userId]?.map(async l => {
        const lobby = await this.lobbyService.removeUser({ userId, lobbyId: l });
        if (lobby) this.server.to(l).emit(LobbyEmitEvent.Update, lobby);
      }),
    );
    delete this.userIdsToSockets[userId];
    delete this.socketIdsToUserIds[client.id];
    delete this.userIdsToLobbyIds[userId];
  }

  @SubscribeMessage(LobbySubEvent.Join)
  async handleJoin(@ConnectedSocket() client: Socket, @MessageBody(LobbyPipe) { user, lobby }: LobbyPipeDTO) {
    lobby.users.push(user);
    client.join(lobby.id);
    this.userIdsToLobbyIds[user.id].push(lobby.id);
    this.server.to(lobby.id).emit(LobbyEmitEvent.Update, lobby);
  }

  @SubscribeMessage(LobbySubEvent.Remove)
  async handleRemove(@MessageBody(LobbyPipe) { user, lobby }: LobbyPipeDTO) {
    lobby.removeUser(user);
    this.userIdsToSockets[user.id].leave(lobby.id);
    this.userIdsToLobbyIds[user.id] = this.userIdsToLobbyIds[user.id].filter(l => l !== lobby.id);
    this.server.to(lobby.id).emit(LobbyEmitEvent.Update, lobby);
  }
}
