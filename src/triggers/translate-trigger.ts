import { Message } from 'discord.js';

import { Trigger } from './trigger.js';
import { EventData } from '../models/internal-models.js';
import { MessageUtils, PermissionUtils } from '../utils/index.js';
import { parseNames, translateList } from '../utils/translate-utils.js';

export class TranslateTrigger implements Trigger {
  public requireGuild = true;

  constructor() {}

  public triggered(msg: Message): boolean {
    // Check prerequisite permissions needed for execute
    if (!PermissionUtils.canSend(msg.channel, false)) {
      return false;
    }

    let input = msg.content;
    let characterNameResults = parseNames(input);

    return characterNameResults.length > 0;
  }

  public async execute(msg: Message, _data: EventData): Promise<void> {
    let input = msg.content;
    let characterNameResults = parseNames(input);

    if (characterNameResults.length > 0) {
      let translationMessage = translateList(characterNameResults);
      await MessageUtils.send(msg.channel, translationMessage);
    }
  }
}
