import { DataTypes, QueryInterface } from 'sequelize';

import { TurtleCollection } from '../models';

module.exports = {
  async up(queryInterface: QueryInterface) {
    await queryInterface.createTable<TurtleCollection>('TurtleCollection', {
      id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        unique: true,
      },
      user_id: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      turtle_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: { model: 'Turtle', key: 'id' },
      },
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    });
    await queryInterface.addIndex(
      'TurtleCollection',
      ['user_id', 'turtle_id'],
      {
        name: 'turtle_collection_user_turtle_unique',
        unique: true,
      },
    );
  },
  async down(queryInterface: QueryInterface) {
    await queryInterface.dropTable('TurtleCollection');
  },
};
