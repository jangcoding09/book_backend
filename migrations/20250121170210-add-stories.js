"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert("Stories", [
      {
        id: "660e8400-e29b-41d4-a716-446655440000",
        title: "첫 번째 이야기",
        content: "이것은 첫 번째 더미 이야기입니다.",
        clicks: 100,
        isSecret: false,
        category: "일반",
        authorName: "홍길동",
        likeCount: 15,
        userId: "550e8400-e29b-41d4-a716-446655440000", // Users 테이블의 ID와 연결
        imageIds: JSON.stringify(["img1.jpg", "img2.jpg"]),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "660e8400-e29b-41d4-a716-446655440001",
        title: "두 번째 이야기",
        content: "이것은 두 번째 더미 이야기입니다.",
        clicks: 50,
        isSecret: true,
        category: "비밀",
        authorName: "이몽룡",
        likeCount: 30,
        userId: "550e8400-e29b-41d4-a716-446655440001",
        imageIds: JSON.stringify(["img3.jpg", "img4.jpg"]),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("Stories", null, {});
  },
};
