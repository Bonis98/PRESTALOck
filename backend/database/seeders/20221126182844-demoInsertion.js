'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    var nowDate = new Date();
    return queryInterface.bulkInsert('userBorrowProducts', [{
      id: 1,
      requestDate: nowDate.getFullYear()+'-'+(nowDate.getMonth()+1)+'-'+nowDate.getDate(),
      loanStartDate: nowDate.getFullYear()+'-'+(nowDate.getMonth()+1)+'-'+nowDate.getDate(),
      lockerSlot: 2,
      terminationDate: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      idUser: 1,
      idProduct: 3,
    }
    ])
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('userBorrowProducts', null, {});
  }
};
