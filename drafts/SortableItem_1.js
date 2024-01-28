import React, { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";


function SortableItem(props) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition
  } = useSortable({ id: props.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  };

  const [item, changeItem] = useState(props.item);
  const [measure, changeMeasure] = useState(props.measure);

  const updateItem = e => {
    changeItem(e.target.value);
    props.onEditMaterialItem({
      item_id: props.item_id,
      item: e.target.value,
      //price: price
    });
  };

  const updatePrice = e => {
    //changePrice(e.target.value);
    props.onEditMaterial({
      item_id: props.item_id,
      //item: item,
      price: e.target.value
    });
  };

  const updateMeasure = e => {
    changeMeasure(e.target.value);
    props.onEditMaterialMeasure({
      item_id: props.item_id,
      //item: item,
      measure: e.target.value
    });
  };

  const updateStock = e => {
    //changePrice(e.target.value);
    props.onEditMaterialStock({
      item_id: props.item_id,
      //item: item,
      in_stock: e.target.value
    });
  };

  const handleTrashClickMaterialItem = () => {
    props.onTrashClickMaterialItem(props.item_id);
  };

  return (
    <tr ref={setNodeRef} style={style}>
      <td className="align-middle text-left" colSpan="3">
      <span {...attributes} {...listeners}
          className="move_pointer"
          aria-hidden="true"
          role="img"
        >&#x2630;</span>&nbsp;
        <input className="material_item" value={item} onChange={updateItem} />
      </td>
      <td className="align-middle">
      <input
          className="material_item text-center"
          value={measure}
          onChange={updateMeasure}
        />
      </td>
      <td className="">
      <input
          className="material_price text-center"
          value={props.in_stock || ''}
          onChange={updateStock}
        />
      </td>
      <td className="d-flex justify-content-between">
        <input
          className="material_price"
          value={props.price || ''}
          onChange={updatePrice}
        />
        <span
          className="pointer"
          onClick={handleTrashClickMaterialItem}
          aria-hidden="true"
          role="img"
          aria-label="x"
        >&#x274C;</span>
      </td>
    </tr>
  );
}

export default SortableItem;