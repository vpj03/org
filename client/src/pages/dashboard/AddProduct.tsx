import React from 'react';
import ProductForm from '../../components/ProductForm';

const AddProduct: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">Add New Product</h1>
      <ProductForm />
    </div>
  );
};

export default AddProduct;