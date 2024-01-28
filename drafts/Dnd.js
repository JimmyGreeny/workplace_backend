import React, { useState, useEffect } from "react";
import AddSorMRowButton from "../../invoice/AddSorMRowButton.js";
import {
  //closestCenter,
  DndContext,
  TouchSensor,
  MouseSensor,
  //DragOverlay,
  //DragStartEvent,
  useSensor,
  useSensors,
  //PointerSensor,
  KeyboardSensor,
  //useDndContext,
  //LayoutMeasuringStrategy,
  //DragEndEvent
} from "@dnd-kit/core";

import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates
} from "@dnd-kit/sortable";

//import { Droppable } from "./Droppable";
//import { Draggable } from "./Draggable";
import SortableItem from "./SortableItem";

const Dnd = (props) => {

  console.log(props.materials);



  const [items, setItems] = useState([]);
  useEffect(() => {
    setItems(props.materials)
  }, [props.materials]);
  //console.log(props.materials);

  const sensors = useSensors(
    useSensor(MouseSensor, {
      // Require the mouse to move by 10 pixels before activating
      activationConstraint: {
        distance: 10
      }
    }),
    useSensor(TouchSensor, {
      // Press delay of 250ms, with tolerance of 5px of movement
      activationConstraint: {
        delay: 250,
        tolerance: 5
      }
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  );
  //const [isDropped, setIsDropped] = useState(false);
  //const [parent, setParent] = useState(null);

  //const containers = ["A", "B", "C"];

  //const draggableMarkup = <Draggable id="draggable">Drag me</Draggable>;
  const handleDragStart = (props) => {
    console.log(props);
  };
  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.indexOf(active.id);
        const newIndex = items.indexOf(over.id);
        console.log("before"+items);
        //props.updOrder(oldIndex, newIndex);
        //props.updOrder(newIndex, oldIndex);
        props.updOrder(arrayMove(items, oldIndex, newIndex))
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleDragCancel = () => {};

  console.log("after"+items);
  //props.onChange(items);
  //props.updOrder(items);

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <table
        className="
            table table-striped table-sm table-bordered
            table-hover
            m-0
            collapse
          "
          id="collapseExample"
      >
        <tbody>
          <tr>
            <th scope="col" colSpan="3" className="align-middle text-center">
              Наименование
            </th>
            <th scope="col" className="align-middle text-center">
              Ед. изм.
            </th>
            <th scope="col" className="align-middle text-center">
              Кол-во
            </th>
            <th scope="col" className="align-middle text-center">
              Стоимость
            </th>
          </tr>
      <SortableContext items={items}>
        {items.map((x) => (
          <SortableItem key={x._id} id={x} item_id={x._id} item={x.item} measure={x.measure} in_stock={x.in_stock} price={x.price} onEditMaterial={props.onEditMaterial} onEditMaterialItem={props.onEditMaterialItem} onEditMaterialMeasure={props.onEditMaterialMeasure} onEditMaterialStock={props.onEditMaterialStock} onTrashClickMaterialItem={props.onTrashClickMaterialItem} />
        ))}
      </SortableContext>
      <AddSorMRowButton onAddRow={props.onAddNewMaterial} />
        </tbody>
      </table>
    </DndContext>
  );
};

export default Dnd;