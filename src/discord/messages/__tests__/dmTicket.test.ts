import { Collection, MessageAttachment, User } from 'discord.js';
import {
  getDMTicketInfoMessage,
  getDMForwardMessage,
  getDMResponseMessage,
} from '../dmTicket';

const mockUser = {
  id: '123456789',
  tag: 'TestUser#1234',
  username: 'TestUser',
  createdTimestamp: 1600000000000,
  displayAvatarURL: () => 'https://cdn.discordapp.com/avatars/123/abc.png',
} as unknown as User;

describe('getDMTicketInfoMessage', () => {
  test('should create an embed with user info', () => {
    const embed = getDMTicketInfoMessage({ user: mockUser });

    expect(embed.title).toBe('Appeal Ticket — TestUser#1234');
    expect(embed.description).toContain('<@123456789>');
    expect(embed.description).toContain('123456789');
    expect(embed.color).toBe(0xe67e22);
  });

  test('should include account creation timestamp', () => {
    const embed = getDMTicketInfoMessage({ user: mockUser });
    const expectedTimestamp = Math.floor(1600000000000 / 1000);

    expect(embed.description).toContain(`<t:${expectedTimestamp}:R>`);
  });
});

describe('getDMForwardMessage', () => {
  test('should create an embed with message content', () => {
    const embed = getDMForwardMessage({
      user: mockUser,
      content: 'I would like to appeal my ban.',
    });

    expect(embed.description).toBe('I would like to appeal my ban.');
    expect(embed.author.name).toBe('TestUser#1234');
    expect(embed.color).toBe(0x3498db);
  });

  test('should show placeholder for empty content', () => {
    const embed = getDMForwardMessage({
      user: mockUser,
      content: '',
    });

    expect(embed.description).toBe('*No text content*');
  });

  test('should handle attachments with images', () => {
    const attachments = new Collection<string, MessageAttachment>();
    attachments.set('1', {
      url: 'https://example.com/screenshot.png',
      name: 'screenshot.png',
    } as unknown as MessageAttachment);

    const embed = getDMForwardMessage({
      user: mockUser,
      content: 'See attached.',
      attachments,
    });

    expect(embed.image.url).toBe('https://example.com/screenshot.png');
    expect(embed.fields).toHaveLength(1);
    expect(embed.fields[0].name).toBe('Attachments');
    expect(embed.fields[0].value).toContain('screenshot.png');
  });

  test('should handle non-image attachments without setting image', () => {
    const attachments = new Collection<string, MessageAttachment>();
    attachments.set('1', {
      url: 'https://example.com/file.txt',
      name: 'file.txt',
    } as unknown as MessageAttachment);

    const embed = getDMForwardMessage({
      user: mockUser,
      content: 'See attached.',
      attachments,
    });

    expect(embed.image).toBeNull();
    expect(embed.fields).toHaveLength(1);
    expect(embed.fields[0].value).toContain('file.txt');
  });

  test('should handle multiple attachments', () => {
    const attachments = new Collection<string, MessageAttachment>();
    attachments.set('1', {
      url: 'https://example.com/photo.jpg',
      name: 'photo.jpg',
    } as unknown as MessageAttachment);
    attachments.set('2', {
      url: 'https://example.com/log.txt',
      name: 'log.txt',
    } as unknown as MessageAttachment);

    const embed = getDMForwardMessage({
      user: mockUser,
      content: 'Evidence',
      attachments,
    });

    expect(embed.image.url).toBe('https://example.com/photo.jpg');
    expect(embed.fields[0].value).toContain('photo.jpg');
    expect(embed.fields[0].value).toContain('log.txt');
  });

  test('should not add attachments field when none provided', () => {
    const embed = getDMForwardMessage({
      user: mockUser,
      content: 'Hello',
    });

    expect(embed.fields).toHaveLength(0);
  });
});

describe('getDMResponseMessage', () => {
  test('should create an embed with admin response', () => {
    const embed = getDMResponseMessage({
      adminTag: 'Admin#0001',
      content: 'Your appeal is being reviewed.',
    });

    expect(embed.title).toBe('Staff Response');
    expect(embed.description).toBe('Your appeal is being reviewed.');
    expect(embed.footer.text).toBe('From: Admin#0001');
    expect(embed.color).toBe(0x2ecc71);
  });
});
