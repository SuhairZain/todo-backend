import express from "express";
const app = express();

import bodyParser from "body-parser";

import uuid from "uuid/v4";

import { init as initMongoose } from "./utils/mongo";
initMongoose();

import User from "./models/User";

app.use(bodyParser.json());

const USER_ID = "597376c42fb897dbc2e48e85";

app.get("/", (req, res) => {
  User.findById(USER_ID)
    .then(({ items }) => {
      res.send(items);
    })
    .catch(error => {
      res.send(500, error.message);
    });
});

app.delete("/:id", (req, res) => {
  const { id } = req.params;
  User.findByIdAndUpdate(USER_ID, { $pull: { items: { _id: id } } })
    .then(() => {
      res.sendStatus(204);
    })
    .catch(error => {
      res.send(500, error.message);
    });
});

app.post("/", (req, res) => {
  const { text } = req.body;
  const _id = uuid();
  User.findByIdAndUpdate(USER_ID, {
    $push: {
      items: {
        _id,
        done: false,
        text
      }
    }
  })
    .then(() => {
      res.send(_id);
    })
    .catch(error => {
      res.send(500, error.message);
    });
});

app.patch("/:id", (req, res) => {
  const { id } = req.params;
  const { done, text } = req.body;
  User.update(
    { _id: USER_ID, "items._id": id },
    {
      "items.$.text": text,
      "items.$.done": done
    }
  )
    .then(() => {
      res.send(204);
    })
    .catch(error => {
      res.send(500, error.message);
    });
});

app.put("/reorder/:sourceId/:targetIndex", async (req, res) => {
  let { sourceId, targetIndex } = req.params;
  targetIndex = Number.parseInt(targetIndex);
  const { items } = await User.findOne({ _id: USER_ID });
  const item = items.find(({ _id }) => _id === sourceId);
  await User.findByIdAndUpdate(USER_ID, {
    $pull: { items: { _id: sourceId } }
  });
  User.findByIdAndUpdate(USER_ID, {
    $push: {
      items: {
        $position: targetIndex,
        $each: [
          {
            _id: item._id,
            text: item.text,
            done: item.done
          }
        ]
      }
    }
  })
    .then(results => {
      res.sendStatus(204);
    })
    .catch(error => {
      res.send(500, error.message);
    });
});

const PORT = 8000;
app.listen(PORT, () => {
  console.log(`Listening on ${PORT}`);
});
