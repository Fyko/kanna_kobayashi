import { Collection, Message, Snowflake } from 'discord.js';

import { CommandHandler } from '../../structures/CommandHandler';
import { MessageEmbed } from '../../structures/MessageEmbed';
import { WeebCommand } from '../../structures/WeebCommand';
import { ICommandRunInfo } from '../../types/ICommandRunInfo';
import { IWeebResolvedMember } from '../../types/weeb/IWeebResolvedMember';

class PokeCommand extends WeebCommand {
	public constructor(handler: CommandHandler) {
		super(handler, {
			clientPermissions: ['EMBED_LINKS'],
			description: 'G-get someone\'s attention!',
			emoji: '<:KannaAyy:315270615844126720>',
			examples: ['poke kanna', 'poke kanna wizard'],
			name: 'poke',
			type: 'poke',
			usage: 'poke <...User>',
		});
	}

	public async run(
		message: Message,
		[members]: [Collection<Snowflake, IWeebResolvedMember>],
		{ authorModel }: ICommandRunInfo,
	): Promise<Message | Message[]> {
		const embed: MessageEmbed = await this.fetchEmbed(message, authorModel);
		const baseString: string = this.computeBaseString(message, members, {
			action: 'poked',
			dev: `Notice him **${members.first().name}**!`,
			trusted: `_stares at **${members.first().name}**`,
			bot: `W-what did i do this time **${message.member.displayName}**!`
		});

		return message.channel.send(baseString, embed);
	}
}

export { PokeCommand as Command };
