import { getRepository } from 'typeorm';
import { Settings } from '../entity/Settings';

export const createGuild = async function createGuild({
  guildId,
}: {
  guildId: string;
}): Promise<Settings> {
  try {
    const settingsRepository = getRepository(Settings);
    let settings = await settingsRepository.findOne({
      where: { guild: guildId },
    });

    if (!settings) {
      settings = new Settings({
        guild: guildId,
      });
      await settingsRepository.save(settings);
    }

    return settings;
  } catch (e) {
    throw e;
  }
};

export default createGuild;
