import { DataTypes, QueryInterface } from 'sequelize';

import { RaffleTicket } from '../models';
import { RaffleType } from '../models/RaffleTicket';

module.exports = {
  async up(queryInterface: QueryInterface) {
    await queryInterface
      .createTable<RaffleTicket>('RaffleTicket', {
        discordUserId: {
          type: DataTypes.STRING,
          allowNull: false,
          references: {
            model: 'DiscordUser',
            key: 'user_id',
          },
        },
        raffleType: {
          type: DataTypes.ENUM<RaffleType>(
            RaffleType.LOW_LEVEL,
            RaffleType.HIGH_LEVEL,
          ),
          allowNull: false,
        },
        winner: {
          defaultValue: false,
          type: DataTypes.BOOLEAN,
          allowNull: false,
        },
        challengeCardId: {
          type: DataTypes.BIGINT,
          allowNull: false,
          references: {
            model: 'ChallengeCard',
            key: 'id',
          },
        },
        /** Auto-generated */
        id: {
          type: DataTypes.BIGINT,
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          unique: true,
        },
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
      })
      .then(async () => {
        await queryInterface.addIndex('RaffleTicket', ['discordUserId']);
      });
  },
  async down(queryInterface: QueryInterface) {
    await queryInterface.dropTable('RaffleTicket');
  },
};
