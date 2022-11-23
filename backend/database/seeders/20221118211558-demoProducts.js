'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    var nowDate = new Date();
    return queryInterface.bulkInsert('Products', [{
      title: "Product 1",
      description: "Very good conditions!",
      maxLoanDays: 2,
      availability: true,
      insertionDate: nowDate.getFullYear()+'-'+(nowDate.getMonth()+1)+'-'+nowDate.getDate(),
      createdAt: new Date(),
      updatedAt: new Date(),
      idOwner: 1,
    }, {
      title: "Product 2",
      description: "Acceptable conditions!",
      maxLoanDays: 2,
      availability: true,
      insertionDate: nowDate.getFullYear()+'-'+(nowDate.getMonth()+1)+'-'+nowDate.getDate(),
      createdAt: new Date(),
      updatedAt: new Date(),
      idOwner: 2,
    }, {
      title: "Product 3",
      description: "Good conditions!",
      maxLoanDays: 2,
      availability: false,
      insertionDate: nowDate.getFullYear()+'-'+(nowDate.getMonth()+1)+'-'+nowDate.getDate(),
      createdAt: new Date(),
      updatedAt: new Date(),
      idOwner: 2,
    }, {
      title: "Product 4",
      description: "Meh conditions!",
      maxLoanDays: 2,
      availability: true,
      insertionDate: nowDate.getFullYear()+'-'+(nowDate.getMonth()+1)+'-'+nowDate.getDate(),
      createdAt: new Date(),
      updatedAt: new Date(),
      idOwner: 3,
    }
    ])
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Products', null, {});
  }
};
