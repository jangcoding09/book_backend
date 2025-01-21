"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert("Users", [
      {
        id: "550e8400-e29b-41d4-a716-446655440000",
        name: "홍길동",
        nickname: "hong123",
        email: "hong@example.com",
        password: "hashedpassword1", // 실제 환경에서는 해시된 비밀번호 사용
        followerCount: 10,
        followeeCount: 5,
        valid_email: true,
        role: "USER",
        profileImg: ["https://example.com/profile1.jpg"],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "550e8400-e29b-41d4-a716-446655440001",
        name: "이몽룡",
        nickname: "lee456",
        email: "lee@example.com",
        password: "hashedpassword2",
        followerCount: 7,
        followeeCount: 2,
        valid_email: false,
        role: "ADMIN",
        profileImg: ["https://example.com/profile2.jpg"],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("Users", null, {});
  },
};
