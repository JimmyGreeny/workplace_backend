import React, { useState, useEffect } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useUpdateMaterialMutation, useDeleteMaterialMutation } from "../materialsApiSlice"
import { useSelector, shallowEqual  } from 'react-redux'


const SortableItem = ({ material }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition
  } = useSortable({ id: material._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  };

  const [updateMaterial, {
    isLoading,
    isSuccess,
    isError,
    error
  }] = useUpdateMaterialMutation()

  const [deleteMaterial, {
    isSuccess: isDelSuccess,
    isError: isDelError,
    error: delerror
  }] = useDeleteMaterialMutation()

  //console.dir("ffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"+inc)
  //console.dir(inc)

  const selectTodoById = (state, todoId) => {
    return state.materials.filter(record => record.item_id === todoId).map(item => item.count)
  }
  const record = useSelector(state => selectTodoById(state, material._id),shallowEqual)
  
  console.dir("RRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR"+record)
  console.dir(record)

  const [item, setItem] = useState(material.item)
  const [price, setPrice] = useState(material.price)
  const [measure, setMeasure] = useState(material.measure)
  const [in_stock, setIn_stock] = useState(material.in_stock)

  //const onItemChanged = e => setItem(e.target.value)
  //const onPriceChanged = e => setPrice(e.target.value)
  //const onMeasureChanged = e => setMeasure(e.target.value)
  //const onIn_stockChanged = e => setIn_stock(e.target.value)
  //const result = Number(incrm.map(a => a.count))

  

  useEffect(() => {
    
    if(record?.length) {
      //const result = Number(record)
      setIn_stock(Number(record))
    }
  }, [record]);


  const updateItem = async (e) => {
    setItem(e.target.value);
    await updateMaterial({ id: material._id, item: e.target.value })
    console.log(e.target.value)
    console.log(material._id)
    //props.onEditMaterialItem({
    //  item_id: props.item_id,
    //  item: e.target.value,
    //price: price
    //});
  }

  const updatePrice = async (e) => {
    setPrice(e.target.value);
    await updateMaterial({ id: material._id, price: e.target.value })
    //props.onEditMaterial({
    //  item_id: props.item_id,
    //item: item,
    //  price: e.target.value
    //});
  };

  const updateMeasure = async (e) => {
    setMeasure(e.target.value);
    await updateMaterial({ id: material._id, measure: e.target.value })
    //props.onEditMaterialMeasure({
    //  item_id: props.item_id,
    //  //item: item,
    //  measure: e.target.value
    //});
  }

  const updateInStock = async (e) => {
    setIn_stock(e.target.value);
    await updateMaterial({ id: material._id, in_stock: e.target.value })
    //props.onEditMaterialStock({
    //  item_id: props.item_id,
    //item: item,
    //  in_stock: e.target.value
    //});
  }

  const onDeleteMaterialClick = async () => {
    //const handleTrashClickMaterialItem = () => {
    //props.onTrashClickMaterialItem(props.item_id);
    await deleteMaterial({ id: material.id })
  }

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
          value={in_stock}
          onChange={updateInStock}
        />
      </td>
      <td className="d-flex justify-content-between">
        <input
          className="material_price"
          value={price || ''}
          onChange={updatePrice}
        />
        <span
          className="pointer"
          onClick={onDeleteMaterialClick}
          aria-hidden="true"
          role="img"
          aria-label="x"
        >&#x274C;</span>
      </td>
    </tr>
  );
}

export default SortableItem;