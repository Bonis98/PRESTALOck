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
    lockerSlot: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            isInt: true,
        }
    },
    terminationDate: {
        type: DataTypes.DATEONLY,
        allowNull: true,
    }
}, {
    sequelize,
    modelName: 'UserBorrowProduct',
})

//Associations
User.hasMany(UserBorrowProduct, {
    foreignKey: {
        name: 'idUser',
        allowNull: false,
    },
    onUpdate: 'CASCADE',
    onDelete: 'RESTRICT'
})
UserBorrowProduct.belongsTo(User, {
    foreignKey: {
        name: 'idUser',
        allowNull: false,
    },
    onUpdate: 'CASCADE',
    onDelete: 'RESTRICT'
})

Product.hasMany(UserBorrowProduct, {
    foreignKey: {
        name: 'idProduct',
        allowNull: false,
    },
    onUpdate: 'CASCADE',
    onDelete: 'RESTRICT'
})
UserBorrowProduct.belongsTo(Product, {
    foreignKey: {
        name: 'idProduct',
        allowNull: false,
    },
    onUpdate: 'CASCADE',
    onDelete: 'RESTRICT'
})

module.exports.UserBorrowProduct = UserBorrowProduct;
