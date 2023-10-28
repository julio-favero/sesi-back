// Importar biblioteca
const Sequelize = require('sequelize'); // Variável que vai importar a bilbioteca sequelize
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken'); 

// Importar módulos de configuração
const database = require('../config/dbConfig'); // Variável que vai guardar as configurações criadas na pasta "config"
const atletaModels = require('../models/atletaModels')
const gestorAdminModels = require('../models/gestorAdminModels')
const gestorModels = require('../models/gestorModels')
const medicoModels = require('../models/medicoModels')
const medicoConvModels = require('../models/medicoConvModels');

const vmIP = require("../config/configPort.json")
// Importar módulos do banco de dados

const tabela = [atletaModels, gestorAdminModels, gestorAdminModels, gestorModels, medicoModels, medicoConvModels]

const SECRET_KEY = 'Sesi@!$6j%aci#5%6-_2zep5jn=#ocyx5!!q)5y(12n^mqj$5rk82t'; // Senhha gerada para nosso token

// Class criada para Login
class loginControllers {
    static async login(req, res) {
        let verification = 'false'
        let response = {}
        await database.sync();
        try {
            for (let x = 0; x < tabela.length; x++) {
                let request = await tabela[x].findOne({ raw: true, where: { email: req.body.email } })
                if (request) {
                    response = request
                    break
                }
                if (x === tabela.length - 1) {
                    res.send("O usuário não foi encontrado")
                }
            }
            if (response) {
                bcrypt.compare(req.body.senha, response.senha, (err, data) => {
                    if (data) {
                        verification = 'true'

                        // Retorno para o front, passando informações do usuário
                        const payload = {
                            sub: response.id,
                            name: response.nome, 
                            role: response.cargo,
                        };

                        const token = jwt.sign(payload, SECRET_KEY);

                        return res.status(200).json({ msg: "SUCESSO", cargo: response.cargo, auth: verification, token });                   
                    }
                    else{
                        res.send("O usuário não foi encontrado")                  
                    }                    
                })
            }
        }
        catch (err) {
            res.status(500).json('Houve um erro interno!')
        }
    };
};

// Exportar módulos
module.exports = loginControllers;