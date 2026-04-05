import { CreationOptional, DataTypes, Sequelize } from 'sequelize';
import { InitializableModel } from './types';

export enum TurtleRarity {
  COMMON = 'COMMON',
  UNCOMMON = 'UNCOMMON',
  RARE = 'RARE',
  ULTRA_RARE = 'ULTRA_RARE',
}

export const TURTLE_RARITY_WEIGHTS: Record<TurtleRarity, number> = {
  [TurtleRarity.COMMON]: 1,
  [TurtleRarity.UNCOMMON]: 1 / 10,
  [TurtleRarity.RARE]: 1 / 100,
  [TurtleRarity.ULTRA_RARE]: 1 / 500,
};

export const getTurtleRarityName = (rarity: TurtleRarity): string => {
  switch (rarity) {
    case TurtleRarity.COMMON:
      return 'Common';
    case TurtleRarity.UNCOMMON:
      return 'Uncommon';
    case TurtleRarity.RARE:
      return 'Rare';
    case TurtleRarity.ULTRA_RARE:
      return 'Ultra Rare';
    default:
      throw new Error(`Unknown turtle rarity: ${rarity}`);
  }
};

class Turtle extends InitializableModel<Turtle> {
  declare readonly id: CreationOptional<number>;
  declare uuid: CreationOptional<string>;
  declare name?: CreationOptional<string>;
  declare image_url: string;
  declare rarity: TurtleRarity;
  declare added_by?: CreationOptional<string>;
  declare readonly createdAt: CreationOptional<Date>;
  declare readonly updatedAt: CreationOptional<Date>;

  static initialize = (sequelize: Sequelize) => {
    Turtle.init(
      {
        id: {
          type: DataTypes.BIGINT,
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          unique: true,
        },
        uuid: {
          type: DataTypes.UUID,
          allowNull: false,
          defaultValue: DataTypes.UUIDV4,
          unique: true,
        },
        name: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        image_url: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        rarity: {
          type: DataTypes.ENUM(...Object.values(TurtleRarity)),
          allowNull: false,
        },
        added_by: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
      },
      {
        tableName: 'Turtle',
        sequelize,
      },
    );
  };

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  static initializeAssociations() {}
}

export default Turtle;
