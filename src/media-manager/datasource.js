const { RESTDataSource } = require('apollo-datasource-rest');
class MediaManager extends RESTDataSource {
  constructor() {
    super();
  }

  async willSendRequest(request) {
    const authKey = this.context.MEDIA_MANAGER_AUTH_KEY;
    const authSecret = this.context.MEDIA_MANAGER_AUTH_SECRET;
    const authToken =
      'Basic ' + Buffer.from(authKey + ':' + authSecret).toString('base64');

    request.headers.set('Authorization', authToken);
  }

  async get(path, params = {}) {
    console.log('Media Manager', { path }, { params });
    try {
      const result = await super.get(path, params);
      return result.data;
    } catch (err) {
      // Do nothing with error for demo
      return null;
    }
  }

  get baseURL() {
    return 'https://media.services.pbs.org/api/v1/';
  }

  async getAsset(assetId) {
    return this.get(`assets/${assetId}`);
  }

  async getShow(showId) {
    return this.get(`shows/${showId}`);
  }
}

module.exports = { MediaManager };
