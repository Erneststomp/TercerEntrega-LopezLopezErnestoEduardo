let isAdmin=false
import fs from 'fs'

export const login = (req, res) => {
    isAdmin = true
    res.status(200).json({description: 'User logged in'})
    fs.promises.writeFile('./src/public/data/user.json', JSON.stringify(isAdmin, null, '\t'))
}

export const logout = (req, res) => {
    isAdmin = false
    res.status(200).json({description: 'User logged out'})
    fs.promises.writeFile('./src/public/data/user.json', JSON.stringify(isAdmin, null, '\t'))
}

export const adminAuth = async(req, res, next) => {
    const response = await fs.promises.readFile('./src/public/data/user.json','utf-8');
    isAdmin=response
    console.log(isAdmin)
    if (isAdmin=='true') {
    next()
    } else {
    res.status(403).json({error: -1,description: `Route '${req.originalUrl}' method '${req.method}' not authorized.`,})
    }
}


export default login;
