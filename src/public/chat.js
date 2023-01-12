

const ToCart = document.getElementById('gotoCarts')
ToCart.addEventListener('click',evt=>{
    socket.emit('cartsredirect')
})

socket.on('cartredirect', destination=> {
    console.log(destination)
    window.location.href = destination;

});


const ToProducts = document.getElementById('gotoProducts')
ToProducts.addEventListener('click',evt=>{
    socket.emit('productsredirect')
})

socket.on('productredirect', destination=> {
    console.log(destination)
    window.location.href = destination;

});




 