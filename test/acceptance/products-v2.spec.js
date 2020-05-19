const supertest = require('supertest')
const Categories = require('../../models/categories')
const Products = require('../../models/products')
const app = supertest(require('../../app'))

describe('[Acceptance] Products V2', () => {
  let res

  describe('POST /v2/products', () => {
    const categoryFixture = { id: 1, name: 'Tecnologia' }

    before(async () => {
      await Promise.all([Products.truncate(), Categories.truncate()])
      await Categories.create(categoryFixture)
    })

    after(async () => {
      await Categories.truncate()
    })

    context('when all fields was given', () => {
      const fixture = { id: 1, name: 'Notebook', price: 3000.0, category_id: 1 }

      before(async () => {
        res = await app.post('/v2/products').send(fixture)
      })

      after(async () => {
        await Products.truncate()
      })

      it('should return 201 (Created)', () => {
        expect(res.status).to.be.eql(201)
      })

      it('should return created product', () => {
        expect(res.body).to.be.eql(fixture)
      })
    })

    context('when name is missing', () => {
      before(async () => {
        res = await app.post('/v2/products').send({ name: '' })
      })

      it('should return 422 (Unprocessable Entity)', () => {
        expect(res.status).to.be.eql(422)
      })

      it('should return error message', () => {
        expect(res.body).to.be.eql({
          error: 'ValidationError',
          message: 'Field name is required'
        })
      })
    })

    context('when price is missing', () => {
      before(async () => {
        res = await app.post('/v2/products').send({ name: 'Notebook', price: undefined })
      })

      it('should return 422 (Unprocessable Entity)', () => {
        expect(res.status).to.be.eql(422)
      })

      it('should return error message', () => {
        expect(res.body).to.be.eql({
          error: 'ValidationError',
          message: 'Field price is required'
        })
      })
    })

    context('when category_id is missing', () => {
      before(async () => {
        res = await app.post('/v2/products').send({ name: 'Notebook', price: 1000.0, category_id: undefined })
      })

      it('should return 422 (Unprocessable Entity)', () => {
        expect(res.status).to.be.eql(422)
      })

      it('should return error message', () => {
        expect(res.body).to.be.eql({
          error: 'ValidationError',
          message: 'Field category_id is required'
        })
      })
    })
  })

  describe('PUT /v2/products/:id', () => {
    let dbProduct
    const oldFixture = { id: 1, name: 'Mouse Gamer', price: 1000.0, category_id: 1 }
    const newFixture = { price: 100.0 }

    before(async () => {
      await Products.create(oldFixture)
    })

    after(async () => {
      await Products.truncate()
    })

    context('when product exists', () => {
      before(async () => {
        res = await app.put(`/v2/products/${oldFixture.id}`).send(newFixture)
        dbProduct = await Products.findByPk(oldFixture.id)
      })

      it('should return status 200 (Ok)', () => {
        expect(res.status).to.be.eql(200)
      })

      it('should return updated product', () => {
        expect(res.body).to.have.property('id', oldFixture.id)
        expect(res.body).to.have.property('price', newFixture.price)
      })

      it('should update product in database', () => {
        expect(dbProduct).to.have.property('id', oldFixture.id)
        expect(parseFloat(dbProduct.price)).to.be.eql(newFixture.price)
      })
    })
    context('when product not exists', () => {
      before(async () => {
        res = await app.put('/v2/products/99999999').send({ name: 'new name' })
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

    context('when name is empty', () => {
      before(async () => {
        res = await app.put(`/v2/products/${oldFixture.id}`).send({ name: '' })
      })

      it('should return 422 (Unprocessable Entity)', () => {
        expect(res.status).to.be.eql(422)
      })

      it('should return error message', () => {
        expect(res.body).to.be.eql({
          error: 'ValidationError',
          message: 'Field name is required'
        })
      })
    })
  })

  describe('DELETE /v2/products/:id', () => {
    let dbProduct
    const fixture = { id: 1, name: 'Teclado', price: 140.0, category_id: 1 }

    before(async () => {
      await Products.create(fixture)
    })

    context('when product exists', () => {
      before(async () => {
        res = await app.delete(`/v2/products/${fixture.id}`)
        dbProduct = await Products.findByPk(fixture.id)
      })

      it('should return status 204 (No Content)', () => {
        expect(res.status).to.be.eql(204)
      })

      it('should return empty body', () => {
        expect(res.body).to.be.eql({})
      })

      it('should not find product in database', () => {
        expect(dbProduct).to.be.null
      })
    })
    context('when product not exists', () => {
      before(async () => {
        res = await app.delete('/v2/products/99999999')
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
