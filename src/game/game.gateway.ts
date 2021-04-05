import { MessageBody, SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { GameUserScoreDTO } from './game.dto';
import { GameSubEvent } from './game.events';
import { GameService } from './game.service';

@WebSocketGateway()
export class GameGateway {
  constructor(private gameService: GameService) {}

  @SubscribeMessage(GameSubEvent.Score)
  async handleScore(@MessageBody() { user, game, latitude, longitude }: GameUserScoreDTO) {
    return this.gameService.score(game, user, latitude, longitude);
  }
}
