import { MessageContextMenuCommandInteraction, PermissionsString } from 'discord.js';
import { RateLimiter } from 'discord.js-rate-limiter';

import { Language } from '../../models/enum-helpers/index.js';
import { EventData } from '../../models/internal-models.js';
import { Lang } from '../../services/index.js';
import { InteractionUtils } from '../../utils/index.js';
import { translateNames } from '../../utils/translate-utils.js';
import { Command, CommandDeferType } from '../index.js';

export class TranslateHoyoNames implements Command {
  public names = [Lang.getRef('messageCommands.translateHoyoNames', Language.Default)];
  public cooldown = new RateLimiter(1, 5000);
  public deferType = CommandDeferType.PUBLIC;
  public requireClientPerms: PermissionsString[] = [];

  public async execute(
    intr: MessageContextMenuCommandInteraction,
    _data: EventData
  ): Promise<void> {
    const message = intr.targetMessage;

    await InteractionUtils.send(intr, translateNames(message.content));
  }
}
