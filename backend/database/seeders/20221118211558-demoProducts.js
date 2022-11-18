'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Products', [{
      title: "Product 1",
      description: "Very good conditions!", //"sicura"
      maxLoanDays: 2,
      insertionDate: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
      idOwner: 1,
    }, {
      title: "Product 2",
      description: "Acceptable conditions!", //"sicura"
      maxLoanDays: 2,
      insertionDate: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
      idOwner: 2,
    }
    ])
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Products', null, {});
  }
};
