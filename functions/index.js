const functions = require("firebase-functions");

const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const cors = require("cors");
const bodyParser = require("body-parser");
const stream = require("stream");

const Multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const { format } = require("util");

const app = express();
const port = 85;

const multer = Multer({
  storage: Multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // no larger than 5mb, you can change as needed.
  },
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

const storage = new Storage({
  projectId: "social-media-calendar-84d06",
  keyFilename: serviceAccount,
});

const bucket = storage.bucket("gs://social-media-calendar-84d06.appspot.com");

app.use(cors());
app.use(morgan("short"));
app.use(helmet());
//app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
//app.use(bodyParser.json({ limit: "50mb" }));
app.use(multer.single("file"));

const uploadImageToStorage = (file, clientfolder) => {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject("No image file");
    }
    let newFileName = `${file.originalname}_${Date.now()}`;

    let fileUpload = bucket.file(`${clientfolder}/` + newFileName);

    const blobStream = fileUpload.createWriteStream({
      metadata: {
        contentType: file.mimetype,
        metadata: {
          firebaseStorageDownloadTokens: uuidv4(),
        },
      },
    });

    blobStream.on("error", (error) => {
      reject("Something is wrong! Unable to upload at the moment.");
    });

    blobStream.on("finish", () => {
      // The public URL can be used to directly access the file via HTTP.
      const url = format(
        `https://storage.googleapis.com/${bucket.name}/${fileUpload.name}`
      );
      resolve(url);
    });

    blobStream.end(file.buffer);
  });
};

app.get("/", (req, res) => {
  res.send("server is online");
});

// get all clients
app.get("/:clientid/posts", (req, res) => {
  (async () => {
    try {
      let query = db.collection("clients");
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
app.put("/add/:item_id", (req, res) => {
  (async () => {
    console.log(req.body);
    try {
      const document = db.collection("clients").doc(req.params.item_id);
      await document.update({
        posts: admin.firestore.FieldValue.arrayUnion(req.body),
      });
      return res.status(200).send();
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  })();
});

app.post("/:client/uploadimage", multer.single("file"), (req, res) => {
  console.log("Upload Image");
  console.log(req.file);
  let file = req.file;
  if (file) {
    uploadImageToStorage(file, req.params.client)
      .then((success) => {
        console.log("file uploaded");
        res.status(200).send({
          status: "success",
        });
      })
      .catch((error) => {
        console.error(error);
      });
  } else {
    console.log("not file");
  }
});

exports.app = functions.https.onRequest(app);

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
