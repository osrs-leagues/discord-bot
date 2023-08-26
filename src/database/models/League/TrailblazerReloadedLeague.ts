import { DataTypes, Sequelize, Model } from 'sequelize';
import { LeagueAttributes } from './League';

class TrailblazerReloadedLeague
  extends Model<LeagueAttributes>
  implements LeagueAttributes
{
  declare name: string;
  declare points: number;

  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

const initializeTrailblazerReloadedLeague = (sequelize: Sequelize) => {
  TrailblazerReloadedLeague.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
        unique: true,
      },
      points: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      tableName: 'TrailblazerReloadedLeague',
      sequelize,
    },
  );
};

export { initializeTrailblazerReloadedLeague };

export default TrailblazerReloadedLeague;
