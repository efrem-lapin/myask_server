import { Like } from "../models/models.js";

class LikeController {
  async putLike(req, res, next) {
    try {
      const { likerId, questionId, answererId } = req.body;
      const liked = await Like.findOne({ where: { questionId, likerId } });
      if (liked) {
        await Like.destroy({ where: { questionId, likerId } });
      } else {
        await Like.create({
          likerId,
          questionId,
          answererId,
        });
      }

      res.json({ message: "Toggle like" });
    } catch (error) {
      next(error);
    }
  }

  async getLikesQuestion(req, res, next) {
    try {
      const { questionId } = req.params;
      const listLikes = Like.findAll({ where: { questionId } });

      res.json(listLikes);
    } catch (error) {
      next(error);
    }
  }

  async getAmountLikes(req, res, next) {
    try {
      const answererId = req.params.answererId;
      const listLikes = Like.findAll({ where: { answererId } });

      res.json(listLikes.length);
    } catch (error) {
      next(error);
    }
  }

  async getIdAllLikesAnswer(req, res, next) {
    try {
      const questionId = Number(req.params.questionId);
      const listLikes = await Like.findAll({
        where: { questionId },
        attributes: ["likerId"],
      });

      res.json(listLikes);
    } catch (error) {
      next(error);
    }
  }
}

export default new LikeController();
