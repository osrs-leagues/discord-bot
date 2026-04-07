import removeTurtleCommand from '../remove_turtle';
import * as turtles from '../../../../turtles';

jest.mock('../../../../turtles', () => {
  const actual = jest.requireActual('../../../../turtles');
  return {
    ...actual,
    __esModule: true,
    removeTurtle: jest.fn(),
  };
});

const createMockInteraction = (options: Record<string, string | null>) => ({
  deferReply: jest.fn(),
  editReply: jest.fn(),
  options: {
    getString: jest.fn((name: string) => options[name] ?? null),
  },
  user: { id: 'user_123' },
});

describe('remove_turtle', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should be named remove_turtle', () => {
    expect(removeTurtleCommand.data.name).toBe('remove_turtle');
  });

  test('should reply with error when turtle is not found', async () => {
    (turtles.removeTurtle as jest.Mock).mockResolvedValue(undefined);

    const interaction = createMockInteraction({ uuid: 'abc-123' });

    // @ts-ignore
    await removeTurtleCommand.execute(interaction);

    expect(interaction.editReply).toHaveBeenCalledWith(
      'No turtle found with UUID `abc-123`.',
    );
  });

  test('should destroy collection entries and turtle', async () => {
    const mockTurtle = {
      id: 1,
      name: 'Shelly',
    };
    (turtles.removeTurtle as jest.Mock).mockResolvedValue(mockTurtle);

    const interaction = createMockInteraction({ uuid: 'abc-123' });

    // @ts-ignore
    await removeTurtleCommand.execute(interaction);

    expect(turtles.removeTurtle).toHaveBeenCalledWith('abc-123');
    expect(interaction.editReply).toHaveBeenCalledWith(
      'Turtle `abc-123` ("Shelly") has been removed.',
    );
  });

  test('should handle turtle without a name', async () => {
    const mockTurtle = {
      id: 2,
      name: null as string | null,
    };
    (turtles.removeTurtle as jest.Mock).mockResolvedValue(mockTurtle);

    const interaction = createMockInteraction({ uuid: 'def-456' });

    // @ts-ignore
    await removeTurtleCommand.execute(interaction);

    expect(interaction.editReply).toHaveBeenCalledWith(
      'Turtle `def-456` has been removed.',
    );
  });

  test('should handle errors gracefully', async () => {
    (turtles.removeTurtle as jest.Mock).mockRejectedValue(
      new Error('DB error'),
    );

    const interaction = createMockInteraction({ uuid: 'abc-123' });

    // @ts-ignore
    await removeTurtleCommand.execute(interaction);

    expect(interaction.editReply).toHaveBeenCalledWith(
      'An error occurred while removing the turtle.',
    );
  });
});
