import {Router} from 'express'
const router = Router()
import {cartsController} from '../controllers/carts.controller.js'


// Get Cart by ID
router.get('/:cid', cartsController.getPersonalCartById)
// Get Cart Product List
router.get('/:cid/products', cartsController.getAllProductListByPersonalCartId)
// Add Product to Cart
router.put('/:cid/products', cartsController.addProductToPersonalCart)          
// Delete Product from Cart
router.delete('/:cid/products/:pid', cartsController.deleteProductToPersonalCartById)






export default router; 