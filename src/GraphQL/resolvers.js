import { productDAO } from "../dao/product/index.js"
import userService from "../public/users.js"
const resolverrs={
    Query:{
        hello: () => "Si lo Ve, Funciona",
        getAllPokemons: async()=>{
            let pokemons = await productDAO.getAll()
            console.log(pokemons)
            return pokemons
        }
    },
    Mutation:{
        addPokemon: async(_,args)=>{
            let result = await productDAO.addItem(args)
            console.log(result)
            return result
            
        },
        createUser: async(_,args)=>{
            let result=await userService.create(args)
            return result
        }
    }

}
export default resolverrs