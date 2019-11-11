'use strict';

const Service = require('egg').Service;

const topicsCache = new Map();
let topic_id = 0;

class TopicsService extends Service {
  async create(params) {
    topic_id++;
    topicsCache.set(topic_id, {
      id: topic_id,
      ...params,
    });
    return topic_id;
  }

  async index() {
    return Array.from(topicsCache).map(it => it[1]);
  }

  async show(id) {
    const topic = topicsCache.get(id);
    return this.checkSuccess(topic, id);
  }

  async update(id, params) {
    const has = topicsCache.has(id);
    if (has) {
      topicsCache.set(id, { ...params, id });
    }
    this.checkSuccess(has, id);
  }

  async destroy(id) {
    const done = topicsCache.delete(id);
    return this.checkSuccess(done, id);
  }

  checkSuccess(result, id = null) {
    if (!result) {
      this.ctx.throw(404, 'Not Found', { data: id });
    }
    return result;
  }
}

module.exports = TopicsService;
