const {DataTypes, Model} = require("sequelize");
const {sequelize} = require("../connection");

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
        validate: {
            isDate: true,
        }
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
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
            isIn: [['M', 'F', '*']],
        },
    },
    province: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    //Login token
    token: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
    },
    lockerList: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
            is: /^(\d+;)*$/gm,
        },
    }
}, {
    sequelize,
    modelName: 'User'
})

module.exports.User = User;