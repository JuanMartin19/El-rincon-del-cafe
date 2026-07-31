import React from 'react'

function CartItem({ item, onRemove }) {
  return (
    <div className="cart-item">
      <div>
        <h3>{item?.name ?? 'Artículo del carrito'}</h3>
        <p>Cantidad: {item?.quantity ?? 1}</p>
      </div>
      <button type="button" onClick={() => onRemove?.(item)}>
        Eliminar
      </button>
    </div>
  )
}

export default CartItem
