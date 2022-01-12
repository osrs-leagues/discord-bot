import { pingCommand } from '..';

test('ping command', () => {
  const mockInteraction = {
    reply: jest.fn(),
  };
  pingCommand.execute(mockInteraction);
  expect(mockInteraction.reply).toBeCalled();
});
