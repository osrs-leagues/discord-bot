import { DataTypes, QueryInterface } from 'sequelize';

module.exports = {
  async up(queryInterface: QueryInterface) {
    await queryInterface.addColumn('Turtle', 'uuid', {
      type: DataTypes.UUID,
      allowNull: true,
    });

    const [turtles] = await queryInterface.sequelize.query(
      'SELECT id FROM `Turtle`',
    );
    for (const row of turtles as { id: number }[]) {
      const uuid = crypto.randomUUID();
      await queryInterface.sequelize.query(
        'UPDATE `Turtle` SET `uuid` = ? WHERE `id` = ?',
        { replacements: [uuid, row.id] },
      );
    }

    await queryInterface.addIndex('Turtle', ['uuid'], {
      unique: true,
      name: 'turtle_uuid_unique',
    });
  },
  async down(queryInterface: QueryInterface) {
    await queryInterface.removeIndex('Turtle', 'turtle_uuid_unique');
    await queryInterface.removeColumn('Turtle', 'uuid');
  },
};
