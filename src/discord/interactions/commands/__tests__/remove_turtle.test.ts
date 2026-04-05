import removeTurtleCommand from '../remove_turtle';
import Turtle from '../../../../database/models/Turtle';
import TurtleCollection from '../../../../database/models/TurtleCollection';

jest.mock('../../../../database/models/Turtle');
jest.mock('../../../../database/models/TurtleCollection');

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
    (Turtle.findOne as jest.Mock).mockResolvedValue(null);

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
      destroy: jest.fn(),
    };
    (Turtle.findOne as jest.Mock).mockResolvedValue(mockTurtle);
    (TurtleCollection.destroy as jest.Mock).mockResolvedValue(2);

    const interaction = createMockInteraction({ uuid: 'abc-123' });

    // @ts-ignore
    await removeTurtleCommand.execute(interaction);

    expect(TurtleCollection.destroy).toHaveBeenCalledWith({
      where: { turtle_id: 1 },
    });
    expect(mockTurtle.destroy).toHaveBeenCalled();
    expect(interaction.editReply).toHaveBeenCalledWith(
      'Turtle `abc-123` ("Shelly") has been removed.',
    );
  });

  test('should handle turtle without a name', async () => {
    const mockTurtle = {
      id: 2,
      name: null as string | null,
      destroy: jest.fn(),
    };
    (Turtle.findOne as jest.Mock).mockResolvedValue(mockTurtle);
    (TurtleCollection.destroy as jest.Mock).mockResolvedValue(0);

    const interaction = createMockInteraction({ uuid: 'def-456' });

    // @ts-ignore
    await removeTurtleCommand.execute(interaction);

    expect(mockTurtle.destroy).toHaveBeenCalled();
    expect(interaction.editReply).toHaveBeenCalledWith(
      'Turtle `def-456` has been removed.',
    );
  });

  test('should handle errors gracefully', async () => {
    (Turtle.findOne as jest.Mock).mockRejectedValue(new Error('DB error'));

    const interaction = createMockInteraction({ uuid: 'abc-123' });

    // @ts-ignore
    await removeTurtleCommand.execute(interaction);

    expect(interaction.editReply).toHaveBeenCalledWith(
      'An error occurred while removing the turtle.',
    );
  });
});
