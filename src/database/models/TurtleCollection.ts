import { CreationOptional, DataTypes, ForeignKey, Sequelize } from 'sequelize';
import { InitializableModel } from './types';
import Turtle from './Turtle';

class TurtleCollection extends InitializableModel<TurtleCollection> {
  declare readonly id: CreationOptional<number>;
  declare user_id: string;
  declare turtle_id: ForeignKey<Turtle['id']>;
  declare readonly createdAt: CreationOptional<Date>;
  declare readonly updatedAt: CreationOptional<Date>;

  static initialize = (sequelize: Sequelize) => {
    TurtleCollection.init(
      {
        id: {
          type: DataTypes.BIGINT,
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          unique: true,
        },
        user_id: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        turtle_id: {
          type: DataTypes.BIGINT,
          allowNull: false,
          references: { model: 'Turtle', key: 'id' },
        },
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
      },
      {
        tableName: 'TurtleCollection',
        sequelize,
      },
    );
  };

  static initializeAssociations() {
    TurtleCollection.belongsTo(Turtle, { foreignKey: 'turtle_id' });
  }
}

export default TurtleCollection;
