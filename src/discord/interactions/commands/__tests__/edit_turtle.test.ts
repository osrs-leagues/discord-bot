import editTurtleCommand from '../edit_turtle';
import { TurtleRarity } from '../../../../database/models/Turtle';
import * as turtles from '../../../../turtles';

jest.mock('../../../../turtles', () => {
  const actual = jest.requireActual('../../../../turtles');
  return {
    ...actual,
    __esModule: true,
    getTurtleByUuid: jest.fn(),
    editTurtle: jest.fn(),
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
    (turtles.getTurtleByUuid as jest.Mock).mockReturnValue(undefined);

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
    (turtles.getTurtleByUuid as jest.Mock).mockReturnValue({ uuid: 'abc-123' });

    const interaction = createMockInteraction({
      uuid: 'abc-123',
      image_url: 'not-a-url',
    });

    // @ts-ignore
    await editTurtleCommand.execute(interaction);

    expect(interaction.editReply).toHaveBeenCalledWith(
      'Invalid image URL provided.',
    );
    expect(turtles.editTurtle).not.toHaveBeenCalled();
  });

  test('should update name and save', async () => {
    (turtles.getTurtleByUuid as jest.Mock).mockReturnValue({ uuid: 'abc-123' });
    (turtles.editTurtle as jest.Mock).mockResolvedValue({});

    const interaction = createMockInteraction({
      uuid: 'abc-123',
      name: 'Shelly',
    });

    // @ts-ignore
    await editTurtleCommand.execute(interaction);

    expect(turtles.editTurtle).toHaveBeenCalledWith('abc-123', {
      name: 'Shelly',
    });
    expect(interaction.editReply).toHaveBeenCalledWith(
      expect.stringContaining('name → "Shelly"'),
    );
  });

  test('should update rarity and save', async () => {
    (turtles.getTurtleByUuid as jest.Mock).mockReturnValue({ uuid: 'abc-123' });
    (turtles.editTurtle as jest.Mock).mockResolvedValue({});

    const interaction = createMockInteraction({
      uuid: 'abc-123',
      rarity: TurtleRarity.RARE,
    });

    // @ts-ignore
    await editTurtleCommand.execute(interaction);

    expect(turtles.editTurtle).toHaveBeenCalledWith('abc-123', {
      rarity: TurtleRarity.RARE,
    });
    expect(interaction.editReply).toHaveBeenCalledWith(
      expect.stringContaining('rarity → Rare'),
    );
  });

  test('should update image_url and save', async () => {
    (turtles.getTurtleByUuid as jest.Mock).mockReturnValue({ uuid: 'abc-123' });
    (turtles.editTurtle as jest.Mock).mockResolvedValue({});

    const interaction = createMockInteraction({
      uuid: 'abc-123',
      image_url: 'https://example.com/new.png',
    });

    // @ts-ignore
    await editTurtleCommand.execute(interaction);

    expect(turtles.editTurtle).toHaveBeenCalledWith('abc-123', {
      image_url: 'https://example.com/new.png',
    });
    expect(interaction.editReply).toHaveBeenCalledWith(
      expect.stringContaining('image_url'),
    );
  });

  test('should update multiple fields at once', async () => {
    (turtles.getTurtleByUuid as jest.Mock).mockReturnValue({ uuid: 'abc-123' });
    (turtles.editTurtle as jest.Mock).mockResolvedValue({});

    const interaction = createMockInteraction({
      uuid: 'abc-123',
      name: 'Shelly',
      rarity: TurtleRarity.ULTRA_RARE,
      image_url: 'https://example.com/new.png',
    });

    // @ts-ignore
    await editTurtleCommand.execute(interaction);

    expect(turtles.editTurtle).toHaveBeenCalledWith('abc-123', {
      name: 'Shelly',
      rarity: TurtleRarity.ULTRA_RARE,
      image_url: 'https://example.com/new.png',
    });
  });
});
