'use strict';

const fs = require("fs");
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    var nowDate = new Date();
    return queryInterface.bulkInsert('products', [{
      id: 1,
      title: "MacBook Pro M1",
      description: "Really beautiful MacBook Pro!",
      maxLoanDays: 2,
      availability: true,
      insertionDate: nowDate.getFullYear()+'-'+(nowDate.getMonth()+1)+'-'+nowDate.getDate(),
      picture: Buffer.from(fs.readFileSync('./seeders/demoImages/MacBook.jpeg')),
      createdAt: new Date(),
      updatedAt: new Date(),
      idOwner: 1,
    }, {
      id: 2,
      title: "Playstation 5",
      description: "Really beautiful Playstation!",
      maxLoanDays: 1,
      availability: true,
      insertionDate: nowDate.getFullYear()+'-'+(nowDate.getMonth()+1)+'-'+nowDate.getDate(),
      picture: Buffer.from(fs.readFileSync('./seeders/demoImages/PlayStation.jpg')),
      createdAt: new Date(),
      updatedAt: new Date(),
      idOwner: 1,
    },{
      id: 3,
      title: "Playstation 5",
      description: "Really beautiful Playstation!",
      maxLoanDays: 1,
      availability: false,
      insertionDate: nowDate.getFullYear()+'-'+(nowDate.getMonth()+1)+'-'+nowDate.getDate(),
      picture: Buffer.from(fs.readFileSync('./seeders/demoImages/PlayStation.jpg')),
      createdAt: new Date(),
      updatedAt: new Date(),
      idOwner: 1,
    }, {
      id: 4,
      title: "Husqvarna chainsaw",
      description: "Really beautiful Husqvarna chainsaw!",
      maxLoanDays: 10,
      availability: false,
      insertionDate: nowDate.getFullYear()+'-'+(nowDate.getMonth()+1)+'-'+nowDate.getDate(),
      picture: Buffer.from(fs.readFileSync('./seeders/demoImages/Chainsaw.png')),
      createdAt: new Date(),
      updatedAt: new Date(),
      idOwner: 2,
    }, {
      id: 5,
      title: "Xiaomi TV!",
      description: "Really beautiful Xiaomi TV!",
      maxLoanDays: 30,
      availability: false,
      insertionDate: nowDate.getFullYear()+'-'+(nowDate.getMonth()+1)+'-'+nowDate.getDate(),
      picture: Buffer.from(fs.readFileSync('./seeders/demoImages/TV.png')),
      createdAt: new Date(),
      updatedAt: new Date(),
      idOwner: 3,
    }, {
      id: 6,
      title: "Husqvarna chainsaw",
      description: "Really beautiful Husqvarna chainsaw!",
      maxLoanDays: 10,
      availability: true,
      insertionDate: nowDate.getFullYear()+'-'+(nowDate.getMonth()+1)+'-'+nowDate.getDate(),
      picture: Buffer.from(fs.readFileSync('./seeders/demoImages/Chainsaw.png')),
      createdAt: new Date(),
      updatedAt: new Date(),
      idOwner: 4,
    },
    ])
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('products', null, {});
  }
};
