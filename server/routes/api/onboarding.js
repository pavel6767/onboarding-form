const router = require("express").Router();

const STEPS = [
  [
    {
      name: "firstName",
      label: "First Name",
      type: "text",
      required: true,
    },
    {
      name: "lastName",
      label: "Last Name",
      type: "text",
    },
    {
      name: "country",
      label: "Country",
      type: "text",
      required: true,
    },
    {
      name: "bio",
      label: "Bio",
      type: "multiline-text",
    },
  ],
  [
    {
      name: "receiveNotifications",
      label:
        "I would like to receive email notifications for new messages when I'm logged out",
      type: "yes-no",
      required: false,
    },
    {
      name: "receiveUpdates",
      label: "I would like to receive updates about the product via email",
      type: "yes-no",
      required: false,
    },
  ],
];

const methodNotAllowed = (req, res, next) => {
  return res.header("Allow", "GET").sendStatus(405);
};

const getOnboarding = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.sendStatus(401);
    }
    return res.status(200).json({ steps: STEPS });
  } catch (error) {
    next(error);
  }
};

router.route("/").get(getOnboarding).all(methodNotAllowed);

module.exports = router;
