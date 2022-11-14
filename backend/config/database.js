const { Sequelize, DataTypes, Model} = require('sequelize');
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'db/sintra.sqlite'
});

class User extends Model {}

User.init({
    //Structure of this model could be find in 'relational.pdf'
    //No need to define ID (assumed by default in Sequelize)
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    surname: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    dateOfBirth: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isEmail: true,
        },
    },
    password: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    gender: {
        type: DataTypes.STRING(1),
        allowNull: false,
        validate: {
            isIn: [['M', 'F', '-']],
        },
    },
    province: {
        type: DataTypes.STRING(2),
        allowNull: false,
    },
    //Login token
    token: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
    },
    tokenGoogle: {
        type: DataTypes.STRING(2048),
        allowNull: true,
        unique: true,
    },
    tokenFacebook: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
    },
    locker: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            is: /^(\d+;)+$/gm,
        }
    }
}, {
    sequelize,
    modelName: 'User'
})

//Create tables if not exists
User.sync().then(() => {
    console.log('User table created successfully!');
}).catch((error) => {
    console.error('Unable to create table: ', error)
})

module.exports.User = User;
