const getState = ({ getStore, getActions, setStore }) => {
  return {
    store: {
      message: null,
      backendUrl: process.env.BACKEND_URL,
    },
    actions: {
      // Use getActions to call a function within a fuction
      exampleFunction: () => {
        getActions().changeColor(0, "green");
      },

      getMessage: async () => {
        const store = getStore();
        try {
          // fetching data from the backend
          const resp = await fetch(`${store.backendUrl}/hello`);
          const data = await resp.json();
          setStore({ message: data.message });
          // don't forget to return something, that is how the async resolves
          return data;
        } catch (error) {
          console.log("Error loading message from backend", error);
        }
      },
      changeColor: (index, color) => {
        //get the store
        const store = getStore();

        //we have to loop the entire demo array to look for the respective index
        //and change its color
        const demo = store.demo.map((elm, i) => {
          if (i === index) elm.background = color;
          return elm;
        });

        //reset the global store
        setStore({ demo: demo });
      },
      uploadImg: async (product) => {
        const store = getStore();
        try {
          const response = await fetch(`${store.backendUrl}/products`, {
            method: "POST",
            mode: "no-cors",
            body: product,
          });
          console.log(response);
        } catch (error) {
          console.log("Error:", error);
        }
      },
    },
  };
};

export default getState;
