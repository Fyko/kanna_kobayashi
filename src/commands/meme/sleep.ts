import { CommandHandler } from '../../structures/CommandHandler';
import { ImageEmbedCommand } from '../../structures/ImageEmbedCommand';

class SleepMemeCommand extends ImageEmbedCommand {
	public constructor(handler: CommandHandler) {
		super(handler, {
			aliases: ['bosssleeppls'],
			description: 'It is time to sleep!',
			examples: ['sleep'],
			images: [
				'https://thedragonproject.network/memes/sleep/1.png',
				'https://thedragonproject.network/memes/sleep/2.jpg',
				'https://thedragonproject.network/memes/sleep/3.jpg',
				'https://thedragonproject.network/memes/sleep/4.jpg',
				'https://thedragonproject.network/memes/sleep/5.jpg',
				'https://thedragonproject.network/memes/sleep/6.jpg',
			],
			name: 'sleep',
			usage: 'sleep',
		});
	}
}

export { SleepMemeCommand as Command };
