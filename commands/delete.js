const Command = require('../engine/commandClass');

module.exports = class Delete extends Command
{
  constructor(client)
  {
    super(client,
    {
      alias: ['purge', 'prune'],
      permLevel: 2,
      name: 'delete',
      description: 'Delete up to 100 messages!!',
      category: 'mod',
      usage: 'delete <number>',
      coins: 0,
      exp: 0
    })
  }

  async run(client, message, color, args)
  {
    if(!message.guild.me.hasPermission('MANAGE_MESSAGES')) return message.channel.send(`I don't have permission to delete messages ${message.author}!`);
    if(!message.member.permissions.has('MANAGE_MESSAGES')) return message.channel.send(`You don't have permission to delete messages ${message.author}!`);

    if(!parseInt(args[0])) return message.channel.send(`${message.author} you must provide a number!`);

    if(args[0] == 1 || parseInt(args[0]) > 100) return message.channel.send(`You have to choose a number between 2 and 100 ${message.author}!`);

    let messages = await message.channel.fetchMessages({limit : args[0]});

    await message.delete();

    await message.channel.bulkDelete(messages)
    .catch(e=>
    {
      return message.channel.send(`I couldn't delete some messages, they were too old!`);
    });

    await message.channel.send(`I have deleted **${args[0]}** messages! <:police:331923995278442497>`);
  }
}