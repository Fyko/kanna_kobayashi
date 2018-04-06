import { Message } from 'discord.js';
import { Command } from '../../structures/Command';
import { CommandHandler } from '../../structures/CommandHandler';
import { MessageEmbed } from '../../structures/MessageEmbed';
import { ICommandRunInfo } from '../../types/ICommandRunInfo';

class InfoCommand extends Command {
	public constructor(handler: CommandHandler) {
		super(handler, {
			aliases: ['invite', 'patreon', 'guild', 'ghearts'],
			clientPermissions: ['EMBED_LINKS'],
			description: 'All the useful links you need!',
			examples: ['info'],
			guarded: true,
			name: 'info',
			usage: 'info',
		});
	}

	public run(message: Message, _: string[], { authorModel }: ICommandRunInfo): Promise<Message | Message[]> {
		const embed: MessageEmbed = MessageEmbed.common(message, authorModel)
			.setAuthor(`${this.client.user.username} info`, this.client.user.displayAvatarURL())
			.setDescription('\u200b')
			.addField('Invite', 'https://thedragonproject.network/invite', true)
			.addField('Patreon', 'https://thedragonproject.network/patreon', true)
			.addField('Official Guild', 'https://discord.gg/uBdXdE9', true)
			.addField('Official Website', 'https://thedragonproject.network', true)
			.setThumbnail(message.guild.iconURL());

		return message.channel.send(embed);
	}
}

export { InfoCommand as Command };
