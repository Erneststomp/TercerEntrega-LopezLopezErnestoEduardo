
const socket=io(
    {autoConnect:false}
);
socket.connect();
const ToCart = document.getElementById('gotoCarts')
ToCart.addEventListener('click',evt=>{
    socket.emit('cartsredirect')
})

socket.on('cartredirect', destination=> {
    console.log(destination)
    window.location.href = destination;

});


const viewpokemon = document.getElementById('viewthispokemon')
const idpokemon=document.getElementById("numero").value
viewpokemon.addEventListener('click',evt=>{
    socket.emit('thispokemonredirect',{id:idpokemon})
})

socket.on('pokemonredirect', destination=> {
    console.log(destination)
    window.location.href = destination;

});




 