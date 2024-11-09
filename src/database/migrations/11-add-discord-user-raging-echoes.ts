import { DataTypes, QueryInterface } from 'sequelize';

module.exports = {
  async up(queryInterface: QueryInterface) {
    await queryInterface.addColumn('DiscordUser', 'raging_echoes_name', {
      type: DataTypes.STRING,
      allowNull: true,
    });
  },
  async down(queryInterface: QueryInterface) {
    await queryInterface.removeColumn('DiscordUser', 'raging_echoes_name');
  },
};
