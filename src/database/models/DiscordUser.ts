import { DataTypes, Sequelize } from 'sequelize';

const DiscordUser = (sequelize: Sequelize) => {
  sequelize.define('DiscordUser', {
    user_id: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
      unique: true,
    },
    rs_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });
};

export default DiscordUser;
