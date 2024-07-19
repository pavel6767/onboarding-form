const router = require("express").Router();

const { User } = require("../../db/models");

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
  return res.header("Allow", "GET,POST").sendStatus(405);
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
const postOnboarding = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.sendStatus(401);
    }

    const inputBody = req.body.steps.reduce((acc, current) => {
      current.forEach(q => {
        acc[q.name] = q.value
      })
      return acc
    }, {})
    
    const [_, updatedUser] = await User.update(inputBody, {
      where: {
        username: req.body.username,
      },
      returning: true,
    })
    
    if (updatedUser === 0 ) {
      res.status(404).send('User not found')
    } else {
      const user = await User.findOne({
        attributes: {
          exclude: ['password', 'salt']
        },
        where: {
          username: req.headers.username,
        },
        raw: true
      });
      return res.status(201).json(user);
    }
  } catch (error) {
    next(error);
  }
};

router.route("/").get(getOnboarding);
router.route("/").post(postOnboarding);
router.all("/",methodNotAllowed);

module.exports = router;
