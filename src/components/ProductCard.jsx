import React from 'react'

function ProductCard({ product, onAddToCart }) {
  return (
    <article className="product-card">
      <h2>{product?.name ?? 'Nombre del producto'}</h2>
      <p>{product?.description ?? 'Descripción breve del producto.'}</p>
      <div className="product-card-actions">
        <span>{product?.price ? `$${product.price}` : 'Precio no disponible'}</span>
        <button type="button" onClick={onAddToCart}>
          Añadir al carrito
        </button>
      </div>
    </article>
  )
}

export default ProductCard
