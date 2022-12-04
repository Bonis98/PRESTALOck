'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    let nowDate = new Date();
    return queryInterface.bulkInsert('userBorrowProducts', [{
      id: 1,
      requestDate: nowDate.getFullYear()+'-'+(nowDate.getMonth()+1)+'-'+nowDate.getDate(),
      loanStartDate: nowDate.getFullYear()+'-'+(nowDate.getMonth()+1)+'-'+nowDate.getDate(),
      lockerId: 6,
      lockerSlot: 43,
      terminationDate: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      idUser: 2,
      idProduct: 3,
    }, {
      id: 2,
      requestDate: nowDate.getFullYear()+'-'+(nowDate.getMonth()+1)+'-'+nowDate.getDate(),
      loanStartDate: nowDate.getFullYear()+'-'+(nowDate.getMonth()+1)+'-'+nowDate.getDate(),
      lockerId: 2,
      lockerSlot: 11,
      terminationDate: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      idUser: 1,
      idProduct: 4,
    }, {
      id: 3,
      requestDate: nowDate.getFullYear()+'-'+(nowDate.getMonth()+1)+'-'+nowDate.getDate(),
      loanStartDate: null,
      lockerId: 1,
      lockerSlot: 2,
      terminationDate: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      idUser: 4,
      idProduct: 5,
    }, {
      id: 4,
      requestDate: nowDate.getFullYear()+'-'+(nowDate.getMonth()+1)+'-'+nowDate.getDate(),
      loanStartDate: nowDate.getFullYear()+'-'+(nowDate.getMonth()+1)+'-'+nowDate.getDate(),
      lockerId: 6,
      lockerSlot: 41,
      returnLockerSlot: 42,
      terminationDate: nowDate.getFullYear()+'-'+(nowDate.getMonth()+1)+'-'+nowDate.getDate(),
      createdAt: new Date(),
      updatedAt: new Date(),
      idUser: 2,
      idProduct: 2,
    }
    ])
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('userBorrowProducts', null, {});
  }
};
