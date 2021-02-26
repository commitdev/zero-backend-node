module.exports = {
    Query: {
        launch: (_, { id }, { dataSources }) =>
            dataSources.launchAPI.getLaunchById({ launchId: id }),
        presignedUrls: (_, { key }, { dataSources }) => {
            const presignedurls = [];
            presignedurls.push(dataSources.fileAPI.getDownloadPresignedUrl({ key }));
            presignedurls.push(dataSources.fileAPI.getUploadPresignedUrl({ key }));
            return presignedurls;
        },
        userInfo: (_, {}, { dataSources }) => {
            return dataSources.authAPI.getUserInfo();
        },
        status: (_, {}, {}) => {
            var podName = (process.env.POD_NAME)?process.env.POD_NAME:"zero-node-backend";
            return {
                ready: "OK",
                alive: "OK",
                podName: podName
            };
        }

    },

    Mutation: {
        signup: async (_, { email }, { dataSources }) => {
            const user = await dataSources.userDB.findOrCreateUser({ email });
            if (user) {
                user.token = Buffer.from(email).toString('base64');
                return user;
            }
        },
        bookTrips: async (_, { userId, launchIds }, { dataSources }) => {
            const results = await dataSources.userDB.bookTrips({ userId, launchIds });
            const launches = await dataSources.launchAPI.getLaunchesByIds({
                launchIds,
            });

            return {
                success: results && results.length === launchIds.length,
                message:
                    results.length === launchIds.length
                        ? 'trips booked successfully'
                        : `the following launches couldn't be booked: ${launchIds.filter(
                            id => !results.includes(id),
                        )}`,
                launches,
            };
        },
        cancelTrip: async (_, { userId, launchId }, { dataSources }) => {
            const result = await dataSources.userDB.cancelTrip({ userId, launchId });

            if (!result)
                return {
                    success: false,
                    message: 'failed to cancel trip',
                };

            const launch = await dataSources.launchAPI.getLaunchById({ launchId });
            return {
                success: true,
                message: 'trip cancelled',
                launches: [launch],
            };
        },

    },

    Mission: {
        // The default size is 'LARGE' if not provided
        missionPatch: (mission, { size } = { size: 'LARGE' }) => {
            return size === 'SMALL'
                ? mission.missionPatchSmall
                : mission.missionPatchLarge;
        },
    },
}; 
