const Discord = require('discord.js');
const Command = require('../../cogs/commands/framework');
const fetchMember = require('../../util/fetch/member');
const permCheck = require('../../util/client/check_perm');
const error = require('../../util/client/error/stack');

module.exports = class Ban extends Command
{ constructor()
  {	super(
	{ alias: ['banne'],
      name: 'ban',
      usage: 'ban <user>',
      permLevel: 2,
      exp: 0,
      coins: 0,
      enabled: true	});	}

  async run(message, color, args)
  {	if(!message.guild.me.permissions.has('BAN_MEMBERS')) return await message.channel.send(`I don't have permission to ban members ${message.author}!`);
    if(!message.member.permissions.has('BAN_MEMBERS')) return await message.channel.send(`You don't have permission to ban anyone ${message.author}!`);
    if(!args[0]) return message.channel.send(`${message.author}... You must specify a user so i can ban him <:omfg:315264558279426048>`);

    let member = await fetchMember(message, args);
    let userPerm = permCheck(member, message);
	console.log(userPerm);
	console.log(member.displayName);

    if(userPerm >= 2) return message.channel.send(`I can't ban this member ${message.author}`);

    if(!member.bannable) return message.channel.send(`I can't ban this member ${message.author}`);

    member.ban(2)
    .catch(e =>
    {	return error(e, message, this); });
    await message.channel.send(`**${member.user.tag}** was sucessfully banned!`);	}	}