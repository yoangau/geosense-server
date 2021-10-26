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
import { GameEmitEvent } from 'src/game/game.events';
import { GameService } from 'src/game/game.service';
import { UserIdDTO } from 'src/user/user.dto';
import Lobby from './lobby';
import { LobbyPipeDTO } from './lobby.dto';
import { LobbyEmitEvent, LobbySubEvent } from './lobby.events';
import { LobbyPipe } from './lobby.pipe';
import { LobbyService } from './lobby.service';

@WebSocketGateway()
export class LobbyGateway implements OnGatewayDisconnect, OnGatewayConnection {
  private userIdsToSockets: Map<string, Socket> = new Map();
  private socketIdsToUserIds: Map<string, string> = new Map();
  private userIdsToLobby: Map<string, Lobby> = new Map();

  @WebSocketServer()
  protected server: Server;

  constructor(private lobbyService: LobbyService, private jwtService: JwtService, private gameService: GameService) { }

  handleConnection(client: Socket) {
    const { token } = client.handshake.query;
    const { userId } = this.jwtService.verify<UserIdDTO>(token);
    this.userIdsToSockets.set(userId, client);
    this.socketIdsToUserIds.set(client.id, userId);
  }

  async handleDisconnect(client: Socket) {
    const userId = this.socketIdsToUserIds.get(client.id);
    if (!userId) return;
    const lobby = this.userIdsToLobby.get(userId)?.removeUserById(userId);

    if (lobby) this.server.to(lobby.id).emit(LobbyEmitEvent.Update, lobby);

    if (lobby?.isEmpty()) {
      this.lobbyService.removeLobby(lobby.id);
    }

    this.userIdsToSockets.delete(userId);
    this.socketIdsToUserIds.delete(client.id);
    this.userIdsToLobby.delete(userId);

  }

  @SubscribeMessage(LobbySubEvent.Join)
  async handleJoin(@ConnectedSocket() client: Socket, @MessageBody(LobbyPipe) { user, lobby }: LobbyPipeDTO) {
    lobby.users.push(user);
    client.join(lobby.id);

    this.userIdsToLobby.get(user.id)?.removeUser(user);
    this.userIdsToLobby.set(user.id, lobby);

    this.server.to(lobby.id).emit(LobbyEmitEvent.Update, lobby);
  }

  @SubscribeMessage(LobbySubEvent.Remove)
  async handleRemove(@MessageBody(LobbyPipe) { user, lobby }: LobbyPipeDTO) {
    if (lobby.removeUser(user).isEmpty()) {
      this.lobbyService.removeLobby(lobby.id);
    }
    this.server.to(lobby.id).emit(LobbyEmitEvent.Update, lobby);
    this.userIdsToSockets.get(user.id)?.leave(lobby.id);
    this.userIdsToLobby.delete(user.id);
  }

  @SubscribeMessage(LobbySubEvent.Start)
  async handleStart(@MessageBody(LobbyPipe) { lobby, game }: LobbyPipeDTO) {
    if (!game) return;
    const startGame = await this.gameService.getGameUpdate(game.id)
    this.server.to(lobby.id).emit(LobbyEmitEvent.Start, startGame);

    this.gameService.startGame(game, {
      startGameEvent: async () => {
        const gameUpdate = await this.gameService.getGameUpdate(game.id)
        this.server.to(lobby.id).emit(GameEmitEvent.StartGame, gameUpdate)
      },
      endGameEvent: async () => {
        const gameUpdate = await this.gameService.getGameUpdate(game.id)
        this.server.to(lobby.id).emit(GameEmitEvent.EndGame, gameUpdate)
      },
      waitRoundEvent: async () => {
        const gameUpdate = await this.gameService.getGameUpdate(game.id)
        this.server.to(lobby.id).emit(GameEmitEvent.WaitRound, gameUpdate)
      },
      playRoundEvent: async () => {
        const gameUpdate = await this.gameService.getGameUpdate(game.id)
        this.server.to(lobby.id).emit(GameEmitEvent.PlayRound, gameUpdate)
      },
    })
  }
}
