import { DataTypes, QueryInterface } from 'sequelize';

import { DMTicket } from '../models';

module.exports = {
  async up(queryInterface: QueryInterface) {
    await queryInterface.createTable<DMTicket>('DMTicket', {
      user_id: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
        unique: true,
      },
      thread_id: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      is_blocked: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      blocked_by: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      block_reason: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    });
  },
  async down(queryInterface: QueryInterface) {
    await queryInterface.dropTable('DMTicket');
  },
};
