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
      idUser: 2,
      idProduct: 1,
    }, {
      id: 2,
      requestDate: nowDate.getFullYear()+'-'+(nowDate.getMonth()+1)+'-'+nowDate.getDate(),
      loanStartDate: null,
      lockerSlot: 3,
      terminationDate: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      idUser: 3,
      idProduct: 2,
    }, {
      id: 3,
      requestDate: nowDate.getFullYear()+'-'+(nowDate.getMonth()+1)+'-'+nowDate.getDate(),
      loanStartDate: nowDate.getFullYear()+'-'+(nowDate.getMonth()+1)+'-'+nowDate.getDate(),
      lockerSlot: 4,
      terminationDate: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      idUser: 1,
      idProduct: 3,
    }, {
      id: 4,
      requestDate: nowDate.getFullYear()+'-'+(nowDate.getMonth()+1)+'-'+nowDate.getDate(),
      loanStartDate: null,
      lockerSlot: 5,
      terminationDate: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      idUser: 1,
      idProduct: 4,
    }
    ])
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('userBorrowProducts', null, {});
  }
};
