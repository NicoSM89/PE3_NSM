import { ProductsModel } from "../models/products.model.js"

export class Producto {
  constructor(title, description, price, code, stock, status, category, thunbnail) {
    this.title = title;
    this.description = description;
    this.price = price;
    this.code = code;
    this.stock = stock;
    this.status = status;
    this.category = category;
    this.thunbnail = thunbnail;
  }
}

export class ProductMongoManager {
  async getProducts(limit = 10, page = 1, query = '', sort = '') {
    try {
      const [code, value] = query.split(':');
      const parseProductos = await ProductsModel.paginate({[code] : value}, {
        limit,
        page,
        sort : sort ? {price: sort} : {}
      });
      parseProductos.payload = parseProductos.docs;
      delete parseProductos.docs;
      return {message: "OK" , ...parseProductos}
    } catch (e) {
      return {message: "ERROR" , rdo: "There are no products"}
   }
  }

  async getProductById(id) {
    try
    {
      const prod=await ProductModel.findOne({_id: id})
      if (prod) 
        return {message: "OK" , rdo: prod}
      else 
        return {message: "ERROR" , rdo: "The product does not exist"}
    } 
    catch (e) {
      return {message: "ERROR" , rdo: "Error obtaining the product - " + e.message}
   }
  }

  async addProduct(producto) {
    try {
      let prod = []
      //Validacion de los campos
      const validacion = !producto.title || !producto.description || !producto.price || !producto.code || !producto.stock || !producto.status || !producto.category ? false : true;

      if (!validacion)
        return {message: "ERROR" , rdo: "Data is missing in the product to be entered!"}

      const resultado = await this.getProducts();
      if (resultado.message === "OK")
        prod = resultado.rdo.find((e) => e.code === producto.code);
      else
        return {message: "ERROR" , rdo: "Products could not be obtained"}

      if (prod)
        return {message: "ERROR" , rdo: "Product with code Existing existing!"}
      const added = await ProductModel.create(producto)  
      return {message: "OK" , rdo: "Product registered correctly"}
    } 
    catch (e) {
      return {message: "ERROR" , rdo: "Error adding product - " + e.message}
    }
  }

  async updateProduct(id, updateProduct) {
    try {
      const update = await ProductModel.updateOne({_id: id}, updateProduct)

      if (update.modifiedCount>0)
        return {message: "OK" , rdo: `Producto con ID ${id} successfully updated.`}
      return {message: "ERROR" , rdo: `No product found with the ID ${id}. Could not update.`}
    } 
    catch (e) {
      return {message: "ERROR" , rdo: "Error when updating the product - "+ e.message}
    }
  }

  async deleteProduct(id) {
    try {
      const deleted = await ProductModel.deleteOne({_id: id})

      if (deleted.deletedCount === 0){
        return {message: "ERROR" , rdo: `No product found with the ID ${id}. Could not delete.`}
      }

      return {message: "OK" , rdo: `Product with ID ${id} successfully removed.`}
    } 
    catch (e) {
      return {message: "ERROR" , rdo: "Error when deleting the product - "+ e.message}
    }
  }
}
