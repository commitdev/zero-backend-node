const TripService = require("../service/trip");
const tripService = new TripService();

module.exports = {
    Query: {
        bookedTrips: (_, { }, context) => {
            return tripService.getBookedTrips( {userId: context.user.id} );
        }
    },

    Mutation: {
        bookTrips: async (_, { launchIds }, context) => {
            const results = await tripService.bookTrips({ userId: context.user.id , launchIds });
            return {
                success: results && results.length === launchIds.length,
                message:
                    results.length === launchIds.length
                        ? 'trips booked successfully'
                        : `the following launches couldn't be booked: ${launchIds.filter(
                            id => !results.includes(id),
                        )}`
            };
        },
        cancelTrip: async (_, { launchId }, context) => {
            const result = await tripService.cancelTrip({ userId: context.user.id, launchId });
            if (!result)
                return {
                    success: false,
                    message: 'failed to cancel trip',
                };
            return {
                success: true,
                message: 'trip cancelled',
            };
        },

    },
}; 
