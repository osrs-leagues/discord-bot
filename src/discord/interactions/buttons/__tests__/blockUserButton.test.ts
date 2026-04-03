import blockUserButton from '../blockUserButton';
import Role from '../../../Role';

jest.mock('../../../actions/blockDMUser', () => jest.fn());
jest.mock('../../../index', () => ({
  client: {
    users: {
      fetch: jest.fn().mockResolvedValue({
        send: jest.fn(),
      }),
    },
  },
}));

import blockDMUser from '../../../actions/blockDMUser';

const createMockInteraction = (
  customId: string,
  { isThread = true }: { isThread?: boolean } = {},
) => ({
  customId,
  deferUpdate: jest.fn(),
  followUp: jest.fn(),
  user: { id: 'staff_123' },
  member: null as any,
  channel: {
    isThread: () => isThread,
    setArchived: jest.fn(),
  },
  message: null as any,
});

describe('blockUserButton', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should register block_user and unblock_user prefixes', () => {
    expect(blockUserButton.buttons).toEqual(['block_user', 'unblock_user']);
  });

  test('should require Administrator and Moderator roles', () => {
    expect(blockUserButton.roles).toEqual([Role.Administrator, Role.Moderator]);
  });

  test('should return early if channel is not a thread', async () => {
    const interaction = createMockInteraction('block_user 456', {
      isThread: false,
    });

    await blockUserButton.onButtonInteraction(interaction as any);

    expect(interaction.deferUpdate).toHaveBeenCalled();
    expect(interaction.followUp).not.toHaveBeenCalled();
  });

  test('should block user and archive thread on block_user action', async () => {
    (blockDMUser as jest.Mock).mockResolvedValue(true);
    const interaction = createMockInteraction('block_user 456');

    await blockUserButton.onButtonInteraction(interaction as any);

    expect(blockDMUser).toHaveBeenCalledWith({
      userId: '456',
      isBlocked: true,
      blockedBy: 'staff_123',
    });
    expect(interaction.channel.setArchived).toHaveBeenCalledWith(true);
  });

  test('should follow up with error if block_user fails', async () => {
    (blockDMUser as jest.Mock).mockResolvedValue(false);
    const interaction = createMockInteraction('block_user 456');

    await blockUserButton.onButtonInteraction(interaction as any);

    expect(interaction.followUp).toHaveBeenCalledWith({
      content: 'Failed to block user. Ticket not found.',
      ephemeral: true,
    });
    expect(interaction.channel.setArchived).not.toHaveBeenCalled();
  });

  test('should unblock user and unarchive thread on unblock_user action', async () => {
    (blockDMUser as jest.Mock).mockResolvedValue(true);
    const interaction = createMockInteraction('unblock_user 456');

    await blockUserButton.onButtonInteraction(interaction as any);

    expect(blockDMUser).toHaveBeenCalledWith({
      userId: '456',
      isBlocked: false,
    });
    expect(interaction.channel.setArchived).toHaveBeenCalledWith(false);
  });

  test('should follow up with error if unblock_user fails', async () => {
    (blockDMUser as jest.Mock).mockResolvedValue(false);
    const interaction = createMockInteraction('unblock_user 456');

    await blockUserButton.onButtonInteraction(interaction as any);

    expect(interaction.followUp).toHaveBeenCalledWith({
      content: 'Failed to unblock user. Ticket not found.',
      ephemeral: true,
    });
  });

  test('should parse userId from customId', async () => {
    (blockDMUser as jest.Mock).mockResolvedValue(true);
    const interaction = createMockInteraction('block_user 192792245706031105');

    await blockUserButton.onButtonInteraction(interaction as any);

    expect(blockDMUser).toHaveBeenCalledWith(
      expect.objectContaining({ userId: '192792245706031105' }),
    );
  });
});
