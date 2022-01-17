import { DataTypes, Sequelize, Model } from 'sequelize';
import { LeagueAttributes } from './League';

class ShatteredRelicsLeague
  extends Model<LeagueAttributes>
  implements LeagueAttributes
{
  declare name: string;
  declare points: number;

  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

const initializeShatteredRelicsLeague = (sequelize: Sequelize) => {
  ShatteredRelicsLeague.init(
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
      tableName: 'ShatteredRelicsLeague',
      sequelize,
    },
  );
};

export { initializeShatteredRelicsLeague };

export default ShatteredRelicsLeague;
