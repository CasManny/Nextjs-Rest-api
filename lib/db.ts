import mongoose from "mongoose";

const MONGODB_URL = process.env.MONGODB_URL

export const connect = async () => {
    const connectionState = mongoose.connection.readyState
    if (connectionState === 1) {
        console.log('Already connected');
        return;
    } 

    if (connectionState === 2) {
        console.log('connecting...');
        return;
    }

    try {
        mongoose.connect(MONGODB_URL!, {
            dbName: 'nextjsrestapi',
            bufferCommands: true
        }) 
        console.log('connected');
        
    } catch (error: any) {
        console.log("Error", error)
        throw new Error('Error', error)
    }
}

