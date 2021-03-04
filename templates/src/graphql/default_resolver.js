const FileService = require("../service/file");
const fileService = new FileService();

module.exports = {
    Query: {
        presignedUrls: (_, { key }, context) => {
            const presignedurls = {
                upload: fileService.getUploadPresignedUrl( key ),
                download: fileService.getDownloadPresignedUrl( key )
            };
            return presignedurls;
        },
        userInfo: (_, {}, context) => {
            return context.user;
        }
    },
}; 
