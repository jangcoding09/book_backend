const { Op } = require("sequelize");
const { User, Story, Image } = require("../models");
const { bucket } = require("../firbase");
const { fetchImagesForStory } = require("./fetchImagesForStory");
const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// 특정 스토리 정보를 가져오는 함수
const getStory = async (req, res) => {
  try {
    const storyId = req.params.id;
    const story = await Story.findByPk(storyId, {
      include: [
        {
          model: User,
          as: "user",
          attributes: [
            "id",
            "name",
            "nickname",
            "role",
            "email",
            "profileImg",
            "createdAt",
          ],
        },
      ],
    });

    if (!story) {
      return res.status(404).send({ error: "Story not found" });
    }

    const images = await fetchImagesForStory(story);

    const storyWithImages = {
      ...story.toJSON(),
      images,
    };

    res.send(storyWithImages);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

const getStories = async (req, res) => {
  try {
    const {
      take = 10,
      page = 1,
      ordertype,
      search__title,
      search__authorname,
      category,
    } = req.query;

    const where = {
      isSecret: false,
    };
    if (search__title) {
      where.title = { [Op.iLike]: `%${search__title}%` };
    }
    if (search__authorname) {
      where.authorName = { [Op.iLike]: `%${search__authorname}%` };
    }
    if (category) {
      where.category = category;
    }
    const order = [];
    console.log("ordertype_________", ordertype);
    if (ordertype === "DESC") {
      order.push(["createdAt", "DESC"]);
    } else if (ordertype === "ASC") {
      order.push(["createdAt", "ASC"]);
    } else if (ordertype === "CLICKS") {
      order.push(["clicks", "DESC"]);
    }

    const storiesResult = await Story.findAndCountAll({
      where,
      order,
      limit: parseInt(take, 10),
      offset: (page - 1) * take,
    });

    const storiesWithImages = await Promise.all(
      storiesResult.rows.map(async (story) => {
        const images = await fetchImagesForStory(story);
        return {
          id: story.id,
          title: story.title,
          category: story.category,
          isSecret: story.isSecret,
          createdAt: story.createdAt,
          updatedAt: story.updatedAt,
          authorName: story.authorName,
          userId: story.userId,
          clicks: story.clicks,
          images,
        };
      })
    );

    res.json({
      data: storiesWithImages,
      cursor: {
        after: page,
      },
      count: storiesResult.count,
      next:
        storiesResult.rows.length === parseInt(take, 10)
          ? `/gpt?take=${take}&page=${parseInt(page, 10) + 1}`
          : null,
      total: storiesResult.count,
    });
  } catch (error) {
    console.error("Error fetching stories:", error);
    res.status(500).send({ error: error.message });
  }
};

// GPT 요청을 통해 스토리를 생성하는 함수
const createTemplate = async (req, res) => {
  const transaction = await Story.sequelize.transaction();

  try {
    const userId = req.user.id; // JWT 토큰에서 추출한 사용자 ID 사용
    // 임의의 데이터로 스토리 생성
    const story = await Story.create(
      {
        title: "제목 없음",
        content: "",
        userId,
        authorName: req.user.nickname,
        isSecret: true,
      },
      { transaction }
    );

    await transaction.commit();
    res.status(201).send({ id: story.id });
  } catch (error) {
    await transaction.rollback();
    res.status(500).send({ error: error.message });
  }
};

const gptchat = async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: "Prompt is required" });
  }
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    });
    const gptResponse = completion.choices[0].message.content;
    res.status(200).send({ content: gptResponse });
  } catch {
    res.status(500).send({ error: error.message });
  }
};

const changeStoryWithGPT = async (req, res) => {
  const transaction = await Story.sequelize.transaction();

  try {
    const { userRequest, userText, storyId } = req.body;

    if (!userText) {
      return res.status(400).json({ error: "userText is required" });
    }

    let existingStory;
    if (storyId) {
      existingStory = await Story.findByPk(storyId);
    }

    const fullPrompt = existingStory
      ? `다음은 기존 내용입니다:\n\n${existingStory.content}\n\n사용자의 요청: ${userRequest}\n\n 바꾸고 싶은 이야기: ${userText}\n\n위 내용을 바탕으로 사용자의 요청에 맞게 바꾸고 싶은 이야기를 개선해주세요. 개선한 부분만 응답으로 제공해주세요.`
      : userText;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: fullPrompt }],
    });

    const gptResponse = completion.choices[0].message.content;

    res.status(200).send({ content: gptResponse });
  } catch (error) {
    await transaction.rollback();
    res.status(500).send({ error: error.message });
  }
};

// 스토리를 최종 저장하는 함수
const saveStory = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, category, authorName, imageIds } = req.body;

    const story = await Story.findByPk(id);
    if (!story) {
      return res.status(404).send({ error: "Story not found" });
    }

    // 스토리의 필드 업데이트
    story.title = title || story.title;
    story.content = content || story.content;
    story.category = category || story.category;
    story.authorName = authorName || story.authorName;
    story.imageIds = imageIds || story.imageIds;
    await story.save();

    res.status(200).send(story);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

// 스토리의 content 부분만 따로 저장하는 함수
const patchStoryContent = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;

    const story = await Story.findByPk(id);
    if (!story) {
      return res.status(404).send({ error: "Story not found" });
    }

    // 스토리의 content 필드 업데이트
    story.content = content || story.content;
    await story.save();

    res.status(200).send(story);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

// 스토리의 전체 데이터를 수정하는 함수
const updateStory = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, category, authorName, imageIds, isSecret } =
      req.body;

    const story = await Story.findByPk(id);
    if (!story) {
      return res.status(404).send({ error: "Story not found" });
    }

    // 스토리의 전체 필드 업데이트
    story.title = title;
    story.content = content;
    story.category = category;
    story.authorName = authorName;
    story.imageIds = imageIds;
    story.isSecret = isSecret;
    await story.save();

    res.status(200).send(story);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

const appendStoryContent = async (req, res) => {
  try {
    const { id } = req.params;
    const { userRequest } = req.body;

    const story = await Story.findByPk(id);
    if (!story) {
      return res.status(404).send({ error: "Story not found" });
    }

    // Append new content to the existing content
    let prompt = `기존이야기:${story.content}\n\n 추가하고 싶은 이야기:${userRequest}\n\n위 줄거리에 이어서 추가하고싶은 이야기를 추가해주세요. 추가한 내용만 응답으로 제공해주세요.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    });

    const gptResponse = completion.choices[0].message.content;
    res.status(200).send({ content: gptResponse });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

const deleteStory = async (req, res) => {
  try {
    const id = req.params.id;
    const userId = req.user.id;

    const user = await User.findByPk(userId);
    if (user.role === "ADMIN") {
      return res.status(403).send({ error: "Admin cannot delete story" });
    }
    const story = await Story.findByPk(id);
    if (!story) {
      return res.status(404).send({ error: "Story not found" });
    }
    const images = await Image.findAll({
      where: {
        id: {
          [Op.in]: story.imageIds,
        },
      },
    });

    for (const image of images) {
      try {
        const file = bucket.file(image.fbPath);
        await file.delete();
      } catch (error) {
        console.error("Error deleting image from Firebase Storage:", error);
      }
    }
    await Image.destroy({
      where: {
        id: {
          [Op.in]: story.imageIds,
        },
      },
    });
    await story.destroy();

    res.status(204).send();
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

const incrementClicks = async (req, res) => {
  const storyId = req.params.id;
  const cookieName = `story_${storyId}_clicked`;

  try {
    const story = await Story.findByPk(storyId);

    if (!story) {
      return res.status(404).send({ error: "Story not found" });
    }

    const clicked = req.cookies[cookieName];

    if (!clicked) {
      story.clicks += 1;
      await story.save();
      res.cookie(cookieName, "true", {
        maxAge: 24 * 60 * 60 * 1000, // 1 day
        httpOnly: true,
        sameSite: "Lax", // 이 설정을 추가하여 CORS 환경에서 쿠키 전송을 허용
      });
    }

    res.status(200).send({ clicks: story.clicks, cookieName });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

module.exports = {
  getStory,
  getStories,
  createTemplate,
  gptchat,
  changeStoryWithGPT,
  saveStory,
  patchStoryContent,
  updateStory,
  appendStoryContent,
  deleteStory,
  incrementClicks,
};
