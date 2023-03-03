import MongoDBContainer from '../../middleware/api/MongoDBContainer.js'

export class CartDAOMongoDB extends MongoDBContainer {
    constructor() {
        super('cartsPersonal', {
            id: { type: String, required: true },
            timestamp: {type: Number, required: true },
            products: { type: Array, required: false },
        })
    }
}

export default CartDAOMongoDB