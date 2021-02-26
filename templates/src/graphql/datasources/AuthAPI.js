const { RESTDataSource } = require('apollo-datasource-rest');

class AuthAPI extends RESTDataSource {
    constructor() {
        super();
        this.baseURL = process.env.GRAPHQL_BASE_URL;
    }
    
    willSendRequest(request) {
        if(this.context.auth){
            request.headers.set('x-user-id', this.context.auth.id);
            request.headers.set('x-user-email', this.context.auth.email);
        }
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