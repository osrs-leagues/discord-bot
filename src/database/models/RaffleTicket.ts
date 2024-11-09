import { CreationOptional, DataTypes, ForeignKey, Sequelize } from 'sequelize';
import { InitializableModel } from '../models/types';
import DiscordUser from '../models/DiscordUser';
import ChallengeCard from './Challenge/ChallengeCard';

export enum RaffleType {
  LOW_LEVEL = 'low level',
  HIGH_LEVEL = 'high level',
}

class RaffleTicket extends InitializableModel<RaffleTicket> {
  declare raffleType: RaffleType;
  declare winner: boolean;

  declare readonly createdAt: CreationOptional<Date>;
  declare readonly discordUserId: ForeignKey<DiscordUser['user_id']>;
  declare readonly challengeCardId: ForeignKey<ChallengeCard['id']>;
  declare readonly id: CreationOptional<number>;
  declare readonly updatedAt: CreationOptional<Date>;

  static initialize = (sequelize: Sequelize) => {
    RaffleTicket.init(
      {
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
      },
      {
        tableName: 'RaffleTicket',
        sequelize,
      },
    );
  };

  static initializeAssociations() {
    RaffleTicket.belongsTo(DiscordUser, {
      foreignKey: {
        allowNull: false,
        name: 'discordUserId',
      },
    }),
      RaffleTicket.belongsTo(ChallengeCard, {
        foreignKey: {
          allowNull: false,
          name: 'id',
        },
      });
  }
}

export default RaffleTicket;
