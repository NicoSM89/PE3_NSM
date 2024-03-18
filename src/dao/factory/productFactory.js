import config from "../../configs/config.js";

let Products;

switch (config.persistence) {

    case 'MEMORY':
        const {default : ProductMemory} = await import ('../memory/products.memory.js');
        Products = ProductMemory;
    break;
}

export default Products;