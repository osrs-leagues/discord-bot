enum Channel {
  /**
   * #bot-commands
   */
  BotCommands = '769283619595485224',
  /**
   * #bot-commands-test
   */
  BotCommandsTest = '636193036195463178',
  /**
   * #bot-commands in Bot Testing Server
   */
  BotCommandsServer = '931963036896464946',
  /**
   * #challenge-approval-test
   */
  BotCommandsSageApproval = '1287884980386529300',
  /**
   * #staff-admin
   */
  StaffAdmin = '931930206225178724',
  /**
   * #staff-casual
   */
  StaffCasual = '763899863280648252',

  /**
   * #challenge-approval
   */
  SageChallengeApproval = '1292966146894467177',

  /**
   * #challenge-commands
   */
  SageChallengeCommands = '1292966070507929621',

  /**
   * #challenge-info
   */
  SageChallengeInfo = '1292965662569922571',
}

export const channelGroups = {
  ALL: [
    Channel.BotCommands,
    Channel.BotCommandsServer,
    Channel.BotCommandsTest,
    Channel.StaffAdmin,
    Channel.StaffCasual,
  ],
  BOT_COMMANDS: [
    Channel.BotCommands,
    Channel.BotCommandsServer,
    Channel.BotCommandsTest,
  ],
  STAFF: [
    Channel.StaffAdmin,
    Channel.StaffCasual,
    Channel.BotCommandsServer,
    Channel.BotCommandsTest,
  ],
  TESTING: [Channel.BotCommandsServer, Channel.BotCommandsTest],
  SAGE_CHALLENGE_APPROVAL: [
    Channel.BotCommandsSageApproval,
    Channel.SageChallengeApproval,
  ],
  SAGE_CHALLENGE: [
    Channel.BotCommandsTest,
    Channel.BotCommandsServer,
    Channel.SageChallengeCommands,
  ],
  SAGE_CHALLENGE_RAFFLE: [Channel.BotCommandsServer, Channel.SageChallengeInfo],
};

export default Channel;
