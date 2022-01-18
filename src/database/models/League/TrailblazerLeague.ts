import { DataTypes, Sequelize, Model } from 'sequelize';
import { LeagueAttributes } from './League';

class TrailblazerLeague
  extends Model<LeagueAttributes>
  implements LeagueAttributes
{
  declare name: string;
  declare points: number;

  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

const initializeTrailblazerLeague = (sequelize: Sequelize) => {
  TrailblazerLeague.init(
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
      tableName: 'TrailblazerLeague',
      sequelize,
    },
  );
};

export { initializeTrailblazerLeague };

export default TrailblazerLeague;
