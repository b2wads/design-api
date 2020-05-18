const supertest = require('supertest')
const Categories = require('../../models/categories')
const Products = require('../../models/products')
const app = supertest(require('../../app'))

describe('[Acceptance] Products V1', () => {
  let res
  describe('GET /v1/products', () => {
    const categoriesFixtures = [{ id: 1, name: 'Móveis' }, { id: 2, name: 'Informática' }]

    const productsFixtures = [
      { id: 1, name: 'Armário', price: 150.0, category_id: 1 },
      { id: 2, name: 'Cadeira', price: 200.0, category_id: 1 },
      { id: 3, name: 'Mesa', price: 350.0, category_id: 1 },

      { id: 4, name: 'Monitor', price: 250.0, category_id: 2 },
      { id: 5, name: 'Mouse', price: 80.0, category_id: 2 },
      { id: 6, name: 'Teclado', price: 100.0, category_id: 2 }
    ]

    before(async () => {
      await Products.truncate()
      await Categories.truncate()
      await Categories.bulkCreate(categoriesFixtures)
      await Products.bulkCreate(productsFixtures)
    })

    after(async () => {
      await Products.truncate()
      await Categories.truncate()
    })

    context('without params', () => {
      before(async () => {
        res = await app.get('/v1/products')
      })

      it('should return status 200 (OK)', () => {
        expect(res.status).to.be.eql(200)
      })

      it('should return list of products', () => {
        const { _meta, data } = res.body
        expect(_meta).to.have.property('count', productsFixtures.length)
        expect(data).to.be.eql(productsFixtures)
      })

      it('should default limit be 10', () => {
        const { _meta } = res.body
        expect(_meta).to.have.property('limit', 10)
      })

      it('should default offset be 0', () => {
        const { _meta } = res.body
        expect(_meta).to.have.property('offset', 0)
      })

      it('should default sort by id with order ASC', () => {
        const { _meta, data } = res.body
        expect(_meta).to.have.property('sort', 'id')
        expect(_meta).to.have.property('order', 'ASC')
        expect(data[0]).to.be.eql(productsFixtures[0])
        expect(data[5]).to.be.eql(productsFixtures[5])
      })
    })

    context('with params', () => {
      context('pagination', () => {
        context('when use limit', () => {
          before(async () => {
            res = await app.get('/v1/products').query({ limit: 3 })
          })

          it('should limit results', () => {
            const { _meta, data } = res.body
            expect(_meta).to.have.property('count', productsFixtures.length)
            expect(_meta).to.have.property('limit', 3)
            expect(data).to.be.eql([productsFixtures[0], productsFixtures[1], productsFixtures[2]])
          })
        })

        context('when use offset', () => {
          before(async () => {
            res = await app.get('/v1/products').query({ offset: 3 })
          })

          it('should start from offset', () => {
            const { _meta, data } = res.body
            expect(_meta).to.have.property('count', productsFixtures.length)
            expect(_meta).to.have.property('offset', 3)
            expect(data).to.be.eql([productsFixtures[3], productsFixtures[4], productsFixtures[5]])
          })
        })
      })
      context('sorting', () => {
        context('when sort by id:asc', () => {
          before(async () => {
            res = await app.get('/v1/products').query({ sort: 'id', order: 'asc' })
          })

          it('should return products ordered by id:asc', () => {
            const { _meta, data } = res.body
            expect(_meta).to.have.property('sort', 'id')
            expect(_meta).to.have.property('order', 'ASC')
            expect(data[0]).to.be.eql(productsFixtures[0])
            expect(data[5]).to.be.eql(productsFixtures[5])
          })
        })

        context('when sort by id:desc', () => {
          before(async () => {
            res = await app.get('/v1/products').query({ sort: 'id', order: 'desc' })
          })

          it('should return products ordered by id:desc', () => {
            const { _meta, data } = res.body
            expect(_meta).to.have.property('sort', 'id')
            expect(_meta).to.have.property('order', 'DESC')
            expect(data[0]).to.be.eql(productsFixtures[5])
            expect(data[5]).to.be.eql(productsFixtures[0])
          })
        })

        context('when sort by name:asc', () => {
          before(async () => {
            res = await app.get('/v1/products').query({ sort: 'name', order: 'asc' })
          })

          it('should return products ordered by name:asc', () => {
            const { _meta, data } = res.body
            expect(_meta).to.have.property('sort', 'name')
            expect(_meta).to.have.property('order', 'ASC')
            expect(data[0]).to.be.eql(productsFixtures[0])
            expect(data[5]).to.be.eql(productsFixtures[5])
          })
        })

        context('when sort by name:desc', () => {
          before(async () => {
            res = await app.get('/v1/products').query({ sort: 'name', order: 'desc' })
          })

          it('should return products ordered by name:asc', () => {
            const { _meta, data } = res.body
            expect(_meta).to.have.property('sort', 'name')
            expect(_meta).to.have.property('order', 'DESC')
            expect(data[0]).to.be.eql(productsFixtures[5])
            expect(data[5]).to.be.eql(productsFixtures[0])
          })
        })

        context('when sort by price:asc', () => {
          before(async () => {
            res = await app.get('/v1/products').query({ sort: 'price', order: 'asc' })
          })

          it('should return products ordered by price:asc', () => {
            const { _meta, data } = res.body
            expect(_meta).to.have.property('sort', 'price')
            expect(_meta).to.have.property('order', 'ASC')
            expect(data[0]).to.be.eql(productsFixtures[4])
            expect(data[5]).to.be.eql(productsFixtures[2])
          })
        })

        context('when sort by price:desc', () => {
          before(async () => {
            res = await app.get('/v1/products').query({ sort: 'price', order: 'desc' })
          })

          it('should return products ordered by price:asc', () => {
            const { _meta, data } = res.body
            expect(_meta).to.have.property('sort', 'price')
            expect(_meta).to.have.property('order', 'DESC')
            expect(data[0]).to.be.eql(productsFixtures[2])
            expect(data[5]).to.be.eql(productsFixtures[4])
          })
        })

        context('when sort is invalid', () => {
          before(async () => {
            res = await app.get('/v1/products').query({ sort: 'not_a_field' })
          })
          it('should return status 422 (Unprocessable Entity)', () => {
            expect(res.status).to.be.eql(422)
          })

          it('should return error message', () => {
            expect(res.body).to.be.eql({
              error: 'ValidationError',
              message: 'Field sort must be id|name|price'
            })
          })
        })

        context('when order is invalid', () => {
          before(async () => {
            res = await app.get('/v1/products').query({ order: 'foo-bar-def' })
          })
          it('should return status 422 (Unprocessable Entity)', () => {
            expect(res.status).to.be.eql(422)
          })

          it('should return error message', () => {
            expect(res.body).to.be.eql({
              error: 'ValidationError',
              message: 'Field order must be ASC|DESC'
            })
          })
        })
      })
      context('filters', () => {
        context('when filter by name', () => {
          before(async () => {
            res = await app.get('/v1/products').query({ name: 'Mesa' })
          })

          it('should return with exact name', () => {
            const { _meta, data } = res.body
            expect(_meta).to.have.property('count', 1)
            expect(data).to.be.eql([{ id: 3, name: 'Mesa', price: 350.0, category_id: 1 }])
          })
        })

        context('when filter by name__contains', () => {
          before(async () => {
            res = await app.get('/v1/products').query({ name__contains: 'Mo' })
          })

          it('should return with partial name matching', () => {
            const { _meta, data } = res.body
            expect(_meta).to.have.property('count', 2)
            expect(data).to.be.eql([
              { id: 4, name: 'Monitor', price: 250.0, category_id: 2 },
              { id: 5, name: 'Mouse', price: 80.0, category_id: 2 }
            ])
          })
        })

        context('when filter by price', () => {
          before(async () => {
            res = await app.get('/v1/products').query({ price: 100 })
          })

          it('should return with exact price', () => {
            const { _meta, data } = res.body
            expect(_meta).to.have.property('count', 1)
            expect(data).to.be.eql([{ id: 6, name: 'Teclado', price: 100.0, category_id: 2 }])
          })
        })

        context('when filter by price__gte', () => {
          before(async () => {
            res = await app.get('/v1/products').query({ price__gte: 200 })
          })

          it('should return with price great then or equal', () => {
            const { _meta, data } = res.body
            expect(_meta).to.have.property('count', 3)
            expect(data).to.be.eql([
              { id: 2, name: 'Cadeira', price: 200.0, category_id: 1 },
              { id: 3, name: 'Mesa', price: 350.0, category_id: 1 },
              { id: 4, name: 'Monitor', price: 250.0, category_id: 2 }
            ])
          })
        })

        context('when filter by price__lte', () => {
          before(async () => {
            res = await app.get('/v1/products').query({ price__lte: 100 })
          })

          it('should return with price less then or equal', () => {
            const { _meta, data } = res.body
            expect(_meta).to.have.property('count', 2)
            expect(data).to.be.eql([
              { id: 5, name: 'Mouse', price: 80.0, category_id: 2 },
              { id: 6, name: 'Teclado', price: 100.0, category_id: 2 }
            ])
          })
        })
      })
    })
  })

  describe('GET /products/:id', () => {
    const categoryFixture = { id: 1, name: 'Games' }
    const productFixture = { id: 1, name: 'GTA V', price: 150.0, category_id: 1 }

    before(async () => {
      await Products.truncate()
      await Categories.truncate()
      await Categories.create(categoryFixture)
      await Products.create(productFixture)
    })

    after(async () => {
      await Products.truncate()
      await Categories.truncate()
    })

    context('when product exists', () => {
      before(async () => {
        res = await app.get(`/products/${productFixture.id}`)
      })

      it('should return status 200 (Ok)', () => {
        expect(res.status).to.be.eql(200)
      })

      it('should return matching product', () => {
        expect(res.body).to.be.eql(productFixture)
      })
    })
    context('when product not exists', () => {
      before(async () => {
        res = await app.get('/products/99999999')
      })

      it('should return status 404 (Not Found)', () => {
        expect(res.status).to.be.eql(404)
      })

      it('should return error message', () => {
        expect(res.body).to.be.eql({
          error: 'NotFoundError',
          message: 'Product 99999999 not found'
        })
      })
    })
  })
})
