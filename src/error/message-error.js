export const generateUserErrorInfo = (user) => {
    return `
      Una o mas propiedades estan incompletas o invalidas!!!
      Lista de propiedades obligatgorias:
          * first_name: Must be a string. (${user.first_name})
          * last_name: Must be a string. (${user.last_name})
          * email: Must be a string. (${user.email})    
      `;
};

export const generateProductErrorInfo = (product) => {
    return `
      Una o mas propiedades estan incompletas o invalidas!!!
      Lista de propiedades obligatgorias:
          * title: Must be a string. (${product.title})
          * description: Must be a string. (${product.description})
          * price: Must be a number. (${product.price})    
          * thumbnail: Must be a string. (${product.thumbnail})
          * code: Must be a string. (${product.code})
          * stock: Must be a number. (${product.stock})    
          * status: Must be a boolean. (${product.status})
          * category: Must be a string. (${product.category})    
      `;
};
export const updateProductErrorInfo = (product) => {
    return `
      Una o mas propiedades estan incompletas o invalidas!!!
      Lista de propiedades obligatgorias:
          * title: Must be a string. (${product.title})
          * description: Must be a string. (${product.description})
          * price: Must be a number. (${product.price})    
          * thumbnail: Must be a string. (${product.thumbnail})
          * code: Must be a string. (${product.code})
          * stock: Must be a number. (${product.stock})    
          * status: Must be a boolean. (${product.status})
          * category: Must be a string. (${product.category})    
      `;
};

export const updateProductErrorId = (id) => {
    return `
      Una o mas propiedades estan incompletas o invalidas!!!
      Lista de propiedades obligatgorias:
          * ID: Must be a string. (${id})   
      `;
};

export const errorId = (id) => {
    return `
      ID: ${id} no existe!!   
      `;
};

export const getCartById = (id) => {
    return `
      Dose't exist any Cart with ID:${id}  
      `;
};

export const getProductById = (id) => {
    return `
      Dose't exist any Product with ID:${id}  
      `;
};
