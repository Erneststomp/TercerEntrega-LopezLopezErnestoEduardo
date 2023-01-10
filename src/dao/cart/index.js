let cartDAO


switch ('firebase') {    
    case 'mongodb':
        const { default: CartDAOMongoDB } = await import('./MongoDB.js')
        cartDAO = new CartDAOMongoDB()
        console.log('Set MongoDB as Database for Carts!')
        break
    case 'firebase':
        const { default: CartDAOFirebase } = await import('./Firebase.js')
        cartDAO = new CartDAOFirebase()
        console.log('Set Firebase as Database for Carts!')
        break
}

export { cartDAO }
