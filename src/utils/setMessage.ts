import { getRepository } from 'typeorm';
import { Settings } from '../entity/Settings';

export enum MESSAGE_RESULT {
  SUCCESS,
  FAILED,
}

export const setMessage = async function setMessage({
  guildId,
  message,
}: {
  guildId: string;
  message: string,
}): Promise<MESSAGE_RESULT> {
  try {
    const settingsRepository = getRepository(Settings);

    const settings = await settingsRepository.findOne({
      where: { guild: guildId },
    });

    if (settings) {
      settings.message = message;
      await settingsRepository.save(settings);
      return MESSAGE_RESULT.SUCCESS;
    }
    return MESSAGE_RESULT.FAILED;
  } catch (e) {
    console.error(e);
    return MESSAGE_RESULT.FAILED;
  }
};

export default setMessage;
