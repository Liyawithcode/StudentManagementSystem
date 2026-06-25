export class BaseService {
  constructor(model) {
    this.model = model;
  }

  async findOne(query, selectFields = "") {
    let q = this.model.findOne(query);
    if (selectFields) {
      q = q.select(selectFields);
    }
    return await q;
  }

  async findById(id) {
    return await this.model.findById(id);
  }

  async create(data) {
    return await this.model.create(data);
  }

  async find(query = {}) {
    return await this.model.find(query);
  }

  async findOneAndUpdate(query, updateData, options = { new: true }) {
    return await this.model.findOneAndUpdate(
      query,
      { $set: updateData },
      options
    );
  }

  async findOneAndDelete(query) {
    return await this.model.findOneAndDelete(query);
  }

  async findByIdAndUpdate(id, updateData, options = { new: true }) {
    return await this.model.findByIdAndUpdate(
      id,
      { $set: updateData },
      options
    );
  }

  async findByIdAndDelete(id) {
    return await this.model.findByIdAndDelete(id);
  }
}
