import React from 'react';
import ProductForm from '../../components/ProductForm';

const EditProduct: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">Edit Product</h1>
      <ProductForm isEdit={true} />
    </div>
  );
};

export default EditProduct;