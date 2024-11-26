import { DataTypes, QueryInterface } from 'sequelize';

module.exports = {
  async up(queryInterface: QueryInterface) {
    await queryInterface.changeColumn('Challenge', 'description', {
      type: DataTypes.TEXT,
      allowNull: false,
    });
  },
  async down(queryInterface: QueryInterface) {
    await queryInterface.changeColumn('Challenge', 'description', {
      type: DataTypes.STRING,
      allowNull: false,
    });
  },
};
