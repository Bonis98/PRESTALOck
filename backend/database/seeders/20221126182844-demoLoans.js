'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    var nowDate = new Date();
    return queryInterface.bulkInsert('userBorrowProducts', [{
      id: 1,
      requestDate: nowDate.getFullYear()+'-'+(nowDate.getMonth()+1)+'-'+nowDate.getDate(),
      loanStartDate: nowDate.getFullYear()+'-'+(nowDate.getMonth()+1)+'-'+nowDate.getDate(),
      lockerSlot: 41,
      terminationDate: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      idUser: 2,
      idProduct: 1,
    }, {
      id: 2,
      requestDate: nowDate.getFullYear()+'-'+(nowDate.getMonth()+1)+'-'+nowDate.getDate(),
      loanStartDate: null,
      lockerSlot: 42,
      terminationDate: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      idUser: 2,
      idProduct: 2,
    }, {
      id: 3,
      requestDate: nowDate.getFullYear()+'-'+(nowDate.getMonth()+1)+'-'+nowDate.getDate(),
      loanStartDate: nowDate.getFullYear()+'-'+(nowDate.getMonth()+1)+'-'+nowDate.getDate(),
      lockerSlot: 11,
      terminationDate: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      idUser: 1,
      idProduct: 3,
    }, {
      id: 4,
      requestDate: nowDate.getFullYear()+'-'+(nowDate.getMonth()+1)+'-'+nowDate.getDate(),
      loanStartDate: null,
      lockerSlot: 10,
      terminationDate: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      idUser: 4,
      idProduct: 4,
    }
    ])
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('userBorrowProducts', null, {});
  }
};
