import {
  CacheType,
  Collection,
  GuildMemberRoleManager,
  Interaction,
} from 'discord.js';

import pingCommand from './ping';
import fetchLeagueRanksCommand from './fetch_league_ranks';
import hiscoresCommand from './hiscores';
import leagueNameCommand from './league_name';
import leagueRanksCommand from './league_ranks';
import removeLeagueRolesCommand from './remove_league_roles';
import updateLeaguePointsCommand from './update_league_points';
import updateAllRolesCommand from './update_all_roles';
import updateLeagueUsersCommand from './update_league_users';
import { Command } from './types';
import leagueNameLocal from './leagueNameLocal';
import leagueNameBronze from './leagueNameBronze';
import regionCommand from './regions';
import removeRegionRolesCommand from './remove_region_roles';
import challengeCommand from './challenge';
import raffleDrawCommand from './draw_raffle';
import approveChallengeCommand from './approveChallenge';
import rejectChallengeCommand from './rejectChallenge';
import challengeStatisticsCommand from './challengeStatistics';
import incrementRerollCommand from './incrementReroll';
import deleteChallengeCommand from './deleteChallenge';
import randomRegionsCommand from './randomRegions';
import createChallengeCommand from './createChallenge';
import refreshChallengeCacheCommand from './refreshChallengeCache';
import editChallengeCommand from './editChallenge';
import viewChallengeCommand from './viewChallenge';
import randomRelicsCommand from './randomRelics';
import randomCombatMasteriesCommand from './randomCombatMasteries';
import reverseApprovalCommand from './reverseApproval';
import unblockDmCommand from './unblock_dm';
import addTurtleCommand from './add_turtle';
import editTurtleCommand from './edit_turtle';
import removeTurtleCommand from './remove_turtle';
import turtleCommand from './turtle';
import turtleClogCommand from './turtle_clog';
import turtleStatsCommand from './turtle_stats';
import config from '../../../config';
import leagueNameRemote from './leagueNameRemote';
import { CURRENT_LEAGUE } from '../../../leagues';
//import config from '../../../config';

const commandData = [
  addTurtleCommand,
  approveChallengeCommand,
  challengeCommand,
  challengeStatisticsCommand,
  createChallengeCommand,
  deleteChallengeCommand,
  editTurtleCommand,
  pingCommand,
  fetchLeagueRanksCommand,
  hiscoresCommand,
  incrementRerollCommand,
  leagueNameCommand,
  leagueNameLocal('shattered_relics'),
  leagueNameLocal('trailblazer'),
  leagueNameLocal('twisted'),
  leagueNameLocal('trailblazer_reloaded'),
  leagueNameLocal('raging_echoes'),
  config.current_league_active
    ? leagueNameRemote(CURRENT_LEAGUE)
    : leagueNameBronze(CURRENT_LEAGUE),
  leagueRanksCommand,
  raffleDrawCommand,
  randomCombatMasteriesCommand,
  randomRegionsCommand,
  randomRelicsCommand,
  refreshChallengeCacheCommand,
  regionCommand,
  rejectChallengeCommand,
  removeLeagueRolesCommand,
  removeRegionRolesCommand,
  removeTurtleCommand,
  reverseApprovalCommand,
  editChallengeCommand,
  turtleClogCommand,
  turtleCommand,
  turtleStatsCommand,
  unblockDmCommand,
  updateLeaguePointsCommand,
  updateAllRolesCommand,
  updateLeagueUsersCommand,
  viewChallengeCommand,
];

const commands = new Collection<string, Command>();
commandData.forEach((command) => {
  commands.set(command.data.name, command);
});

/** Map of commandName -> userId -> lastUsedTimestamp */
const cooldowns = new Map<string, Map<string, number>>();

const handleCommandInteraction = async (
  interaction: Interaction<CacheType>,
) => {
  if (!interaction?.isCommand()) return;

  const command = commands.get(interaction.commandName);

  if (!command) return;

  if (
    command.channels?.length > 0 &&
    !command.channels.includes(interaction.channel.id)
  ) {
    return interaction.reply({
      content: 'You cannot use this command in this channel.',
      ephemeral: true,
    });
  }
  if (command.roles?.length > 0) {
    let hasRole = false;
    const memberRoles = interaction.member.roles as GuildMemberRoleManager;
    for (const role of command.roles) {
      if (memberRoles.cache.has(role)) {
        hasRole = true;
        break;
      }
    }
    if (!hasRole) {
      return interaction.reply({
        content: 'You do not have permission to use this command.',
        ephemeral: true,
      });
    }
  }

  if (command.cooldown) {
    const isExempt = command.cooldown.exemptChannels?.includes(
      interaction.channel.id,
    );
    if (!isExempt) {
      if (!cooldowns.has(interaction.commandName)) {
        cooldowns.set(interaction.commandName, new Map());
      }
      const commandCooldowns = cooldowns.get(interaction.commandName);
      const lastUsed = commandCooldowns.get(interaction.user.id);
      const now = Date.now();
      if (lastUsed && now - lastUsed < command.cooldown.duration) {
        const remainingSeconds = Math.ceil(
          (command.cooldown.duration - (now - lastUsed)) / 1000,
        );
        const remainingText =
          remainingSeconds >= 60
            ? `${Math.ceil(remainingSeconds / 60)} minutes`
            : `${remainingSeconds} seconds`;
        return interaction.reply({
          content: `Please wait ${remainingText} before using this command again.`,
          ephemeral: true,
        });
      }
      commandCooldowns.set(interaction.user.id, now);
      setTimeout(
        () => commandCooldowns.delete(interaction.user.id),
        command.cooldown.duration,
      );
    }
  }

  try {
    command.execute(interaction);
  } catch (error) {
    console.error(error);
    if (interaction) {
      return interaction.reply({
        content: 'There was an error while executing this command!',
        ephemeral: true,
      });
    }
  }
};

export { commandData, commands, handleCommandInteraction };
