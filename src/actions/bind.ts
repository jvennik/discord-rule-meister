import createGuild from '../utils/createGuild';
import { Settings } from '../entity/Settings';
import { getRepository } from 'typeorm';

export enum BIND_RESULT {
  SUCCESS,
  ALREADY_BOUND,
}

export const bindToChannel = async ({
  guildId,
  channelId,
}: {
  guildId: string;
  channelId: string;
}): Promise<BIND_RESULT> => {
  try {
    const settingsRepository = getRepository(Settings);
    // Create a guild in our database if one does not already exist
    const settings = await createGuild({ guildId });

    if (settings.channel === channelId) {
      return BIND_RESULT.ALREADY_BOUND;
    }

    settings.channel = channelId;
    await settingsRepository.save(settings);
    return BIND_RESULT.SUCCESS;
  } catch (e) {
    throw e;
  }
};
