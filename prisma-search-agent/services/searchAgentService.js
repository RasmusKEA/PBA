import prisma from '../db/index.js'; 


async function createSearchAgent(phone, email, name, filter) {
  const createdSearchAgent = await prisma.Agent.create({
    data: {
      phone,
      email,
      name,
      filter,
    },
  });
  return createdSearchAgent;
}

async function getAllSearchAgents() {
  const searchAgents = await prisma.Agent.findMany();
  return searchAgents;
}

function cleanFilter(filter) {
  return Object.keys(filter).reduce((cleanedFilter, key) => {
    const value = filter[key];
    if (value !== '' && value !== undefined && value !== null) {
      cleanedFilter[key] = value;
    }
    return cleanedFilter;
  }, {});
}

function filterProductsForSearchAgents(searchAgents, products) {
  const filteredProductsBySearchAgent = [];

  for (const searchAgent of searchAgents) {
    const filteredProducts = products.filter((product) => {
      for (const [key, value] of Object.entries(searchAgent.filter)) {
        if(!product[key]){
            return false;
        }

        if (Array.isArray(value)) {
            if (!value.includes(product[key])) {
            return false;
          }
        } else if(value?.from && value?.to){
            if(value.from > product[key] && value.to < product[key]){
                return false;
            }
        }else if (product[key] !== value) {
          return false;
        }
      }
      return true;
    });

    if (filteredProducts.length > 0) {
      filteredProductsBySearchAgent.push({ searchAgent, filteredProducts });
    }
  }

  return filteredProductsBySearchAgent;
}

export default {
  createSearchAgent,
  getAllSearchAgents,
  cleanFilter,
  filterProductsForSearchAgents
};