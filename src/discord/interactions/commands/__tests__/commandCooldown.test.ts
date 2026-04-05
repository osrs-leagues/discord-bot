import { SlashCommandBuilder } from '@discordjs/builders';

jest.mock('puppeteer', () => ({}));
jest.mock('axios', () => ({ default: { get: jest.fn() } }));

import { handleCommandInteraction, commands } from '../index';
import { Command } from '../types';

const createMockInteraction = (
  commandName: string,
  channelId = 'channel_123',
  userId = 'user_123',
) => ({
  isCommand: () => true,
  commandName,
  channel: { id: channelId },
  user: { id: userId },
  member: { roles: { cache: { has: () => true } } },
  reply: jest.fn(),
  deferReply: jest.fn(),
  editReply: jest.fn(),
});

describe('command cooldown', () => {
  const COOLDOWN_COMMAND_NAME = 'test_cooldown_cmd';
  const EXEMPT_CHANNEL = 'exempt_channel_123';

  beforeAll(() => {
    const cooldownCommand: Command = {
      cooldown: {
        duration: 5 * 60 * 1000,
        exemptChannels: [EXEMPT_CHANNEL],
      },
      data: new SlashCommandBuilder()
        .setName(COOLDOWN_COMMAND_NAME)
        .setDescription('Test command with cooldown'),
      execute: jest.fn(async (interaction) => {
        interaction.reply('success');
      }),
    };
    commands.set(COOLDOWN_COMMAND_NAME, cooldownCommand);
  });

  afterAll(() => {
    commands.delete(COOLDOWN_COMMAND_NAME);
  });

  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('should allow first use of a cooldown command', async () => {
    const interaction = createMockInteraction(
      COOLDOWN_COMMAND_NAME,
      'some_channel',
      'cooldown_user_1',
    );
    // @ts-ignore
    await handleCommandInteraction(interaction);

    const command = commands.get(COOLDOWN_COMMAND_NAME);
    expect(command.execute).toHaveBeenCalled();
  });

  test('should reject second use within cooldown period', async () => {
    const userId = 'cooldown_user_2';
    const interaction1 = createMockInteraction(
      COOLDOWN_COMMAND_NAME,
      'some_channel',
      userId,
    );
    // @ts-ignore
    await handleCommandInteraction(interaction1);

    const interaction2 = createMockInteraction(
      COOLDOWN_COMMAND_NAME,
      'some_channel',
      userId,
    );
    // @ts-ignore
    await handleCommandInteraction(interaction2);

    expect(interaction2.reply).toHaveBeenCalledWith({
      content: expect.stringContaining('Please wait'),
      ephemeral: true,
    });
  });

  test('should show minutes when remaining time >= 60 seconds', async () => {
    const userId = 'cooldown_user_3';
    const interaction1 = createMockInteraction(
      COOLDOWN_COMMAND_NAME,
      'some_channel',
      userId,
    );
    // @ts-ignore
    await handleCommandInteraction(interaction1);

    jest.advanceTimersByTime(5000);

    const interaction2 = createMockInteraction(
      COOLDOWN_COMMAND_NAME,
      'some_channel',
      userId,
    );
    // @ts-ignore
    await handleCommandInteraction(interaction2);

    expect(interaction2.reply).toHaveBeenCalledWith({
      content: expect.stringContaining('minutes'),
      ephemeral: true,
    });
  });

  test('should show seconds when remaining time < 60 seconds', async () => {
    const userId = 'cooldown_user_4';
    const interaction1 = createMockInteraction(
      COOLDOWN_COMMAND_NAME,
      'some_channel',
      userId,
    );
    // @ts-ignore
    await handleCommandInteraction(interaction1);

    jest.advanceTimersByTime(4 * 60 * 1000 + 15 * 1000);

    const interaction2 = createMockInteraction(
      COOLDOWN_COMMAND_NAME,
      'some_channel',
      userId,
    );
    // @ts-ignore
    await handleCommandInteraction(interaction2);

    expect(interaction2.reply).toHaveBeenCalledWith({
      content: expect.stringContaining('seconds'),
      ephemeral: true,
    });
  });

  test('should allow use after cooldown expires', async () => {
    const userId = 'cooldown_user_5';
    const interaction1 = createMockInteraction(
      COOLDOWN_COMMAND_NAME,
      'some_channel',
      userId,
    );
    // @ts-ignore
    await handleCommandInteraction(interaction1);

    jest.advanceTimersByTime(5 * 60 * 1000 + 1000);

    const command = commands.get(COOLDOWN_COMMAND_NAME);
    (command.execute as jest.Mock).mockClear();

    const interaction2 = createMockInteraction(
      COOLDOWN_COMMAND_NAME,
      'some_channel',
      userId,
    );
    // @ts-ignore
    await handleCommandInteraction(interaction2);

    expect(command.execute).toHaveBeenCalled();
  });

  test('should bypass cooldown in exempt channels', async () => {
    const userId = 'cooldown_user_6';
    const interaction1 = createMockInteraction(
      COOLDOWN_COMMAND_NAME,
      EXEMPT_CHANNEL,
      userId,
    );
    // @ts-ignore
    await handleCommandInteraction(interaction1);

    const command = commands.get(COOLDOWN_COMMAND_NAME);
    (command.execute as jest.Mock).mockClear();

    const interaction2 = createMockInteraction(
      COOLDOWN_COMMAND_NAME,
      EXEMPT_CHANNEL,
      userId,
    );
    // @ts-ignore
    await handleCommandInteraction(interaction2);

    expect(command.execute).toHaveBeenCalled();
  });

  test('should track cooldowns independently per user', async () => {
    const interaction1 = createMockInteraction(
      COOLDOWN_COMMAND_NAME,
      'some_channel',
      'cooldown_user_7a',
    );
    // @ts-ignore
    await handleCommandInteraction(interaction1);

    const command = commands.get(COOLDOWN_COMMAND_NAME);
    (command.execute as jest.Mock).mockClear();

    const interaction2 = createMockInteraction(
      COOLDOWN_COMMAND_NAME,
      'some_channel',
      'cooldown_user_7b',
    );
    // @ts-ignore
    await handleCommandInteraction(interaction2);

    expect(command.execute).toHaveBeenCalled();
  });
});
