const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const cors = require("cors");
const bodyParser = require("body-parser");
const stream = require("stream");

const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const { format } = require("util");
const multerS3 = require("multer-s3");
const AWS = require("aws-sdk");
require("dotenv").config();

const app = express();
const port = 85;

/*const multer = Multer({
  storage: Multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // no larger than 5mb, you can change as needed.
  },
});*/

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
});

const uploadS3 = multer({
  storage: multerS3({
    s3: s3,
    acl: "public-read",
    bucket: "socialcalendarbtwg",
    metadata: (req, file, cb) => {
      cb(null, { fieldName: file.fieldname });
    },
    key: (req, file, cb) => {
      cb(null, Date.now().toString() + "-" + file.originalname);
    },
  }),
});

const { Storage } = require("@google-cloud/storage");

//firebase stuff
const admin = require("firebase-admin");

const serviceAccount = require("./social-media-calendar-84d06-firebase-adminsdk-lpmx8-ef636caa51.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "gs://social-media-calendar-84d06.appspot.com",
});

const db = admin.firestore();

app.use(cors());
app.use(morgan("short"));
app.use(helmet());
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
app.use(bodyParser.json({ limit: "50mb" }));

app.get("/", (req, res) => {
  res.send("server is online");
});

// get all clients
app.get("/:userid/:clientid/posts", (req, res) => {
  (async () => {
    try {
      let query = db.collection(req.params.userid);
      let response = [];
      await query.get().then((querySnapshot) => {
        let docs = querySnapshot.docs;
        for (let doc of docs) {
          if (doc.id === req.params.clientid) {
            const selectedItem = {
              id: doc.id,
              posts: doc.data().posts,
              clientid: doc.data().clientid,
            };
            response.push(selectedItem);
          }
        }
      });
      return res.status(200).send(response);
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  })();
});

// update
app.put("/:userid/add/:item_id", uploadS3.single("file"), (req, res) => {
  (async () => {
    console.dir(JSON.parse(req.body.post));
    let parsedData = JSON.parse(req.body.post);

    console.log(req.file);
    try {
      const document = db.collection(req.params.userid).doc(req.params.item_id);
      await document.update({
        posts: admin.firestore.FieldValue.arrayUnion({
          id: parsedData.id,
          imageUrl: req.file.location,
          start: parsedData.start,
          end: parsedData.end,
          title: parsedData.title,
          hashtags: parsedData.hashtags,
          platform: parsedData.platform,
          description: parsedData.description,
        }),
      });
      return res.status(200).send();
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  })();
});

app.listen(process.env.PORT, () => {
  console.log("server is listening on", port);
});
