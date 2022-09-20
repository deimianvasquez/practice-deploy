import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";

import { Context } from "../store/appContext";

export const Demo = () => {
  const { store, actions } = useContext(Context);
  const [imageFile, setImageFile] = useState();
  const [imageName, setImageName] = useState("");

  const handleSubmit = () => {
    const formData = new FormData();
    formData.append("file", imageFile);
    formData.append("name", imageName);
    actions.uploadImg(formData);
  };

  useEffect(() => {
    if (store.products && store.products.length > 0) return;
    actions.getProducts();
  }, []);

  return (
    <div className="container">
      <div className="my-5">
        <input
          className="input-group my-2"
          type="file"
          name="file"
          onChange={(e) => setImageFile(e.target.files[0])}
          accept=".jpg, .jpeg, .png"
        />
        <input
          className="input-group my-2"
          type="text"
          name="image"
          value={imageName}
          placeholder="nombre de la imagen"
          onChange={(e) => setImageName(e.target.value)}
        />
        <button className="btn btn-primary" onClick={() => handleSubmit()}>
          Subir imagen
        </button>
      </div>

      <div className="row gap-lg-1 justify-content-around">
        {store.products &&
          store.products.map((product) => (
            <div
              className="card p-3 col-5 d-flex flex-column justify-content-between"
              key={product.cloudinary_id}
            >
              <div>
                <img
                  src={product.img_url}
                  alt={`product ${product.name}`}
                  className="w-100"
                />
                {product.name}
              </div>
              <button
                className="btn btn-danger mt-3"
                onClick={() => actions.deleteProduct(product.id)}
              >
                Eliminar
              </button>
            </div>
          ))}
      </div>

      <br />
      <Link to="/">
        <button className="btn btn-primary">Back home</button>
      </Link>
    </div>
  );
};
