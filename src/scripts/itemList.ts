import { IItemStructure } from '../types/IItemStructure';
import { ItemRarities } from '../types/ItemRarities';
import { Items } from '../types/Items';
import { ItemTypes } from '../types/ItemTypes';

const ITEMS: IItemStructure[] = [
	/**
	 * Bug
	 * Use: None, just a dummy item for selling.
	 */
	{
		buyable: false,
		description: 'This is a bug... And... It looks tasty!',
		name: Items.BUG,
		price: 12,
		rarity: ItemRarities.COMMON,
		tradable: true,
		type: ItemTypes.ITEM,
		unique: false,
	},
	/**
	 * Bug Net
	 * Use: Unique command, can break.
	 */
	{
		buyable: true,
		description: 'Go out to catch bugs with this net!',
		name: Items.BUG_NET,
		price: 5,
		rarity: ItemRarities.HARMONY,
		tradable: true,
		type: ItemTypes.ITEM,
		unique: true,
	},

	/**
	 * Dragon Scale
	 * Use: Currency for buying items above it's rarity
	 */
	{
		buyable: true,
		description: 'This is the scale of a Dragon, worth more than you can imagine, take care of this precious item.',
		name: Items.DRAGON_SCALE,
		price: 2000,
		rarity: ItemRarities.DRAGON_SCALE,
		tradable: true,
		type: ItemTypes.ITEM,
		unique: false,
	},
];
export { ITEMS };

const BADGES: IItemStructure[] = [
	/**
	 * Developer
	 * How to get: Be a lead developer of Kanna
	 */
	{
		buyable: false,
		description: 'If you have this badge, it means you are one of my developers!',
		name: Items.DEVELOPER,
		price: null,
		rarity: ItemRarities['?'],
		tradable: false,
		type: ItemTypes.BADGE,
		unique: true,
	},

	/**
	 * Milionaire
	 */
	{
		buyable: true,
		description: 'Having this means you are a milionaire!',
		name: Items.MILIONAIRE,
		price: 1000000,
		rarity: ItemRarities.CHAOS,
		tradable: false,
		type: ItemTypes.BADGE,
		unique: true,
	},

	/**
	 * Staff
	 * How to get: Be a staff?
	 */
	{
		buyable: false,
		description: 'You are awesome for having this... You help me to grow!',
		name: Items.STAFF,
		price: null,
		rarity: ItemRarities['?'],
		tradable: false,
		type: ItemTypes.BADGE,
		unique: true,
	},

	/**
	 * Partner
	 * How to get: Partner with the official server/bot
	 */
	{
		buyable: false,
		description: 'Wow... You are one of my partners if you have this!',
		name: Items.PARTNER,
		price: null,
		rarity: ItemRarities['?'],
		tradable: false,
		type: ItemTypes.BADGE,
		unique: true,
	},

	/**
	 * Patron
	 * How to get: Donating on Patreon
	 */
	{
		buyable: false,
		description: 'T-thanks for supporting me on Patreon!',
		name: Items.PATRON,
		price: null,
		rarity: ItemRarities.IMMORTAL,
		tradable: false,
		type: ItemTypes.BADGE,
		unique: true,
	},
];
export { BADGES };
