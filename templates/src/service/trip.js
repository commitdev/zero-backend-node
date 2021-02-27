const isEmail = require('isemail');
const User = require("../db/model/User");
const Trip = require("../db/model/Trip");

class TripService {
  constructor() {
  }

  async signup({ email }) {
    if (!email || !isEmail.validate(email)) return null;
    const users = await User.findOrCreate({ where: { email } });
    return users && users[0] ? users[0] : null;
  }

  async bookTrips({ userId, launchIds }) {
    if (!userId) return;
    let results = [];
    for (const launchId of launchIds) {
      const res = await this.bookTrip({ userId, launchId });
      if (res) results.push(res);
    }
    return results;
  }

  async bookTrip({ userId, launchId }) {
    const res = await Trip.findOrCreate({
      where: { userId, launchId },
    });
    return res && res.length ? res[0].get() : false;
  }

  async cancelTrip({ userId, launchId }) {
    return !!Trip.destroy({ where: { userId, launchId } });
  }

  async getBookedTrips({ userId }) {
    const found = await Trip.findAll({
      where: { userId },
    });
    return found;
  }
}

module.exports = TripService;
