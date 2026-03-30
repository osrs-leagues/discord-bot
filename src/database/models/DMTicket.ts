import { CreationOptional, DataTypes, Sequelize } from 'sequelize';
import { InitializableModel } from './types';

class DMTicket extends InitializableModel<DMTicket> {
  declare user_id: string;
  declare thread_id: string;
  declare is_blocked: CreationOptional<boolean>;
  declare blocked_by?: CreationOptional<string>;
  declare block_reason?: CreationOptional<string>;
  declare readonly createdAt: CreationOptional<Date>;
  declare readonly updatedAt: CreationOptional<Date>;

  static initialize = (sequelize: Sequelize) => {
    DMTicket.init(
      {
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
      },
      {
        tableName: 'DMTicket',
        sequelize,
      },
    );
  };

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  static initializeAssociations() {}
}

export default DMTicket;
