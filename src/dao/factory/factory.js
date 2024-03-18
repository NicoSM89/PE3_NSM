import mongoose from "mongoose";
import config from "../../config/config.js";

let Contacts;

switch (config.persistence) {
    case 'MONGO':
        const {default : ContactMongo} = await import('../mongo/contacts.mongo.js');
        mongoose.connect('mongodb+srv://nsalamanca:sammy123@cluster0.rwbs3lx.mongodb.net/coder');
        Contacts = ContactMongo;    
        break;

    case 'MEMORY':
        const {default : ContactMemory} = await import ('../memory/contacts.memory.js');
        Contacts = ContactMemory;
    break;
}

export default Contacts;