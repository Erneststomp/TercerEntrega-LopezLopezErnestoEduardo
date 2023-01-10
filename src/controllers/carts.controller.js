import {cartDAO} from '../dao/cart/index.js'
import {productDAO} from '../dao/product/index.js'

export const cartsController = {

  getcartList: async (req, res) => {
    try {
      const allCarts = await cartDAO.getAll()
      console.log(allCarts,proto)
      res.json(allCarts)
    } catch (error) {
      console.warn({class:`cartsController`,method:`getcartList: async (req, res)`,description: error})
    }
  },

  getCartById: async (req, res) => {
    try {
      const cartId = parseInt(req.params.id)
      const cartFound = await cartDAO.getById(cartId)

      if (!cartFound) {
        res.send({ description: 'Cart not found.' })
      } else {
        res.json(cartFound)
      }
    } catch (error) {
      console.warn({class:`cartsController`,method:`getCartById: async (req, res)`,description: error})
    }
  },

  getAllProductListByCartId: async (req, res) => {
    try {
      const cartId = parseInt(req.params.cid)
      let cartFound = await cartDAO.getById(cartId)
      const productFound  = await productDAO.getAll()

      if (!cartFound) {
        return res.status(422).json({ description: 'Cart not found.' })
      } else if (!cartFound.products ) {
        return res.status(200).json({description:`Cart found, content 0 products.`,data:[]})
      }
      else {
        cartFound.products = cartFound.products.map( item => {
          let productItem = productFound.find( product => product.id === item.id )
          const editproductItem = {
            id:  productItem.id,
            timestamp:productItem.timestamp,
            name: productItem.name ? productItem.name : 'No name',
            description: productItem.description ? productItem.description : 'No description',
            code: productItem.code ? productItem.code : 'No code',
            thumbnail: productItem.thumbnail ? productItem.thumbnail : 'no Image',
            price: productItem.price ? parseInt( productItem.price ) : 0,
            stock: productItem.stock ? parseInt( productItem.stock ) : 0
          }

          return productItem ? {...editproductItem, quantity: item.quantity} : item

    })
        return res.status(200).json({description:`Cart found, content ${cartFound.products.length} products.`,data:cartFound.products})
      }
    } catch (error) {
        console.warn({class:`cartsController`,method:`getAllProductListToByCartId: async (req, res)`,description: error})
        res.status(500).json({description: `Internal Server Error,please contact administrator `})
    }
  },
  addNewCart: async (req, res) => {
    try {
      
      const allCarts = await cartDAO.getAll()
      const getNewId = () => {
        let lastID = 0
        if (allCarts && allCarts.length) {
          lastID = allCarts[allCarts.length - 1].id
        }
        return Number(lastID) + 1
      }

      const newCart = {
        id: getNewId(),
        timestamp:Date.now(),
        products: [],
      }
      await cartDAO.addItem(newCart)
      res.status(200).json({description:`new cart successfully created with id=${newCart.id}`,data:newCart})

    } catch (error) {
      console.warn({class:`cartsController`,method:`addNewCart: async (req, res)`,description: error})
      res.status(500).json({description: `Internal Server Error,please contact administrator `})
    }
  },
  
  addProductToCart: async (req, res) => {
    try {
      const cId = parseInt(req.params.cid)
      console.log('CID')
      console.log(cId)
      const pId = parseInt(req.body.pid)
      console.log("PID")
      console.log(pId)
      const pquantity =  req.body.quantity ? parseInt(req.body.quantity) : 1

      const cartFound = await cartDAO.getById(cId)
      if(!cartFound){
        return res.status(422).json({ description: `Cart ${pId} not found.` })
      }
      
      const productFound = await productDAO.getById(pId)
      console.log('productfound')
      console.log(productFound)
      
      if(!productFound){
        return res.status(422).json({ description: `Product ${pId} not found.` })
      }
      else if(pquantity<1){
        return res.status(422).json({ description: 'Quantity must be greater than 0.' })
      }
      else if (productFound.stock == 0 ){
        return res.status(422).json({ description: `Product stock not found.` })
      }
      else if(productFound.stock < pquantity){
        return res.status(422).json({ description: 'insufficient stock.' })
      } 
      
      const productsInCartsFound = cartFound.products
      const ProductItemInCarts = productsInCartsFound.find(item=> item.id === parseInt(pId))
      console.log('product items in cart')
      console.log(productsInCartsFound)

      if(!ProductItemInCarts){
        console.log('entro')
        const newProduct = {
          id: pId,
          quantity: pquantity,
        }
        console.log(newProduct)
        console.log('paso esto primero')
        console.log('cartfound')
        console.log(cartFound)
        cartFound.products.push(newProduct)
        console.log('cartfound')
        console.log(cartFound)
        await cartDAO.editById(cartFound,cId)
        console.log('paso esto')
        return res.status(200).json({description:`Product ${pId} added to cart ${cId} successfully.`,data:cartFound})
        
      }

      else {

        let { stock, ...itemRest } = productFound;
        stock = stock - pquantity
        itemRest.timestamp = Date.now()
        await productDAO.editById({...itemRest,stock},cId)
        cartFound.timestamp = Date.now()
        cartFound.products = cartFound.products.map( item => item.id !== pId ? item : {...item, quantity: item.quantity + pquantity} )
        await cartDAO.editById(cartFound,cId)

        return res.status(200).json({description: `(${pquantity}) unid(s) of (${productFound.id}) - ${productFound.name} added successfully in Cart.`,data:cartFound})
      }

    }catch (error) {
      console.warn({class:`cartsController`,method:`addProductToCart: async (req, res)`,description: error})
      res.status(500).json({description: `Internal Server Error,please contact administrator `})
    }
  },
  
  deleteProductToCartById: async (req, res) => {
    try {
      const cId = parseInt( req.params.cid )
      const pId = parseInt( req.params.pid )

      const cartFound = await cartDAO.getById(cId)
      if(!cartFound){
        return res.status(422).json({ description: `Cart ${cId} not found.` })
      }

      const productFound = await productDAO.getById(pId)
      if(!productFound){
        return res.status(422).json({ description: `Product ${pId} not found.` })
      }
      else{
        cartFound.timestamp = Date.now()
        cartFound.products = cartFound.products.filter( item => item.id !== pId )
        await cartDAO.editById(cartFound,cId)
        return res.status(200).json({description: `Producto : (${productFound.id}) - ${productFound.name} was removed from your cart.`,data:cartFound})
      }

    } catch (error) {
      console.warn({class:`cartsController`,method:`deleteProductToCartById: async (req, res)`,description: error})
      res.status(500).json({description: `Internal Server Error,please contact administrator `})
    }
  },

  deleteCartById: async (req, res) => {
    try {
      const cartId = parseInt(req.params.cid)
      const cartFound = await cartDAO.getById(cartId)
      if (!cartFound) {
        res.status(422).json({ description: 'Cart not found.' })
      } else {
        await cartDAO.deleteById(cartId)
        res.status(200).json({ description : `The cart with id=${cartId} has been removed.`})
      }
    } catch (error) {
      console.warn({class:`cartsController`,method:`deleteCartById: async (req, res)`,description: error})
      res.status(500).json({description: `Internal Server Error,please contact administrator `})
    }
  }

  // cartProductList: async (req, res) => {
  //   try {

  //     const cartId = req.params.id
  //     const cartFound = await cartDB.getById(cartId)

  //     if (!cartFound) {
  //       res.send({ error: 'Cart not found.' })
  //     } else {
  //       res.json(cartFound.productos)
  //     }
  //   } catch (error) {
  //     console.log(`ERROR: ${error}`)
  //   }
  // },


  // addProductToCartV0: async (req, res) => {
  //   try {
  //     const cartId = req.params.id
  //     const prodId = req.params.id_prod

  //     const cartFound = await cartDB.getById(cartId)
  //     const productFound = await productDB.getById(prodId)

  //     if (!cartFound) {
  //       res.send({ error: 'Cart not found.' })
  //     } else if (!productFound) {
  //       res.send({ error: 'Product not found.' })
  //     } else {
  //       await cartDB.addItemInto(cartFound.id, productFound)
  //       const updatedCart = await cartDB.getById(cartId)
  //       res.json(updatedCart)
  //     }
  //   } catch (error) {
  //     console.log(`ERROR: ${error}`)
  //   }
  // },


}

export default cartsController
