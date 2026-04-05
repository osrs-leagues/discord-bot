import { DataTypes, QueryInterface } from 'sequelize';

import { Turtle, TurtleRarity } from '../models';

module.exports = {
  async up(queryInterface: QueryInterface) {
    await queryInterface.createTable<Turtle>('Turtle', {
      id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        unique: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      image_url: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      rarity: {
        type: DataTypes.ENUM(...Object.values(TurtleRarity)),
        allowNull: false,
      },
      added_by: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    });
  },
  async down(queryInterface: QueryInterface) {
    await queryInterface.dropTable('Turtle');
  },
};
