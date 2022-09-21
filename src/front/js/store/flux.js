const getState = ({ getStore, getActions, setStore }) => {
  return {
    store: {
      message: null,
      backendUrl: process.env.BACKEND_URL,
      products: [],
    },
    actions: {
      uploadImg: async (product) => {
        const store = getStore();
        try {
          const response = await fetch(`${store.backendUrl}/products`, {
            method: "POST",
            mode: "no-cors",
            body: product,
          });
          getActions().getProducts();
        } catch (error) {
          console.log("getProduct Error", error);
        }
      },
      getProducts: async () => {
        const store = getStore();
        try {
          const response = await fetch(`${store.backendUrl}/products`);
          const data = await response.json();
          if (!response.ok) {
            throw new Error("getProduct error");
          }
          setStore({
            ...store,
            products: data,
          });
        } catch (error) {
          console.log("getProduct Error", error);
        }
      },
      deleteProduct: async (product_id) => {
        const store = getStore();
        try {
          const response = await fetch(
            `${store.backendUrl}/products/${product_id}`,
            {
              method: "DELETE",
            }
          );
          console.log(response);
          getActions().getProducts();
        } catch (error) {
          console.log("deleteProduct error", error);
        }
      },
    },
  };
};

export default getState;
