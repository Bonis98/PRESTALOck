const {Model, DataTypes} = require("sequelize");
const {sequelize} = require("../connection");
const {User} = require("./user");
const {Product} = require("./product");

class UserBorrowProduct extends Model {}

UserBorrowProduct.init({
    //Structure of this model could be find in 'relational.pdf'
    //No need to define ID (assumed by default in Sequelize)
    requestDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
    loanStartDate: {
        type: DataTypes.DATEONLY,
        allowNull: true,
    },
    lockerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            isInt: true,
            min: 1
        }
    },
    lockerSlot: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            isInt: true,
            min: 1
        }
    },
    returnLockerSlot: {
        type: DataTypes.INTEGER,
        allowNull: true,
        validate: {
            isInt: true,
            min: 1
        }
    },
    terminationDate: {
        type: DataTypes.DATEONLY,
        allowNull: true,
    }
}, {
    sequelize,
    modelName: 'userBorrowProduct',
});

//Associations
User.hasMany(UserBorrowProduct, {
    foreignKey: {
        name: 'idUser',
        allowNull: false,
    },
    onUpdate: 'CASCADE',
    onDelete: 'RESTRICT'
});
UserBorrowProduct.belongsTo(User, {
    foreignKey: {
        name: 'idUser',
        allowNull: false,
    },
    onUpdate: 'CASCADE',
    onDelete: 'RESTRICT'
});

Product.hasMany(UserBorrowProduct, {
    foreignKey: {
        name: 'idProduct',
        allowNull: false,
    },
    onUpdate: 'CASCADE',
    onDelete: 'RESTRICT'
});
UserBorrowProduct.belongsTo(Product, {
    foreignKey: {
        name: 'idProduct',
        allowNull: false,
    },
    onUpdate: 'CASCADE',
    onDelete: 'RESTRICT'
});

module.exports.UserBorrowProduct = UserBorrowProduct;
