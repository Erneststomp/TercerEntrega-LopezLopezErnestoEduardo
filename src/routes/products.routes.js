import {Router} from 'express'
const router = new Router()
import {productsController} from '../controllers/products.contoller.js'

// Delete Product List
router.delete('/', productsController.deleteProductList)

// Get Product List & Get Product by ID
router.get('/:pid?', async (req,res)=>{
        if(req.params.pid != undefined) {
            productsController.getProductById(req,res)
        }else{
            productsController.getAllProductList(req,res)
        }
})

// router.get('/', productsController.getAllProductList)

// Add New Product  
router.post('/',productsController.addNewProduct)
// Edit Product by ID
router.put('/:pid' ,productsController.updatetProductById)
// Delete Product by ID
router.delete('/:pid',productsController.deleteProductById)


export default router; 