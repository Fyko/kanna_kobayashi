const Command = require('../engine/commandClass');
const embed = require('../util/embeds');

module.exports = class ForEver extends Command
{
  constructor(client)
  {
    super(client,
    {
      alias: ['pasta'],
      category: 'gen4',
      name: 'yummy',
      enabled: true
    });
  }

  async run(client, message, pinku)
  {
    let image = require('../util/links.json').memes.yummy;

    await message.channel.send({embed : embed.meme(image, pinku, message)});
  }
}