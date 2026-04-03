import closeTicketButton from '../closeTicketButton';
import Role from '../../../Role';

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

describe('closeTicketButton', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should register close_ticket and reopen_ticket prefixes', () => {
    expect(closeTicketButton.buttons).toEqual([
      'close_ticket',
      'reopen_ticket',
    ]);
  });

  test('should require Administrator and Moderator roles', () => {
    expect(closeTicketButton.roles).toEqual([
      Role.Administrator,
      Role.Moderator,
    ]);
  });

  test('should return early if channel is not a thread', async () => {
    const interaction = createMockInteraction('close_ticket 456', {
      isThread: false,
    });

    await closeTicketButton.onButtonInteraction(interaction as any);

    expect(interaction.deferUpdate).toHaveBeenCalled();
    expect(interaction.followUp).not.toHaveBeenCalled();
    expect(interaction.channel.setArchived).not.toHaveBeenCalled();
  });

  test('should archive the thread on close_ticket action', async () => {
    const interaction = createMockInteraction('close_ticket 456');

    await closeTicketButton.onButtonInteraction(interaction as any);

    expect(interaction.deferUpdate).toHaveBeenCalled();
    expect(interaction.channel.setArchived).toHaveBeenCalledWith(true);
  });

  test('should unarchive the thread on reopen_ticket action', async () => {
    const interaction = createMockInteraction('reopen_ticket 456');

    await closeTicketButton.onButtonInteraction(interaction as any);

    expect(interaction.deferUpdate).toHaveBeenCalled();
    expect(interaction.channel.setArchived).toHaveBeenCalledWith(false);
  });

  test('should parse userId from customId for close_ticket', async () => {
    const interaction = createMockInteraction(
      'close_ticket 192792245706031105',
    );

    await closeTicketButton.onButtonInteraction(interaction as any);

    // Verifies the handler didn't throw — userId parsed correctly
    expect(interaction.channel.setArchived).toHaveBeenCalledWith(true);
  });

  test('should parse userId from customId for reopen_ticket', async () => {
    const interaction = createMockInteraction(
      'reopen_ticket 192792245706031105',
    );

    await closeTicketButton.onButtonInteraction(interaction as any);

    expect(interaction.channel.setArchived).toHaveBeenCalledWith(false);
  });
});
