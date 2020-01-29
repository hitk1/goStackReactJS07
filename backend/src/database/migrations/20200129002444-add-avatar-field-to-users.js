
module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.addColumn('users', 'avatar_id', { // Primeiro parâmetro é a tabela, segundo parametro é o nome da coluna
    type: Sequelize.INTEGER,
    references: { model: 'files', key: 'id' },
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL',
    allowNull: true,
  }),

  down: (queryInterface) => queryInterface.removeColumn('users', 'avatar_id'),
};
