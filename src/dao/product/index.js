let productDAO

switch ('firebase') {    
    case 'mongodb':
        const { default: ProductDAOMongoDB } = await import('./MongoDB.js')
        productDAO = new ProductDAOMongoDB()
        console.log('Set MongoDB as Database for Products!')
    break
    case 'firebase':
        const { default: ProductDAOFirebase } = await import('./Firebase.js')
        productDAO = new ProductDAOFirebase()
        console.log('Set Firebase as Database for Products!')
    break
}

export { productDAO }
