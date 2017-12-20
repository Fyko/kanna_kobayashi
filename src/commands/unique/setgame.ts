import { Message } from 'discord.js';

import { Command } from '../../structures/Command';
import { CommandHandler } from '../../structures/CommandHandler';
import { PermLevels } from '../../types/PermLevels';

class SetGameCommand extends Command {
	public constructor(handler: CommandHandler) {
		super(handler, {
			aliases: ['sg'],
			coins: 0,
			cooldown: 0,
			description: 'Sets the game the bot is currently playing on all shards',
			examples: ['setgame Some cool game'],
			exp: 0,
			name: 'setgame',
			usage: 'setgame [\'stream\'] [...Game]',
			permLevel: PermLevels.DEV,
		});
	}

	public async run(message: Message, args: string[]): Promise<Message | Message[]> {
		if (!args.length) {
			const totalGuilds: number = await this.client.shard.fetchClientValues('guilds.size')
				.then((result: number[]) => result.reduce((acc: number, current: number) => acc + current));

			return this.setGame(`k!help | on ${totalGuilds} guilds`);
		}

		let stream: string = '';
		if (args[0].toLowerCase() === 'stream') {
			args = args.slice(1);
			stream = ', \'https://twitch.tv/wizzardlink\'';
		}

		return this.setGame(args.join(' '), stream);
	}

	// tslint:disable-next-line:no-any
	private setGame(game: string, stream?: string): Promise<any[]> {
		return this.client.shard.broadcastEval(`this.user.setGame(\`${game} [\${this.shard.id}]\`${stream || ''});`);
	}
}

export { SetGameCommand as Command };