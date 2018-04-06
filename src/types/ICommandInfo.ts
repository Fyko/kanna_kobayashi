import { PermissionString } from 'discord.js';

import { PermLevels } from './PermLevels';

export interface ICommandInfo {
	aliases?: string[];
	clientPermissions?: PermissionString[];
	coins?: number | boolean;
	cooldown?: number;
	description: string;
	examples: string[];
	exp?: number;
	guarded?: boolean;
	name: string;
	patreonOnly?: boolean;
	permLevel?: PermLevels;
	usage: string;
}
