const { RESTDataSource } = require('apollo-datasource-rest');

class AuthAPI extends RESTDataSource {
    constructor() {
        super();
        this.baseURL = process.env.GRAPHQL_BASE_URL;
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