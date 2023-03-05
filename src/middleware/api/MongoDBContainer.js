import mongoose from 'mongoose'
const dbConnection = mongoose.connection
dbConnection.on('error', (error) => console.log(`Connection error: ${error}`))
dbConnection.once('open', () => console.log('Connected to DB!'))


export class MongoDBContainer {
    constructor(collectionName, schema) {
    this.collection = mongoose.model(collectionName, schema)
    }

    getById = async (id) => {
        try {
            const itemFound = await this.collection.findOne({ id: Number(id) },{_id:0})
            return itemFound
        } catch (error) {
            console.warn({class:`class MongoDBContainer`, method:`getById= async(id)`,description:error})
            throw new Error(error);
        }
    }


    getAll = async () =>{
        try {
            const allItems = await this.collection.find({})
            return allItems
        } catch (error) {
            console.warn({class:`class MongoDBContainer`, method:`getAll= async()`,description:error})
            throw new Error(error);
        }
    }



    addItem = async (object)=> {
        try {
            await this.collection.create(object)
        } catch (error) {
            console.warn({class:`class MongoDBContainer`, method:`addItem= async(object)`,description:error})
            throw new Error(error);
        }
    }

    editById = async ({id ,...object}) => {
        try {
            await this.collection.updateOne(
            {
                id: id,
            },
            { $set: object }
            )
        } catch (error) {
            console.warn({class:`class MongoDBContainer`, method:`editById= async(object) `,description:error})
            throw new Error(error);
        }
    }

    deleteById = async (id) => {
    try {
        const itemFound = await this.collection.find({ id: Number(id) })

        if (itemFound && itemFound.length) {
        await this.collection.deleteOne({
            id: id,
        })
        return true
        } else {
            return false
        }
    } catch (error) {
        console.warn({class:`class MongoDBContainer`, method:`deleteById= async(idNumber)`,description:error})
        throw new Error(error);
    }
    }
    deletePersonalById = async (id) => {
        try {
            const itemFound = await this.collection.find({id: id })
    
            if (itemFound && itemFound.length) {
            await this.collection.deleteOne({
                id: id,
            })
            return true
            } else {
                return false
            }
        } catch (error) {
            console.warn({class:`class MongoDBContainer`, method:`deleteById= async(idNumber)`,description:error})
            throw new Error(error);
        }
        }
        getPersonalById = async (id) => {
            try {
                const itemFound = await this.collection.findOne({ id: id })
                return itemFound
            } catch (error) {
                console.warn({class:`class MongoDBContainer`, method:`getById= async(id)`,description:error})
                throw new Error(error);
            }
        }

    deleteAll = async () => {
    try {
        await this.collection.deleteMany({})
    } catch (error) {
        console.warn({class:`class MongoDBContainer`, method:`deleteAll= async()`,description:error})
        throw new Error(error);
    }
    }

    
}

//----------* EXPORTS CLASS *----------//
export default MongoDBContainer
