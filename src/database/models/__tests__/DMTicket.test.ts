import DMTicket from '../DMTicket';

describe('DMTicket', () => {
  test('should create a DM ticket', async () => {
    const ticket = await DMTicket.create({
      user_id: '9999',
      thread_id: 'thread_123',
    });
    expect(ticket.user_id).toBe('9999');
    expect(ticket.thread_id).toBe('thread_123');
    expect(ticket.is_blocked).toBe(false);
    expect(ticket.blocked_by).toBeFalsy();
    expect(ticket.block_reason).toBeFalsy();
  });

  test('should find a DM ticket by user_id', async () => {
    const ticket = await DMTicket.findByPk('9999');
    expect(ticket).not.toBeNull();
    expect(ticket.thread_id).toBe('thread_123');
  });

  test('should find a DM ticket by thread_id', async () => {
    const ticket = await DMTicket.findOne({
      where: { thread_id: 'thread_123' },
    });
    expect(ticket).not.toBeNull();
    expect(ticket.user_id).toBe('9999');
  });

  test('should enforce unique user_id', async () => {
    await expect(
      DMTicket.create({
        user_id: '9999',
        thread_id: 'thread_different',
      }),
    ).rejects.toThrow();
  });

  test('should update block status', async () => {
    const ticket = await DMTicket.findByPk('9999');
    await ticket.update({
      is_blocked: true,
      blocked_by: 'admin_1',
      block_reason: 'spam',
    });

    const updated = await DMTicket.findByPk('9999');
    expect(updated.is_blocked).toBe(true);
    expect(updated.blocked_by).toBe('admin_1');
    expect(updated.block_reason).toBe('spam');
  });

  test('should unblock a user', async () => {
    const ticket = await DMTicket.findByPk('9999');
    await ticket.update({
      is_blocked: false,
      blocked_by: null,
      block_reason: null,
    });

    const updated = await DMTicket.findByPk('9999');
    expect(updated.is_blocked).toBe(false);
    expect(updated.blocked_by).toBeNull();
    expect(updated.block_reason).toBeNull();
  });

  test('should update thread_id for an existing ticket', async () => {
    const ticket = await DMTicket.findByPk('9999');
    await ticket.update({ thread_id: 'thread_456' });

    const updated = await DMTicket.findByPk('9999');
    expect(updated.thread_id).toBe('thread_456');
  });

  test('should delete a DM ticket', async () => {
    const ticket = await DMTicket.findByPk('9999');
    await ticket.destroy();

    const deleted = await DMTicket.findByPk('9999');
    expect(deleted).toBeNull();
  });
});
