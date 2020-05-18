const Products = require('../models/products')

const NotFoundError = require('../errors/not-found-error')
const ValidationError = require('../errors/validation-error')

/**
 * @typedef { Object } Product
 * @property { Number } id
 * @property { String } name
 * @property { Number } price
 * @property { Number } category_id
 */

module.exports = {
  /**
   * Extrai dados do modelo de produto
   * @param { Object }
   * @returns { Product }
   */
  serialize(data) {
    return { id: data.id, name: data.name, price: parseFloat(data.price), category_id: data.category_id }
  },

  /**
   * Busca todas os produtos
   */
  async list(filters, { limit = 10, offset = 0, sort = 'id', order = 'ASC' }) {
    /** implementar ordenação */
    /** implementar paginação */
    /** implementar filtros */
    const products = await Products.findAll()
    /** retornar dados paginados */
    return products
  },

  /**
   * Busca Produto por id
   * @param { Number } id
   * @returns { Promise<Product> }
   * @throws { NotFoundError }
   */
  async getById(id) {
    /** buscar produto no modelo com o método Products.findByPk */
    /** disparar erro quando não encontrado */
    /** retornar produto encontrado serializado  */
  }
}
