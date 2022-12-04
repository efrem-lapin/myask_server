import { Subscription } from "../models/models.js";

class SubscriptionController {
  async subscribe(req, res, next) {
    try {
      const { subscriber, user } = req.body;
      const isExist = await Subscription.findOne({
        where: { subscriber: subscriber, userId: user },
      });

      if (isExist) {
        const s = await Subscription.destroy({
          where: { subscriber, userId: user },
        });
        res.json({ message: "Вы отписались!" });
      } else {
        const s = await Subscription.create({ subscriber, userId: user });
        res.json({ message: "Вы подписались!" });
      }
    } catch (error) {
      next(error);
    }
  }
}

export default new SubscriptionController();
