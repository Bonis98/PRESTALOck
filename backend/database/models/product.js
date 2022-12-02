const {DataTypes, Model} = require("sequelize");
const {sequelize} = require("../connection");
const {User} = require("./user");

class Product extends Model {}

Product.init({
    //Structure of this model could be find in 'relational.pdf'
    //No need to define ID (assumed by default in Sequelize)
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    maxLoanDays: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            isInt: true,
            min: 1,
        },
    },
    picture: {
        type: DataTypes.BLOB,
        allowNull: true,
    },
    availability: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
    },
    insertionDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
}, {
    sequelize,
    modelName: 'product',
})

//Associations
User.hasMany(Product, {
    foreignKey: {
        name: 'idOwner',
        allowNull: false,
    },
    onUpdate: 'CASCADE',
    onDelete: 'RESTRICT',
});
Product.belongsTo(User, {
    foreignKey: {
        name: 'idOwner',
        allowNull: false,
    },
    onUpdate: 'CASCADE',
    onDelete: 'RESTRICT',
});

module.exports.Product = Product;
