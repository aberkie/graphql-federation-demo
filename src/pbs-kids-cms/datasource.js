const { RESTDataSource } = require('apollo-datasource-rest');
const graphqlFields = require('graphql-fields');
class PbsKidsCms extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = 'https://cms-dev.pbskids.org/api/graph/v3/';
  }

  async get(path, params = {}, info) {
    const fields = Object.keys(graphqlFields(info));
    params.fields = fields;
    console.log('PBS KIDS CMS', { path }, { params });
    return super.get(path, params);
  }

  async getElement(elementId, params, info) {
    if (elementId === undefined) {
      return null;
    }
    return this.get(`elements/${elementId}`, params, info);
  }

  async getElements(elementIds, elementType, info) {
    const params = {
      id: elementIds,
      elementType: elementType,
    };

    const elements = await this.get('elements', params, info);

    return elements.data;
  }

  async getElementsInSection(sectionHandle, params, info) {
    const elements = await this.get(`sections/${sectionHandle}`, params, info);
    return elements.data;
  }
}

module.exports = { PbsKidsCms };
