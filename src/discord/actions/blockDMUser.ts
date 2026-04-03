import DMTicket from '../../database/models/DMTicket';

export type BlockDMUserParams = {
  userId: string;
  isBlocked: boolean;
  blockedBy?: string;
  reason?: string;
};

const blockDMUser = async ({
  userId,
  isBlocked,
  blockedBy,
  reason,
}: BlockDMUserParams): Promise<boolean> => {
  try {
    const ticket = await DMTicket.findByPk(userId);
    if (!ticket) {
      return false;
    }
    await ticket.update({
      is_blocked: isBlocked,
      blocked_by: isBlocked ? blockedBy ?? null : null,
      block_reason: isBlocked ? reason ?? null : null,
    });
    return true;
  } catch (error) {
    console.error('Error updating DM ticket block status:', error);
    return false;
  }
};

export default blockDMUser;
