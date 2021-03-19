import { OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { GroupUserAdminDTO, GroupUserDTO } from './group.dto';
import { GroupEmitEvent, GroupSubEvent } from './group.events';
import { GroupService } from './group.service';

@WebSocketGateway()
export class GroupGateway implements OnGatewayDisconnect {
  private userIdsToSockets: Record<string, Socket> = {};
  private socketIdsToUserIds: Record<string, string> = {};

  @WebSocketServer()
  protected server: Server;

  constructor(private groupService: GroupService) {}

  handleDisconnect(client: Socket) {
    const userId = this.socketIdsToUserIds[client.id];
    delete this.userIdsToSockets[userId];
    delete this.socketIdsToUserIds[client.id];
  }

  @SubscribeMessage(GroupSubEvent.Join)
  async handleJoin(client: Socket, groupUser: GroupUserDTO) {
    const { userId, groupId } = groupUser;
    const group = await this.groupService.addUser(groupUser);
    client.join(groupId);
    this.userIdsToSockets[userId] = client;
    this.socketIdsToUserIds[client.id] = userId;
    this.server.to(groupId).emit(GroupEmitEvent.Update, group);
  }

  @SubscribeMessage(GroupSubEvent.Remove)
  async handleRemove(client: Socket, { adminId, ...groupUser }: GroupUserAdminDTO) {
    const { userId, groupId } = groupUser;
    const group = await this.groupService.removeUser(groupUser);
    this.userIdsToSockets[userId].leave(groupId);
    this.server.to(groupId).emit(GroupEmitEvent.Update, group);
  }
}
