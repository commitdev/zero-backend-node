const FileService = require("../service/file");
const fileService = new FileService();

module.exports = {
    Query: {
        downloadSignedUrl: (_, { key }, context) => {
            return fileService.getDownloadSignedUrl(key);
        },
        uploadSignedUrl: (_, { key }, context) => {
            return fileService.getUploadSignedUrl(key);
        },
        userInfo: (_, { }, context) => {
            return context.user;
        }
    },
};
