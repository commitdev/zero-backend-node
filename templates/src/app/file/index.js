const { Router } = require("express");
const FileService = require("../../service/file");

const router = Router();
const fileService = new FileService();

router.get("/presigned", (req, res) => {
  let key = req.query.key;
  return res.json(fileService.getUploadPresignedUrl( key ));
});

router.get("/",(req, res) => {
  let key = req.query.key;
  return res.json(fileService.getDownloadPresignedUrl( key ));
});

module.exports = router;
