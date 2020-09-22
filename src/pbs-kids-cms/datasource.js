const { RESTDataSource } = require('apollo-datasource-rest');

class PbsKidsCms extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = 'https://cms-dev.pbskids.org/api/graph/v3/';
  }

  async get(path, params = {}) {
    console.log('PBS KIDS CMS', { path }, { params });
    return super.get(path, params);
  }

  async getElement(elementId, params) {
    if (elementId === undefined) {
      return null;
    }
    return this.get(`elements/${elementId}`, params);
  }

  async getElements(elementIds, elementType) {
    const params = {
      id: elementIds,
      elementType: elementType,
    };

    const elements = await this.get('elements', params);

    return elements.data;
  }

  async getElementsInSection(sectionHandle, params) {
    const elements = await this.get(`sections/${sectionHandle}`, params);
    return elements.data;
  }
}

module.exports = { PbsKidsCms };
