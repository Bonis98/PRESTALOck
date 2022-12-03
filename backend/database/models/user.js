const {DataTypes, Model} = require("sequelize");
const {sequelize} = require("../connection");
const bcrypt = require("bcrypt");
const fs = require("fs");

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
        set(email){
            this.setDataValue('email', email.toLowerCase())
        },
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true,
        },
    },
    password: {
        type: DataTypes.STRING,
        allowNull: true,
        set(password){
            this.setDataValue('password', bcrypt.hashSync(password, bcrypt.genSaltSync(10)))
        }
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
        validate: {
            exists(province) {
                let provinces = fs.readFileSync('././provinces.txt', 'binary');
                provinces = provinces.split(/\r?\n/);
                if (!provinces.includes(province))
                    throw new Error('Province filed is not valid')
            }
        }
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
    modelName: 'user'
});

module.exports.User = User;