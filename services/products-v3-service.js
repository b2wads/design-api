const productsV1service = require('./products-v1-service')
const categoriesService = require('./categories-service')

/**
 * @typedef { Object } Product
 * @property { Number } id
 * @property { String } name
 * @property { Number } price
 * @property { Object } category
 */

module.exports = {
  /**
   * Extrai dados do modelo de produto,
   * fazendo relação com modelo de categorias
   * @param { Object } data
   * @param { Object } category
   * @returns { Product }
   */
  serialize(data, category) {
    return {
      id: data.id,
      name: data.name,
      price: parseFloat(data.price),
      category: {
        id: category.id,
        name: category.name
        /** montar _link utilizando categoriesService.getUrl() */
      }
    }
  },

  /**
   * Busca todas os produtos
   * @returns {Promise<Array<Product>>}
   */
  async list(filters, { limit = 10, offset = 0, sort = 'name', order = 'ASC' }) {
    const result = await productsV1service.list(filters, { limit, offset, sort, order })
    const productsWithRelations = await Promise.all(
      result.data.map(async product => {
        // buscar categoria por product.category_id
        const category = await categoriesService.getById(/** informar id da categoria */)
        // retornar produto com o novo método de serialização
        return this.serialize(/** passar produto e categoria */)
      })
    )
    return { _meta: result._meta, data: productsWithRelations }
  },

  /**
   * Busca Produto por id
   * @param { Number } id
   * @returns { Promise<Product> }
   * @throws { NotFoundError }
   */
  async getById(id) {
    const product = await productsV1service.getById(/** informar id do produto */)
    // buscar categoria por product.category_id
    const category = await categoriesService.getById(/** informar id da categoria */)
    return this.serialize(/** passar produto e categoria */)
  }
}
