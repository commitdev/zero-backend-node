const { RESTDataSource } = require('apollo-datasource-rest');

class AuthAPI extends RESTDataSource {
    constructor() {
        super();
        this.baseURL = 'http://localhost:3000';
    }

    async getUserInfo() {

       const response = await this.get('/auth/userInfo');
       return {
           id:response.id,
           email:response.email
       }
    }

}

module.exports = AuthAPI;