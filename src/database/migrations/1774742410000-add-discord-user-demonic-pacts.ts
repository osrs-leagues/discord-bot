import { DataTypes, QueryInterface } from 'sequelize';

module.exports = {
  async up(queryInterface: QueryInterface) {
    await queryInterface.addColumn('DiscordUser', 'demonic_pacts_name', {
      type: DataTypes.STRING,
      allowNull: true,
    });
  },
  async down(queryInterface: QueryInterface) {
    await queryInterface.removeColumn('DiscordUser', 'demonic_pacts_name');
  },
};
