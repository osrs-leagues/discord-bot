import { QueryInterface } from 'sequelize';

module.exports = {
  async up(queryInterface: QueryInterface) {
    await queryInterface.bulkInsert(
      'DiscordUser',
      [
        {
          user_id: '1234',
          twisted_name: 'test',
          createdAt: Date.now(),
          updatedAt: Date.now(),
        },
      ],
      {},
    );
  },

  async down(queryInterface: QueryInterface) {
    await queryInterface.delete(null, 'DiscordUser', { user_id: '1234' });
  },
};
