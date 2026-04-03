import blockDMUser from '../blockDMUser';
import DMTicket from '../../../database/models/DMTicket';

describe('blockDMUser', () => {
  const testUserId = 'block_test_user';

  beforeAll(async () => {
    await DMTicket.create({
      user_id: testUserId,
      thread_id: 'thread_block_test',
    });
  });

  afterAll(async () => {
    await DMTicket.destroy({ where: { user_id: testUserId } });
  });

  test('should block a user', async () => {
    const result = await blockDMUser({
      userId: testUserId,
      isBlocked: true,
      blockedBy: 'admin_123',
      reason: 'test block',
    });

    expect(result).toBe(true);

    const ticket = await DMTicket.findByPk(testUserId);
    expect(ticket.is_blocked).toBe(true);
    expect(ticket.blocked_by).toBe('admin_123');
    expect(ticket.block_reason).toBe('test block');
  });

  test('should block a user without a reason', async () => {
    const result = await blockDMUser({
      userId: testUserId,
      isBlocked: true,
      blockedBy: 'admin_456',
    });

    expect(result).toBe(true);

    const ticket = await DMTicket.findByPk(testUserId);
    expect(ticket.is_blocked).toBe(true);
    expect(ticket.blocked_by).toBe('admin_456');
    expect(ticket.block_reason).toBeNull();
  });

  test('should be idempotent when blocking an already blocked user', async () => {
    // Block first
    await blockDMUser({
      userId: testUserId,
      isBlocked: true,
      blockedBy: 'admin_123',
      reason: 'first block',
    });

    // Block again with different admin
    const result = await blockDMUser({
      userId: testUserId,
      isBlocked: true,
      blockedBy: 'admin_789',
      reason: 'second block',
    });

    expect(result).toBe(true);

    const ticket = await DMTicket.findByPk(testUserId);
    expect(ticket.is_blocked).toBe(true);
    expect(ticket.blocked_by).toBe('admin_789');
    expect(ticket.block_reason).toBe('second block');
  });

  test('should unblock a user', async () => {
    const result = await blockDMUser({
      userId: testUserId,
      isBlocked: false,
    });

    expect(result).toBe(true);

    const ticket = await DMTicket.findByPk(testUserId);
    expect(ticket.is_blocked).toBe(false);
    expect(ticket.blocked_by).toBeNull();
    expect(ticket.block_reason).toBeNull();
  });

  test('should clear blocked_by and reason when unblocking', async () => {
    // Block with reason
    await blockDMUser({
      userId: testUserId,
      isBlocked: true,
      blockedBy: 'admin_123',
      reason: 'some reason',
    });

    // Unblock — blockedBy/reason passed should be ignored
    const result = await blockDMUser({
      userId: testUserId,
      isBlocked: false,
      blockedBy: 'should_be_ignored',
      reason: 'should_be_ignored',
    });

    expect(result).toBe(true);

    const ticket = await DMTicket.findByPk(testUserId);
    expect(ticket.is_blocked).toBe(false);
    expect(ticket.blocked_by).toBeNull();
    expect(ticket.block_reason).toBeNull();
  });

  test('should return false for non-existent user', async () => {
    const result = await blockDMUser({
      userId: 'non_existent_user',
      isBlocked: true,
      blockedBy: 'admin_123',
    });

    expect(result).toBe(false);
  });
});
