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
   * #staff-admin
   */
  StaffAdmin = '931930206225178724',
  /**
   * #staff-casual
   */
  StaffCasual = '763899863280648252',
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
};

export default Channel;
