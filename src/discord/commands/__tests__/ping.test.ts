import pingCommand from '../ping';

test('ping command', () => {
  const mockInteraction = {
    reply: jest.fn(),
  };
  // @ts-ignore Solution for lack of discord.js mock.
  pingCommand.execute(mockInteraction);
  expect(mockInteraction.reply).toBeCalled();
});
