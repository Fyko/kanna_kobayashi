const { BOOLEAN, col, ENUM, fn, INTEGER, where } = require('sequelize');
const { inspect } = require('util');
const RichEmbed = require('../../structures/RichEmbed');

const { instance: { db } } = require('../../structures/PostgreSQL');
const { parseFlags, titleCase } = require('../../util/Util');
const Command = require('../../structures/Command');
const Item = require('../../models/Item');
const User = require('../../models/User');

class ItemCommand extends Command {
	constructor(handler) {
		super(handler, {
			coins: 0,
			exp: 0,
			name: 'item',
			usage: 'item <Check|Give> <...Query|Target>',
			permLevel: 0,
			description: 'Check an item\'s information or give an item to your on of your friends!'
		});
	}

	run(message, [method, ...args]) {
		if (!method) {
			return message.reply(`you must provide a method! (**\`${this.usage}\`**)`);
		}

		// TODO: Maybe replace this with a `return this[method.toLowerCase()](message, args);`
		// and add aliases via a loop and property descriptors?
		switch (method.toLowerCase()) {
			case 'create':
			case 'make':
			case 'update':
				return this.create(message, args);

			case 'structure':
				return this.structure(message);

			case 'check':
			case 'find':
				return this.find(message, args);

			case 'trade':
			case 'give':
				return this.give(message, args);

			default:
				return message.channel.send(`Unknown method \`${method}\`.`);
		}
	}

	async create(message, args) {
		const userModel = message.author.model || await message.author.fetchModel();
		if (userModel.type !== 'DEV') {
			return message.reply('Only developers can make or update items! <:KannaOmfg:315264558279426048>');
		}

		try {
			const modelData = this._buildModel(parseFlags(args.join(' '), true));

			let item = await Item.findOne({ where: { name: modelData.name } });

			if (item) {
				item = await item.update(modelData);
				return message.channel.send([
					`${message.author}, I have sucessfully updated the ${item.type[0] + item.type.slice(1).toLowerCase()}!`
					+ ' Here it is... <:KannaAyy:315270615844126720>',
					'```js',
					'Item {',
					` ${inspect(item.dataValues).slice(1)}`,
					'```'
				]);
			}

			item = await Item.create(modelData);
			return message.channel.send([
				`${message.author}, I have sucessfully created the ${item.type[0] + item.type.slice(1).toLowerCase()}!`
				+ ' Here it is... <:KannaAyy:315270615844126720>',
				'```js',
				'Item {',
				` ${inspect(item.dataValues).slice(1)}`,
				'```'
			]);
		} catch (error) {
			return message.channel.send(error.toString(), { code: true });
		}
	}

	async structure(message) {
		const userModel = message.author.model || await message.author.fetchModel();
		if (userModel.type !== 'DEV') {
			return message.reply('Only developers can see the structure of items! <:KannaOmfg:315264558279426048>');
		}

		const structure = ['Item {'];
		for (const [name, { type }] of Object.entries(Item.prototype.rawAttributes)) {
			structure.push(`\t${name}: ${type instanceof ENUM ? inspect(type.values) : type.constructor.name},`);
		}
		// Remove dangling comma
		structure[structure.length - 1] = `${structure[structure.length - 1].slice(0, -1)} }`;

		return message.channel.send([
			`${message.author}, here the item structure`,
			'```js',
			structure.join('\n'),
			'```'
		]);
	}

	async find(message, args) {
		const item = await Item.findOne({
			include: [{
				as: 'holders',
				joinTableAttributes: ['count'],
				model: User,
				required: false,
				where: { id: message.author.id }
			}],
			where: where(fn('lower', col('name')), args.join(' ').toLowerCase())
		});
		if (!item) return message.channel.send(`${message.author}, could not find an item with that name!`);

		const embed = RichEmbed.common(message)
			.setAuthor(`Information about the ${item.type.toLowerCase()} "${item.name}"`, this.client.displayAvatarURL)
			.setThumbnail(message.guild.iconURL)
			.setDescription(item.description || '\u200b');

		for (let [title, value] of Object.entries(item.dataValues)) {
			// Don't show price for non buyable items
			if ((title === 'price' && value === null)
				// Already in the description of the embed.
				|| title === 'description') continue;

			if (title === 'holders') {
				if (item.holders.length) {
					embed.addField('You own', item.holders[0].UserItem.count);
				}
				continue;
			}

			if (value === true) {
				value = 'Yes';
			} else if (value === false) {
				value = 'No';
			} else {
				value = titleCase(String(value));
			}

			embed.addField(titleCase(title), value, true);
		}

		return message.channel.send(embed);
	}

	async give(message, [target, ...search]) {
		if (!target) return message.channel.send('You have to tell me who you want to give an item or badge.');
		if (!search.length) return message.channel.send('You also have to tell me what item or badge you want to give.');

		const member = await this.handler.resolveMember(message.guild, target, false);
		if (!member) return message.channel.send(`Could not find a non-bot member by ${target}.`);
		if (member.id === message.author.id) {
			return message.channel.send('You can not give an item or badge to yourself.');
		}

		const item = await Item.findOne({ where: where(fn('lower', col('name')), search.join(' ').toLowerCase()) });
		if (!item) {
			return message.channel.send(`Could not find an item or badge with the name \`${search.join(' ')}\``);
		}

		const type = item.type === 'BADGE' ? 'Badge' : 'Item';

		const [sourceItem] = await message.author.model[`get${type}s`]({ where: { id: item.id } });
		if (!sourceItem) return message.channel.send(`You don't have the \`${item.name}\` ${type.toLowerCase()}!`);

		if (!item.tradable) {
			return message.channel.send(`${message.author}, **${item.name}** may not be traded!`);
		}

		const targetModel = member.user.model || await member.user.fetchModel();
		const [targetItem] = await targetModel[`get${type}s`]({ where: { id: item.id } });
		if (targetItem && item.unique) {
			return message.channel.send(
				`**${member.user.tag}** already has the unique \`${item.name}\` ${type.toLowerCase()}!`
			);
		}

		try {
			const promises = [];
			const singular = item.unique || sourceItem.count === 1;
			// Make a transaction to rollback when something fails
			const transaction = await db.transaction();


			// If the source has more than one of this item remove one, otherwise remove the whole item
			if (sourceItem.count > 1) {
				promises.push(sourceItem.setItemCount(sourceItem.count - 1, { transaction }));
			} else {
				promises.push(message.author.model[`remove${type}`](sourceItem, { transaction }));
			}

			// If the target already has that item add one, otherwise add it as whole
			if (targetItem) {
				promises.push(targetItem.setItemCount(targetItem.count + 1, { transaction }));
			} else {
				promises.push(targetModel[`add${type}`](item, { transaction }));
			}

			await Promise.all(promises);
			await transaction.commit();

			return message.channel.send([
				`You successfully transferred${singular ? '' : ' one of'} your `,
				`\`${item.name}\` ${type.toLowerCase()}${singular === 1 ? '' : 's'} to **${member.user.tag}**!`
			]);
		} catch (error) {
			this.handler.logger.error(error);
			return message.channel.send(
				`Something went wrong while transferring your ${type.toLowerCase()}, the transaction has been reverted.`
			);
		}
	}

	/**
	 * Builds a model data object from parsed flags
	 * @param {Collection<string, string>} parsed Parsed flags
	 * @returns {Object} Model data object
	 * @private
	 */
	_buildModel(parsed) {
		const modelData = {};

		for (const [name, data] of parsed) {
			const { type } = Item.prototype.rawAttributes[name] || {};
			// Provided flag is not an attributte of Item
			if (!type) continue;

			if (type instanceof BOOLEAN) {
				if (data.toLowerCase() === 'true') {
					modelData[name] = true;
				} else if (data.toLowerCase() === 'false') {
					modelData[name] = false;
				} else {
					throw new Error(`Supplied "${name}" is not a boolean!`);
				}
			} else if (type instanceof ENUM) {
				for (const value of type.values) {
					// Enums should always be upper case
					if (value === data.toUpperCase()) {
						modelData[name] = value;
						break;
					}
				}

				if (!modelData[name]) {
					throw new Error(`Supplied "${name}" is not a member type of the enum!`);
				}
			} else if (type instanceof INTEGER) {
				const integer = parseInt(data);
				if (isNaN(integer)) {
					throw new Error(`Supplied "${name}" is not an integer!`);
				}
				modelData[name] = integer;
			} else {
				modelData[name] = data;
			}
		}

		return modelData;
	}
}

module.exports = ItemCommand;