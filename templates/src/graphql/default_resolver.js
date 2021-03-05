const FileService = require("../service/file");
const fileService = new FileService();

module.exports = {
    Query: {
        signedUrls: (_, { key }, context) => {
            const presignedurls = {
                upload: fileService.getUploadSignedUrl( key ),
                download: fileService.getDownloadSignedUrl( key )
            };
            return presignedurls;
        },
        userInfo: (_, {}, context) => {
            return context.user;
        }
    },
}; 
