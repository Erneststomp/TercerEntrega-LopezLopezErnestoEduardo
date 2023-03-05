import {Router} from 'express'
const router = Router()
import {cartsController} from '../controllers/carts.controller.js'

// Get Cart List
router.get('/', cartsController.getcartList)
// router.get('/', async(req,res)=>{
//     let carts=cartsController.getcartList
//     console.log(carts)
//     res.render('carts.handlebars',{carts:carts})

// })
// Get Cart by ID
router.get('/:cid', cartsController.getCartById)

// Get Cart Product List
router.get('/:cid/products', cartsController.getAllProductListByCartId)
// Create New Cart
router.post('/', cartsController.addNewCart)
// Add Product to Cart
router.put('/:cid/products', cartsController.addProductToCart)          
// Delete Product from Cart
router.delete('/:cid/products/:pid', cartsController.deleteProductToCartById)
// Delete Card by ID
router.delete('/:cid', cartsController.deleteCartById)


export default router;   