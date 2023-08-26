import { DataTypes, Sequelize, Model } from 'sequelize';

interface DiscordUserAttributes {
  user_id: string;
  twisted_name?: string;
  trailblazer_name?: string;
  shattered_relics_name?: string;
  trailblazer_reloaded_name?: string;
}

class DiscordUser
  extends Model<DiscordUserAttributes>
  implements DiscordUserAttributes
{
  declare user_id: string;
  declare twisted_name?: string;
  declare trailblazer_name?: string;
  declare shattered_relics_name?: string;
  declare trailblazer_reloaded_name?: string;

  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

const initializeDiscordUser = (sequelize: Sequelize) => {
  DiscordUser.init(
    {
      user_id: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
        unique: true,
      },
      twisted_name: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      trailblazer_name: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      shattered_relics_name: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      trailblazer_reloaded_name: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      tableName: 'DiscordUser',
      sequelize,
    },
  );
};

export { DiscordUserAttributes, initializeDiscordUser };

export default DiscordUser;
