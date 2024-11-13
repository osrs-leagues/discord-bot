import { CreationOptional, DataTypes, ForeignKey, Sequelize } from 'sequelize';
import { InitializableModel } from '../types';
import DiscordUser from '../DiscordUser';
import Challenge, { ChallengeDifficulty } from './Challenge';

export enum ChallengeCardStatus {
  STARTED = 'started',
  APPROVAL = 'approval',
  COMPLETED = 'completed',
}

class ChallengeCard extends InitializableModel<ChallengeCard> {
  declare difficulty: ChallengeDifficulty;
  declare proof: string;
  declare status: ChallengeCardStatus;
  declare rerollsRemaining: number;
  declare rerolled: boolean;

  declare readonly challengeOneId: ForeignKey<Challenge['id']>;
  declare readonly challengeTwoId: ForeignKey<Challenge['id']>;
  declare readonly challengeThreeId: ForeignKey<Challenge['id']>;
  declare readonly challengeFourId?: CreationOptional<
    ForeignKey<Challenge['id']>
  >;
  declare readonly challengeFiveId?: CreationOptional<
    ForeignKey<Challenge['id']>
  >;
  declare readonly createdAt: CreationOptional<Date>;
  declare readonly discordUserId: ForeignKey<DiscordUser['user_id']>;
  declare readonly id: CreationOptional<number>;
  declare readonly updatedAt: CreationOptional<Date>;

  static initialize = (sequelize: Sequelize) => {
    ChallengeCard.init(
      {
        challengeOneId: {
          type: DataTypes.BIGINT,
          allowNull: false,
          references: {
            model: 'Challenge',
            key: 'id',
          },
        },
        challengeTwoId: {
          type: DataTypes.BIGINT,
          allowNull: false,
          references: {
            model: 'Challenge',
            key: 'id',
          },
        },
        challengeThreeId: {
          type: DataTypes.BIGINT,
          allowNull: false,
          references: {
            model: 'Challenge',
            key: 'id',
          },
        },
        challengeFourId: {
          type: DataTypes.BIGINT,
          references: {
            model: 'Challenge',
            key: 'id',
          },
        },
        challengeFiveId: {
          type: DataTypes.BIGINT,
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
      },
      {
        tableName: 'ChallengeCard',
        sequelize,
        indexes: [
          {
            unique: true,
            fields: ['discordUserId', 'difficulty'],
          },
        ],
      },
    );
  };

  static initializeAssociations() {
    ChallengeCard.belongsTo(DiscordUser, {
      foreignKey: {
        allowNull: false,
        name: 'discordUserId',
      },
    });
  }

  getChallengeIds() {
    return [
      this.challengeOneId,
      this.challengeTwoId,
      this.challengeThreeId,
      this.challengeFourId,
      this.challengeFiveId,
    ].filter((id) => id !== undefined) as number[];
  }
}

export default ChallengeCard;
