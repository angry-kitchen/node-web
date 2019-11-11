'use strict';

const Controller = require('egg').Controller;

const createRule = {
  accesstoken: 'string',
  title: 'string',
  tab: { type: 'enum', values: [ 'ask', 'share', 'job' ], required: false },
  content: 'string',
};

class TopicsController extends Controller {
  async create() {
    const ctx = this.ctx;
    // 校验 `ctx.request.body` 是否符合我们预期的格式
    // 如果参数校验未通过，将会抛出一个 status = 422 的异常
    ctx.validate(createRule, ctx.request.body);
    // 调用 service 创建一个 topic
    const id = await ctx.service.topics.create(ctx.request.body);
    // 设置响应体和状态码
    ctx.body = {
      topic_id: id,
    };
    ctx.status = 201;
  }

  async index() {
    const ctx = this.ctx;
    const list = await ctx.service.topics.index();
    ctx.body = list;
    ctx.status = 200;
  }

  async show() {
    const ctx = this.ctx;
    const id = Number(ctx.params.id);
    const topic = await ctx.service.topics.show(id);
    ctx.body = topic;
    ctx.status = 200;
  }

  async update() {
    const ctx = this.ctx;
    ctx.validate(createRule, ctx.request.body);
    const id = Number(ctx.params.id);
    await ctx.service.topics.update(id, ctx.request.body);
    ctx.status = 204;
  }

  async destroy() {
    const ctx = this.ctx;
    const id = Number(ctx.params.id);
    await ctx.service.topics.destroy(id);
    ctx.status = 204;
  }
}

module.exports = TopicsController;
