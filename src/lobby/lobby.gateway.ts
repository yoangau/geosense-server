import { OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { LobbyUserAdminDTO, LobbyUserDTO } from './lobby.dto';
import { LobbyEmitEvent, LobbySubEvent } from './lobby.events';
import { LobbyService } from './lobby.service';

@WebSocketGateway()
export class LobbyGateway implements OnGatewayDisconnect {
  private userIdsToSockets: Record<string, Socket> = {};
  private socketIdsToUserIds: Record<string, string> = {};

  @WebSocketServer()
  protected server: Server;

  constructor(private lobbyService: LobbyService) {}

  handleDisconnect(client: Socket) {
    const userId = this.socketIdsToUserIds[client.id];
    delete this.userIdsToSockets[userId];
    delete this.socketIdsToUserIds[client.id];
  }

  @SubscribeMessage(LobbySubEvent.Join)
  async handleJoin(client: Socket, lobbyUser: LobbyUserDTO) {
    const { userId, lobbyId } = lobbyUser;
    const lobby = await this.lobbyService.addUser(lobbyUser);
    client.join(lobbyId);
    this.userIdsToSockets[userId] = client;
    this.socketIdsToUserIds[client.id] = userId;
    this.server.to(lobbyId).emit(LobbyEmitEvent.Update, lobby);
  }

  @SubscribeMessage(LobbySubEvent.Remove)
  async handleRemove(client: Socket, { adminId, ...lobbyUser }: LobbyUserAdminDTO) {
    const { userId, lobbyId } = lobbyUser;
    const lobby = await this.lobbyService.removeUser(lobbyUser);
    this.userIdsToSockets[userId].leave(lobbyId);
    this.server.to(lobbyId).emit(LobbyEmitEvent.Update, lobby);
  }
}
