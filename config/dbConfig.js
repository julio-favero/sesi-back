// Importar biblioteca
const Sequelize = require('sequelize'); // Vai receber o sequelize

// Conectar com banco de dados
const database = new Sequelize('sesi','root','1372',{
    dialect: 'mysql',
    host:'localhost',
    port: 3306,
});

// Exportar módulo
module.exports = database;
