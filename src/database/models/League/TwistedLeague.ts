import { DataTypes, Sequelize, Model } from 'sequelize';
import { LeagueAttributes } from './League';

class TwistedLeague
  extends Model<LeagueAttributes>
  implements LeagueAttributes
{
  declare name: string;
  declare points: number;

  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

const initializeTwistedLeague = (sequelize: Sequelize) => {
  TwistedLeague.init(
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
      tableName: 'TwistedLeague',
      sequelize,
    },
  );
};

export { initializeTwistedLeague };

export default TwistedLeague;
