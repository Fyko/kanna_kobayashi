const Discord = require('discord.js');
const Command = require('../engine/commandClass');
const Guild = require('../engine/Guild');
const table = require('../engine/db/tables');
const settings = require('../util/settings');

module.exports = class Options extends Command
{
  constructor(client)
  {
    super(client,
    {
      alias: ['opt'],
      name: 'options',
      usage: 'options <option> <value>',
      category: 'mod',
      description: 'Change the options for your guild!',
      permLevel: 2
    });
  }

  async run(client, message, pinku, args)
  {

    let guild = message.guild;

    const result = await table.stats('guilds', guild.id);

    if(result.length < 1)
    {
      await table.insert('guilds',
    {
      id: message.guild.id,
      prefix: ["kanna pls ", "<@!?299284740127588353> ", 'k!'],
      levelUpMessages: true,
      modrole: 'Human Tamer'
    });

    let gInfo = await Guild.stats(guild);

    const embed = new Discord.RichEmbed()
    .setColor(pinku)
    .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL)
    .setAuthor(`${guild.name} Options`, guild.iconURL)
    .setDescription('\u200b')
    .setThumbnail(guild.iconURL)
    .addField('ID', gInfo.id, true)
    .addField('Prefix', gInfo.prefix[2], true)
    .addField('Level Up Messages', gInfo.levelUpMessages, true)
    .addField('Mod Role', gInfo.modrole, true);

    await message.channel.send({embed});
    }
    else if(!args[0] && result.length >= 1)
    {
      let gInfo = await Guild.stats(guild);

      const embed = new Discord.RichEmbed()
      .setColor(pinku)
      .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL)
      .setAuthor(`${guild.name} Options`, guild.iconURL)
      .setDescription('\u200b')
      .setThumbnail(guild.iconURL)
      .addField('ID', gInfo.id, true)
      .addField('Prefix', gInfo.prefix[2], true)
      .addField('Level Up Messages', gInfo.levelUpMessages, true)
      .addField('Mod Role', gInfo.modrole, true);


      await message.channel.send({embed});
    }
    else
    {
      let key = args[0];
      let value = args[1];

      let options = settings.table.guilds.options;

      if(!options.includes(key.toLowerCase())) return message.channel.send(`Hey ${message.author}! \n\nYou've input an option that doesn't exist! The available options are\n\n\`${options.join('` | `')}\``);

      if(!value) return message.channel.send(`${message.author} the option **${key}** must have a value!\n\nUsage:\n\`${this.usage}\``);
    }
  }
}