import MessageModel from "../models/messages.models.js"

export class Message {
  constructor(user, message) {
    this.user = user
    this.message = message
  }
}

export class MessageMongoManager {
  async getMessages() {
    try {
      const parseMessages = await MessageModel.find().lean()
      return {message: "OK" , rdo: parseMessages}
    } 
    catch (e) {
      return {message: "ERROR" , rdo: "No messages"}
    }
  }

  async addMessage(mensaje){
    try{
      const validacion = !mensaje.user || !mensaje.message ? false : true
      if (!validacion)
        return {message: "ERROR" , rdo: "Data is missing from the message"}

        const added = await MessageModel.create(mensaje)
        return {message: "OK" , rdo: "Message successfully registered"}
    }
    catch (err) {
      res.status(400).json({ message: "Error when registering the message - " + err.menssage })
    }
  }

  async deleteMessage(id) {
    try {
      const deleted = await MessageModel.deleteOne({_id: id})

      if (deleted.deletedCount === 0){
        return {message: "ERROR" , rdo: `do not foun the with the ID ${id}. Could not delete.`}
      }

      return {message: "OK" , rdo: `Menssage with ID ${id} successfully removed.`}
    } 
    catch (e) {
      return {message: "ERROR" , rdo: "Error when deleting message - "+ e.message}
    }
  }
}


