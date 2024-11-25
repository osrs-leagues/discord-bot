import { DataTypes, QueryInterface } from 'sequelize';

import { ChallengeCard } from '../models';
import { ChallengeCardStatus } from '../models/Challenge/ChallengeCard';

module.exports = {
  async up(queryInterface: QueryInterface) {
    await queryInterface
      .createTable<ChallengeCard>('ChallengeCard', {
        challengeOneId: {
          type: DataTypes.BIGINT,
          onDelete: 'SET NULL',
          references: {
            model: 'Challenge',
            key: 'id',
          },
        },
        challengeTwoId: {
          type: DataTypes.BIGINT,
          onDelete: 'SET NULL',
          references: {
            model: 'Challenge',
            key: 'id',
          },
        },
        challengeThreeId: {
          type: DataTypes.BIGINT,
          onDelete: 'SET NULL',
          references: {
            model: 'Challenge',
            key: 'id',
          },
        },
        challengeFourId: {
          type: DataTypes.BIGINT,
          onDelete: 'SET NULL',
          references: {
            model: 'Challenge',
            key: 'id',
          },
        },
        challengeFiveId: {
          type: DataTypes.BIGINT,
          onDelete: 'SET NULL',
          references: {
            model: 'Challenge',
            key: 'id',
          },
        },
        difficulty: {
          type: DataTypes.TINYINT,
          allowNull: false,
        },
        discordUserId: {
          type: DataTypes.STRING,
          allowNull: false,
          references: {
            model: 'DiscordUser',
            key: 'user_id',
          },
        },
        proof: {
          type: DataTypes.STRING,
        },
        status: {
          defaultValue: 'started',
          type: DataTypes.ENUM<ChallengeCardStatus>(
            ChallengeCardStatus.STARTED,
            ChallengeCardStatus.APPROVAL,
            ChallengeCardStatus.COMPLETED,
          ),
          allowNull: false,
        },
        rerollsRemaining: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        rerolled: {
          defaultValue: false,
          type: DataTypes.BOOLEAN,
          allowNull: false,
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
        await queryInterface.addIndex(
          'ChallengeCard',
          ['discordUserId', 'difficulty'],
          { unique: true },
        );
      });
  },
  async down(queryInterface: QueryInterface) {
    await queryInterface.dropTable('ChallengeCard');
  },
};
