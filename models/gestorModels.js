// Importar bibliotecas
const Sequelize = require('sequelize');
const bcrypt = require('bcrypt');

// Importar Módulos
const database = require('../config/dbConfig');
const gestorAdminModels = require('./gestorAdminModels');

// Criar models
const gestorModels = database.define('gestores', {
    idgestor: {
        type: Sequelize.INTEGER(4),
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    nome: Sequelize.STRING(50),
    cpf: Sequelize.CHAR(11),
    senha: Sequelize.STRING(100),
    email: Sequelize.STRING(50),
    sexo : Sequelize.ENUM("M", "F"),
    cargo : Sequelize.STRING(30),
    id_admin: {
        type: Sequelize.INTEGER(4),
        references: {
            model: gestorAdminModels,
            key: 'idadmin'
        }
    }
});

gestorModels.prototype.comparePassword = function (password) {
    return bcrypt.compare(password, this.senha);
};

database.sync().then(async () => {
    try {
        const usuarioPD = await gestorModels.findOne({ where: { email: 'jfavmir@gmail.com' } });
        if (!usuarioPD) {
            const senha = 'Senai@115'; 

            const salt = await bcrypt.genSalt(2); // Vai dificultar sua senha
            const passwordHash = await bcrypt.hash(senha, salt); // Vai receber a senha do usuário e vai adicionar o "Salt"

            await gestorModels.create({
                nome: 'Julio Miranda',
                cpf: '45147814512',
                email: 'jfavmir@gmail.com',
                senha: passwordHash,
                sexo: 'M',
                cargo: 'Gestor'
            });

            console.log('usuário inserido com sucesso!');
        } else {
            console.log('Usuário já existe. Nenhum dado foi inserido.');
        }
    } catch (error) {
        console.error('Erro ao inserir o dado padrão:', error);
    }
});

// Exportar módulo
module.exports = gestorModels;
