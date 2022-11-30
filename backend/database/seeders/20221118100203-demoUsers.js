'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('users', [{
      id: 1,
      email: "example1@example.com",
      password: "$2b$10$3xeB7GV.66DkZaguZyOEL.p503SoTW2.vuIdZ6tX8WdJlRVNabome", //Password in plain is "sicura"
      name: "David",
      surname: "Brown",
      dateOfBirth: "1998-08-25",
      province: "Milano",
      gender: "M",
      token: "ceb8437df3dca8646ecdece10373e695eaf24f54",
      lockerList: "6;22;",
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      id: 2,
      email: "example2@example.com",
      password: "$2b$10$PY8jZV6nWqovuYqhcHCrFOnO9Io7Tk40KCTZKGBpV2Ga.tA4qSqTa", //Password in plain is "sicura"
      name: "Mark",
      surname: "Brown",
      dateOfBirth: "1999-02-10",
      province: "Milano",
      gender: "M",
      token: "bcdece0d0650b29adeba7dde520bc0ede0a49b08",
      lockerList: "24;30;",
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      id: 3,
      email: "example3@example.com",
      password: "$2b$10$1bZMWzPTuGss2UZTNt1oye2m4/76xqu.jZfV5O6OkiuOif.n/ixQO", //Password in plain is "sicura"
      name: "Elizabeth",
      surname: "Brown",
      dateOfBirth: "2001-12-21",
      province: "Torino",
      gender: "F",
      token: "d75bee755d79eea0ad8f0a76a688d9479253b2dd",
      lockerList: "4;10;",
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      id: 4,
      email: "example4@example.com",
      password: "$2b$10$R70Jjr0cVtvbb6Tn7vAfPeOSCZcH7s.8yjIyxKASj2wvDHQGg.2L.", //Password in plain is "sicura"
      name: "Andrew",
      surname: "Brown",
      dateOfBirth: "1990-01-12",
      province: "Torino",
      gender: "*",
      token: "b17139c6a4ef4dd3c0965b6aa7160cb819eaf747",
      lockerList: "2;4;",
      createdAt: new Date(),
      updatedAt: new Date()
    }
    ])
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('users', null, {});
  }
};
