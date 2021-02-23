const { DataSource } = require('apollo-datasource');
const isEmail = require('isemail');

class UserDB extends DataSource {
  constructor({ store }) {
    super();
    this.store = store;
  }

  async findOrCreateUser({ email }) {
    if (!email || !isEmail.validate(email)) return null;
    const users = await this.store.users.findOrCreate({ where: { email } });
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
    const res = await this.store.trips.findOrCreate({
      where: { userId, launchId },
    });
    return res && res.length ? res[0].get() : false;
  }

  async cancelTrip({ userId, launchId }) {
    return !!this.store.trips.destroy({ where: { userId, launchId } });
  }

  async getLaunchIdsByUser({ userId }) {
    const found = await this.store.trips.findAll({
      where: { userId },
    });
    return found && found.length
      ? found.map(l => l.dataValues.launchId).filter(l => !!l)
      : [];
  }

  async isBookedOnLaunch({ userId, launchId }) {
    const found = await this.store.trips.findAll({
      where: { userId, launchId },
    });
    return found && found.length > 0;
  }
}

module.exports = UserDB;
