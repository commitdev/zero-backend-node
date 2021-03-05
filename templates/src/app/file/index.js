const { Router } = require("express");
const FileService = require("../../service/file");

const router = Router();
const fileService = new FileService();

router.get("/presigned", (req, res) => {
  let key = req.query.key;
  return res.json(fileService.getUploadSignedUrl( key ));
});

router.get("/",(req, res) => {
  let key = req.query.key;
  return res.json(fileService.getDownloadSignedUrl( key ));
});

module.exports = router;
