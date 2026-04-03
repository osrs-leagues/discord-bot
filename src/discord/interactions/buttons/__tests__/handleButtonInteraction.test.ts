import { handleButtonInteraction } from '../index';
import Role from '../../../Role';
import { Collection } from 'discord.js';

// Mock all button handlers to isolate handleButtonInteraction logic
// Note: jest.mock is hoisted above imports, so we use require() for Role
jest.mock('../challengeRerollButton', () => ({
  default: {
    buttons: ['reroll'],
    onButtonInteraction: jest.fn().mockResolvedValue(undefined),
  },
  __esModule: true,
}));

jest.mock('../closeTicketButton', () => {
  const { default: R } = require('../../../Role');
  return {
    default: {
      buttons: ['close_ticket', 'reopen_ticket'],
      roles: [R.Administrator, R.Moderator, R.Tester],
      onButtonInteraction: jest.fn().mockResolvedValue(undefined),
    },
    __esModule: true,
  };
});

jest.mock('../blockUserButton', () => {
  const { default: R } = require('../../../Role');
  return {
    default: {
      buttons: ['block_user', 'unblock_user'],
      roles: [R.Administrator, R.Moderator, R.Tester],
      onButtonInteraction: jest.fn().mockResolvedValue(undefined),
    },
    __esModule: true,
  };
});

import challengeRerollButton from '../challengeRerollButton';
import closeTicketButton from '../closeTicketButton';
import blockUserButton from '../blockUserButton';

const createMockInteraction = (
  customId: string,
  roles?: Collection<string, any> | string[],
) => ({
  customId,
  member: {
    roles: roles ?? new Collection(),
  },
  reply: jest.fn().mockResolvedValue(undefined),
});

const flushPromises = () => new Promise((resolve) => setImmediate(resolve));

describe('handleButtonInteraction', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should return early if customId is empty', async () => {
    const interaction = createMockInteraction('');
    await handleButtonInteraction(interaction as any);
    expect(challengeRerollButton.onButtonInteraction).not.toHaveBeenCalled();
    expect(closeTicketButton.onButtonInteraction).not.toHaveBeenCalled();
    expect(blockUserButton.onButtonInteraction).not.toHaveBeenCalled();
  });

  test('should route to the correct button handler by customId prefix', async () => {
    const interaction = createMockInteraction('reroll some_data');
    handleButtonInteraction(interaction as any);
    await flushPromises();
    expect(challengeRerollButton.onButtonInteraction).toHaveBeenCalledWith(
      interaction,
    );
    expect(closeTicketButton.onButtonInteraction).not.toHaveBeenCalled();
    expect(blockUserButton.onButtonInteraction).not.toHaveBeenCalled();
  });

  test('should not call any handler for unknown customId', async () => {
    const interaction = createMockInteraction('unknown_button');
    handleButtonInteraction(interaction as any);
    await flushPromises();
    expect(challengeRerollButton.onButtonInteraction).not.toHaveBeenCalled();
    expect(closeTicketButton.onButtonInteraction).not.toHaveBeenCalled();
    expect(blockUserButton.onButtonInteraction).not.toHaveBeenCalled();
  });

  test('should deny access when user lacks required role (GuildMemberRoleManager)', async () => {
    const roles = new Collection<string, any>();
    roles.set('some_other_role', { id: 'some_other_role' });

    const interaction = createMockInteraction('close_ticket 123', {
      cache: roles,
    } as any);

    handleButtonInteraction(interaction as any);
    await flushPromises();
    expect(interaction.reply).toHaveBeenCalledWith({
      content: 'You do not have permission to perform this action.',
      ephemeral: true,
    });
    expect(closeTicketButton.onButtonInteraction).not.toHaveBeenCalled();
  });

  test('should allow access when user has required role (GuildMemberRoleManager)', async () => {
    const roles = new Collection<string, any>();
    roles.set(Role.Administrator, { id: Role.Administrator });

    const interaction = createMockInteraction('close_ticket 123', {
      cache: roles,
    } as any);

    handleButtonInteraction(interaction as any);
    await flushPromises();
    expect(interaction.reply).not.toHaveBeenCalled();
    expect(closeTicketButton.onButtonInteraction).toHaveBeenCalledWith(
      interaction,
    );
  });

  test('should deny access when user lacks required role (string array)', async () => {
    const interaction = createMockInteraction('block_user 123', [
      'some_other_role',
    ]);

    handleButtonInteraction(interaction as any);
    await flushPromises();
    expect(interaction.reply).toHaveBeenCalledWith({
      content: 'You do not have permission to perform this action.',
      ephemeral: true,
    });
    expect(blockUserButton.onButtonInteraction).not.toHaveBeenCalled();
  });

  test('should allow access when user has required role (string array)', async () => {
    const interaction = createMockInteraction('block_user 123', [
      Role.Moderator,
    ]);

    handleButtonInteraction(interaction as any);
    await flushPromises();
    expect(interaction.reply).not.toHaveBeenCalled();
    expect(blockUserButton.onButtonInteraction).toHaveBeenCalledWith(
      interaction,
    );
  });

  test('should skip role guard for buttons without roles defined', async () => {
    const interaction = createMockInteraction('reroll some_data');
    handleButtonInteraction(interaction as any);
    await flushPromises();
    expect(interaction.reply).not.toHaveBeenCalled();
    expect(challengeRerollButton.onButtonInteraction).toHaveBeenCalledWith(
      interaction,
    );
  });
});
