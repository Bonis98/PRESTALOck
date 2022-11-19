'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Users', [{
      email: "example1@example.com",
      password: "$2b$10$81hUnKXLJx1uHRCn3.UP5.npCz7QLV8Oab1wwjCFj3zyDXD5wxQba", //"sicura"
      name: "David",
      surname: "Brown",
      dateOfBirth: "1998-08-25",
      province: "Milano",
      gender: "M",
      token: "ceb8437df3dca8646ecdece10373e695eaf24f54",
      lockerList: "2;3;",
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      email: "example2@example.com",
      password: "$2b$10$81hUnKXLJx1uHRCn3.UP5.npCz7QLV8Oab1wwjCFj3zyDXD5wxQba", //"sicura"
      name: "Mark",
      surname: "Brown",
      dateOfBirth: "1999-02-10",
      province: "Milano",
      gender: "M",
      token: "ceb8437df3dca8646ecdece11673e695eaf24f54",
      lockerList: "2;4;",
      createdAt: new Date(),
      updatedAt: new Date()
    }
    ])
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Users', null, {});
  }
};
