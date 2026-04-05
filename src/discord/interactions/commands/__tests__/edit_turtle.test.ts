import editTurtleCommand from '../edit_turtle';
import Turtle from '../../../../database/models/Turtle';
import { TurtleRarity } from '../../../../database/models/Turtle';

jest.mock('../../../../database/models/Turtle', () => {
  const actual = jest.requireActual('../../../../database/models/Turtle');
  return {
    ...actual,
    __esModule: true,
    default: {
      findOne: jest.fn(),
    },
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

describe('edit_turtle', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should be named edit_turtle', () => {
    expect(editTurtleCommand.data.name).toBe('edit_turtle');
  });

  test('should reply with error when no fields are provided', async () => {
    const interaction = createMockInteraction({
      uuid: 'abc-123',
    });

    // @ts-ignore
    await editTurtleCommand.execute(interaction);

    expect(interaction.editReply).toHaveBeenCalledWith(
      'You must provide at least one field to update.',
    );
  });

  test('should reply with error when turtle is not found', async () => {
    (Turtle.findOne as jest.Mock).mockResolvedValue(null);

    const interaction = createMockInteraction({
      uuid: 'abc-123',
      name: 'Shelly',
    });

    // @ts-ignore
    await editTurtleCommand.execute(interaction);

    expect(interaction.editReply).toHaveBeenCalledWith(
      'No turtle found with UUID `abc-123`.',
    );
  });

  test('should reply with error for invalid image URL', async () => {
    const mockTurtle = { save: jest.fn() };
    (Turtle.findOne as jest.Mock).mockResolvedValue(mockTurtle);

    const interaction = createMockInteraction({
      uuid: 'abc-123',
      image_url: 'not-a-url',
    });

    // @ts-ignore
    await editTurtleCommand.execute(interaction);

    expect(interaction.editReply).toHaveBeenCalledWith(
      'Invalid image URL provided.',
    );
    expect(mockTurtle.save).not.toHaveBeenCalled();
  });

  test('should update name and save', async () => {
    const mockTurtle = { name: 'Old', save: jest.fn() };
    (Turtle.findOne as jest.Mock).mockResolvedValue(mockTurtle);

    const interaction = createMockInteraction({
      uuid: 'abc-123',
      name: 'Shelly',
    });

    // @ts-ignore
    await editTurtleCommand.execute(interaction);

    expect(mockTurtle.name).toBe('Shelly');
    expect(mockTurtle.save).toHaveBeenCalled();
    expect(interaction.editReply).toHaveBeenCalledWith(
      expect.stringContaining('name → "Shelly"'),
    );
  });

  test('should update rarity and save', async () => {
    const mockTurtle = {
      rarity: TurtleRarity.COMMON,
      save: jest.fn(),
    };
    (Turtle.findOne as jest.Mock).mockResolvedValue(mockTurtle);

    const interaction = createMockInteraction({
      uuid: 'abc-123',
      rarity: TurtleRarity.RARE,
    });

    // @ts-ignore
    await editTurtleCommand.execute(interaction);

    expect(mockTurtle.rarity).toBe(TurtleRarity.RARE);
    expect(mockTurtle.save).toHaveBeenCalled();
    expect(interaction.editReply).toHaveBeenCalledWith(
      expect.stringContaining('rarity → Rare'),
    );
  });

  test('should update image_url and save', async () => {
    const mockTurtle = {
      image_url: 'https://example.com/old.png',
      save: jest.fn(),
    };
    (Turtle.findOne as jest.Mock).mockResolvedValue(mockTurtle);

    const interaction = createMockInteraction({
      uuid: 'abc-123',
      image_url: 'https://example.com/new.png',
    });

    // @ts-ignore
    await editTurtleCommand.execute(interaction);

    expect(mockTurtle.image_url).toBe('https://example.com/new.png');
    expect(mockTurtle.save).toHaveBeenCalled();
    expect(interaction.editReply).toHaveBeenCalledWith(
      expect.stringContaining('image_url'),
    );
  });

  test('should update multiple fields at once', async () => {
    const mockTurtle = {
      name: 'Old',
      rarity: TurtleRarity.COMMON,
      image_url: 'https://example.com/old.png',
      save: jest.fn(),
    };
    (Turtle.findOne as jest.Mock).mockResolvedValue(mockTurtle);

    const interaction = createMockInteraction({
      uuid: 'abc-123',
      name: 'Shelly',
      rarity: TurtleRarity.ULTRA_RARE,
      image_url: 'https://example.com/new.png',
    });

    // @ts-ignore
    await editTurtleCommand.execute(interaction);

    expect(mockTurtle.name).toBe('Shelly');
    expect(mockTurtle.rarity).toBe(TurtleRarity.ULTRA_RARE);
    expect(mockTurtle.image_url).toBe('https://example.com/new.png');
    expect(mockTurtle.save).toHaveBeenCalledTimes(1);
  });
});
