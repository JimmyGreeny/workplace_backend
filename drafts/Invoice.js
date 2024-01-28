import React, { useState, useEffect } from "react";
import axios from "axios";
import "./style.css";
import helpers from "./helpers.js";
import InputSpinner from "./InputSpinner.js";
import AddSorMRowButton from "./AddSorMRowButton.js";
import ServicesData from "./services.json";
//import MaterialsData from "./invoice/materials.json";
import Dnd from "./dnd-kit/Dnd.js";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { PDFDownloadLink, Document, Page, Font, StyleSheet, Text, View } from '@react-pdf/renderer';
//import jsPDF from 'jspdf';
//import amiriFont from './invoice/amiriFont.js';
//import Html from 'react-pdf-html';
//import ReactDOMServer from 'react-dom/server';
import { useSelector } from 'react-redux'
import { selectCurrentToken } from "../auth/authSlice"
import InvoicesList from "./InvoicesList.js"
import MsList from "./MsList.js"
import NewMaterialBtn from "./NewMaterialBtn.js"

function Invoice() {
  console.log("Hi Invoice");
  const s_VATpercent = 20;
  const m_VATpercent = 20;

  const [serv_rows, setServices] = useState([]);
  const handleAddService = () => {
    const empty_s_row = helpers.newServRow();
    setServices([...serv_rows, empty_s_row]);
    console.log(empty_s_row);
  };

  const [material_rows, setMaterials] = useState([]);
  const handleAddMaterial = () => {
    const empty_m_row = helpers.newMaterialRow();
    setMaterials([...material_rows, empty_m_row]);
    console.log(empty_m_row);
  };

  const [materials, setMaterial] = useState([]);
  const [invoices, setInvoices] = useState([]);

  const token = useSelector(selectCurrentToken)

  //const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VySW5mbyI6eyJ1c2VybmFtZSI6IkRhbkQiLCJyb2xlcyI6WyJFbXBsb3llZSIsIk1hbmFnZXIiLCJBZG1pbiJdfSwiaWF0IjoxNzAyOTM2MTUyLCJleHAiOjE3MDI5MzcwNTJ9.39f-RkKbmdlye37scH7gxhQdKLTVEgznrbWJ1RYX560"
  console.log(token);

  useEffect(() => {
    axios
      .get('http://localhost:3500/invoices/materials', { headers: {"Authorization" : `Bearer ${token}`}})
      .then((res) => {
        setMaterial(res.data);
        console.log(res.data);
      })
      .catch((err) => {
        console.log('Error from ShowBookList');
      });

    axios
      .get('http://localhost:3500/invoices', { headers: {"Authorization" : `Bearer ${token}`}})
      .then((res) => {
        setInvoices(res.data);
        console.log(res.data);
      })
      .catch((err) => {
        console.log('Error from ShowInvoices');
      });

  }, []);

  const handleAddNewMaterial = () => {
    const empty_m = helpers.newMaterial();
    //setMaterial([...materials, empty_m]);
    console.log(empty_m);

    axios
    .post('http://localhost:3500/invoices/materials', empty_m)
    .then((res) => {
      console.log(res.data);
      Object.assign(empty_m, {_id: res.data});
      setMaterial([...materials, empty_m]);
    })
    .catch((err) => {
      console.log('Error in CreateBook!');
    });
  };

  const handleEditMaterialPrice = attrs => {
    const data = {
      price: attrs.price
    };
    //console.log(data);
    //console.log(attrs.item_id);
    if (attrs.item_id !== "") {
    axios
    .put(`http://localhost:3500/invoices/materials/${attrs.item_id}`, data)
    .catch((err) => {
      console.log('Error in UpdateBooklPrice!');
    });

    setMaterial(prevState => {
      const newState = prevState.map(obj => {
        if (obj._id === attrs.item_id)
          return Object.assign({}, obj, {
            price: attrs.price
          });
        return obj;
      });
      return newState;
    });
    setMaterials(prevState => {
      const newState = prevState.map(obj => {
        if (obj.item_id === attrs.item_id)
          return Object.assign({}, obj, {
            price: attrs.price
          });
        return obj;
      });
      return newState;
    });
  }
  };

  const handleEditMaterialItem = attrs => {
    const data = {
      item: attrs.item
    };

    axios
    .put(`http://localhost:3500/invoices/materials/${attrs.item_id}`, data)
    .catch((err) => {
      console.log('Error in UpdateBookInfo!');
    });
    //console.log(attrs.item_id)
    //console.log(attrs.item)

    setMaterial(prevState => {
      const newState = prevState.map(obj => {
        if (obj._id === attrs.item_id)
         return Object.assign({}, obj, {
            item: attrs.item
          });
        return obj;
      });
      return newState;
    });
    setMaterials(prevState => {
      const newState = prevState.map(obj => {
        if (obj.item_id === attrs.item_id)
          return Object.assign({}, obj, {
            item: attrs.item
          });
        return obj;
      });
      return newState;
    });
  };

  const handleEditMaterialMeasure = attrs => {
    const data = {
      measure: attrs.measure
    };
    //console.log(data);
    //console.log(attrs.item_id);
    axios
    .put(`http://localhost:3500/invoices/materials/${attrs.item_id}`, data)
    .catch((err) => {
      console.log('Error in UpdateBooklPrice!');
    });

    setMaterial(prevState => {
      const newState = prevState.map(obj => {
        if (obj._id === attrs.item_id)
          return Object.assign({}, obj, {
            measure: attrs.measure
          });
        return obj;
      });
      return newState;
    });
  };

  const handleEditMaterialStock = attrs => {
    const data = {
      in_stock: attrs.in_stock
    };
    //console.log(data);
    //console.log(attrs.item_id);
    axios
    .put(`http://localhost:3500/invoices/materials/${attrs.item_id}`, data)
    .catch((err) => {
      console.log('Error in UpdateBooklPrice!');
    });

    setMaterial(prevState => {
      const newState = prevState.map(obj => {
        if (obj._id === attrs.item_id)
          return Object.assign({}, obj, {
            in_stock: attrs.in_stock
          });
        return obj;
      });
      return newState;
    });
  };

  const updMaterialOrder = (items) => {

    //const updated_id = materials
    //.filter(material => material.index === oldIndex)
    //.map(filteredMaterial => filteredMaterial._id)

    //const new_data = {
    //  index: newIndex
    //};

    //const updated_old_id = materials
    //.filter(material => material.index === newIndex)
    //.map(filteredMaterial => filteredMaterial._id)

    //const old_data = {
    //  index: oldIndex
    //};

    //const upd_first = axios.put(`http://localhost:3500/invoices/materials/${updated_id}`, new_data)
    //const upd_second = axios.put(`http://localhost:3500/invoices/materials/${updated_old_id}`, old_data)


    //const empty_m = helpers.newMaterial();
    //setMaterial([...materials, empty_m]);
    setMaterial(items);
    console.log("invoice" + items);
    //console.log(data);
    //console.log(updated_id);

    //const data = items.map((item, index) => {
      //Object.assign(item, {index: index});
    //  console.log(item);
    //});
    //setMaterial(items);
    //console.log(data);

    //const material_rows = props.material_rows;
    Promise.all(items.slice(0).reverse().map((item, index) =>
      axios.put(`http://localhost:3500/invoices/materials/${item._id}`, {index: index}).then(
        axios.spread((...allData) => {
          console.log({ allData });
        })
      ))
    );

    //Promise.all([upd_first, upd_second]).then(
    //  axios.spread((...allData) => {
    //    console.log({ allData });
    //  })
    //);
    //axios
    //.delete(`http://localhost:3500/invoices/materials`)
    //.catch((err) => {
    //  console.log('Error form deleteAll');
    //});

    //axios
    //.post('http://localhost:3500/invoices/materials', items)
    //.catch((err) => {
    //  console.log('Error in CreateBook!');
    //});


    //axios
    //.put(`http://localhost:3500/invoices/materials/${updated_old_id}`, old_data)
    //.catch((err) => {
    //  console.log('Error in UpdateBookInfo!');
    //});

  };

  //////////////////////////////////////////////

  const deleteServiceRow = serv_rowId => {
    setServices(current =>
      current.filter(sr => {
        return sr.id !== serv_rowId;
      })
    );
  };

  const deleteMaterialRow = material_rowId => {
    setMaterials(current =>
      current.filter(mr => {
        return mr.id !== material_rowId;
      })
    );
  };

  const deleteMaterialItem = materialItem_rowId => {
    setMaterial(current =>
      current.filter(mr => {
        return mr._id !== materialItem_rowId;
      })
    );

    axios
    .delete(`http://localhost:3500/invoices/materials/${materialItem_rowId}`)
    .catch((err) => {
      console.log('Error form deleteClick');
    });
  };

  const handleEditService = attrs => {
    setServices(prevState => {
      const newState = prevState.map(obj => {
        if (obj.id === attrs.id)
          return Object.assign({}, obj, {
            title: String(attrs.title),
            price: Number(attrs.price),
            count: attrs.count
          });
        return obj;
      });
      //setInvoice({...invoice, serviceRows: newState});
      return newState;
    });
    //setInvoice({...invoice, serviceRows: newState});
  };

  const handleEditMaterial = attrs => {
    setMaterials(prevState => {
      const newState = prevState.map(obj => {
        if (obj.id === attrs.id)
          return Object.assign({}, obj, {
            item: attrs.item,
            measure: attrs.measure,
            price: Number(attrs.price),
            count: attrs.count,
            item_id: attrs.item_id
          });
        return obj;
      });
      //setInvoice({...invoice, materialRows: newState});
      return newState;
    });
  };

  const [totallS, setTotallService] = useState([]);
  const onSetTotallService = totall => {
    setTotallService(totall);
  };

  const [totallM, setTotallMaterial] = useState([]);
  const onSetTotallMaterial = totall => {
    setTotallMaterial(totall);
  };

  const handleAddInvoice = invoice => {
    setInvoices([...invoices, invoice]);
  };

  const deleteInvoice = invoice_id => {
    setInvoices(current =>
      current.filter(invoice => {
        return invoice._id !== invoice_id;
      })
    );

    axios
    .delete(`http://localhost:3500/invoices/${invoice_id}`)
    .catch((err) => {
      console.log('Error form deleteClick');
    });
  };

  const cancelInvoice = canceled_invoice => {
    setInvoices(current =>
      current.filter(invoice => {
        return invoice._id !== canceled_invoice._id;
      })
    );

    //axios
    //.delete(`http://localhost:3500/invoices/materials/invoices/${canceled_invoice._id}`)
    //.catch((err) => {
    //  console.log('Error form deleteClick');
    //});

/////////////////////////////////////////////////////////////

const materialRows = canceled_invoice.materialRows
.filter(material => materials.map(filteredMaterial => filteredMaterial._id).includes(material.item_id))

  if (materialRows) {
    Promise.all(materialRows.map((materialRow) =>
      axios.put(`http://localhost:3500/invoices/materials/${materialRow.item_id}`, {$inc: {in_stock: materialRow.count}}).then(
        axios.spread((...allData) => {
          console.log({ allData });
        })
      ))
    );

  //setMaterial(previousInputs => ([ ...previousInputs, {_id: 1, item: 1, price: 100, in_stock: 11, measure: "км."}]));

  materialRows.forEach(item => {
    setMaterial(prevState => {
      const newState = prevState.map(obj => {
        if (obj._id === item.item_id)
          return Object.assign({}, obj, {
            in_stock: Number(obj.in_stock) + Number(item.count)
          });
        return obj;
      });
      return newState;
    });
  })
}
  const materialRows2 = canceled_invoice.materialRows
  .filter(material => !materials.map(filteredMaterial => filteredMaterial._id).includes(material.item_id) && material.item_id !=="")
  
  if (materialRows2) {
    Promise.all(materialRows2.map((materialRow) =>
      axios.post('http://localhost:3500/invoices/materials', {_id:materialRow.item_id, item: materialRow.item, price: materialRow.price, in_stock: materialRow.count, measure: materialRow.measure}).then(
        axios.spread((...allData) => {
          console.log({ allData });
        })
      ))
    );
    //_id:[(materialRow.item_id !== "") ? materialRow.item_id : 0]
    //setMaterial(previousInputs => ([ ...previousInputs, {_id: 2, item: 2, price: 200, in_stock: 22, measure: "км."}]));

    const obj = materialRows2.forEach(item => {
      item['_id'] = item['item_id'];
      delete item['item_id'];
      item['in_stock'] = item['count'];
      delete item['count'];
      setMaterial(previousInputs => ([ ...previousInputs, item]));
    })
    //setMaterial([...materials, materialRows2]);
    //console.log("Hey2" + obj)
  }
    
  
  //console.log(attrs.item)

  };

  return (
    <div className="container">
      <InvoiceList
        serv_rows={serv_rows}
        services={ServicesData}
        onTrashClickService={deleteServiceRow}
        onEditService={handleEditService}
        onAddService={handleAddService}
        s_VATpercent={s_VATpercent}
        material_rows={material_rows}
        materials={materials}
        onTrashClickMaterial={deleteMaterialRow}
        onEditMaterial={handleEditMaterial}
        handleEditMaterialPrice={handleEditMaterialPrice}
        onAddMaterial={handleAddMaterial}
        m_VATpercent={m_VATpercent}
        onSetTotallService={onSetTotallService}
        onSetTotallMaterial={onSetTotallMaterial}
      />
      <AddInvoices
        //invoices={invoices}
        serv_rows={serv_rows}
        material_rows={material_rows}
        totallS={totallS}
        totallM={totallM}
        s_VATpercent={s_VATpercent}
        m_VATpercent={m_VATpercent}
        onAddInvoice={handleAddInvoice}
      />
      <MaterialsList
        serv_materials={materials}
        onEditMaterial={handleEditMaterialPrice}
        onEditMaterialItem={handleEditMaterialItem}
        onEditMaterialMeasure={handleEditMaterialMeasure}
        onEditMaterialStock={handleEditMaterialStock}
        //material_rows={this.props.material_rows}
        onAddNewMaterial={handleAddNewMaterial}
        onTrashClickMaterialItem={deleteMaterialItem}
        updMaterialOrder={updMaterialOrder}
      />
      <Invoices
        invoices={invoices}
        onTrashClickInvoice={deleteInvoice}
        onCancelClickInvoice={cancelInvoice}
      />
      <MsList />
      <NewMaterialBtn />
      <InvoicesList />
    </div>
  );
}

function Invoices(props) {
  //const updateTotallService = e => {
  //  props.onSetTotallService(e);
  //};

  //const updateTotallMaterial = e => {
  //  props.onSetTotallMaterial(e);
  //};

  //console.log("Hi InvoiceList");
  const invoices = props.invoices.map(invoice => (
    <InvoiceRow
      key={invoice._id}
      id={invoice._id}
      published_date={invoice.published_date}
      total_sum={invoice.total_sum}
      onTrashClickInvoice={props.onTrashClickInvoice}
      onCancelClickInvoice={props.onCancelClickInvoice}
      invoice={invoice}
    />
  )).sort((a, b) => (a.published_date > b.published_date) ? 1 : -1)
  //const material_rows = props.material_rows.map(material_row => (
  //  <MaterialRow
  //    key={material_row.id}
  //    id={material_row.id}
  //    item_id={material_row.item_id}
  //    onTrashClickMaterial={props.onTrashClickMaterial}
  //    onEditMaterial={props.onEditMaterial}
  //    handleEditMaterialPrice={props.handleEditMaterialPrice}
  //    materials={props.materials}
  //    m_VATpercent={props.m_VATpercent}
  //  />
  //));

  return (
    <div className="row">
      <div className="col">
      <button
        type="button"
        className="materials_btn" data-bs-toggle="collapse" data-bs-target="#collapseInvoice" aria-expanded="false" aria-controls="collapseInvoice"
      >
        Квитанции
      </button>
      </div>
      <div>
        <table className="table table-sm table-bordered table-striped table-hover m-0 collapse" id="collapseInvoice">
          <tbody>
            <tr className="InvoiceColumn">
              <th scope="col" className="align-middle text-center InvoiceColumn">
                Дата выписки
              </th>
              <th scope="col" className="align-middle text-center InvoiceColumn">
                Адрес
              </th>
              <th scope="col" className="align-middle text-center InvoiceColumn">
                Телефон
              </th>
              <th scope="col" className="align-middle text-center InvoiceColumn">
                Сумма
              </th>
            </tr>
            {invoices}
          </tbody>
        </table>
      </div>
      &nbsp;
    </div>
  );
}

function InvoiceRow(props) {
  const [modalShow, setModalShow] = useState(false);
 
  const handleTrashClick = () => {
    confirmAlert({
      //title: "Confirm to submit",
      message: "Удалить Квитанцию?",
      buttons: [
        {
          label: "Да",
          onClick: () => props.onTrashClickInvoice(props.id)
        },
        {
          label: "Нет"
          // onClick: () => alert("Click No")
        }
      ]
    });
    //props.onTrashClickInvoice(props.id);
  };

  const handleCancelClick = () => {
    confirmAlert({
      //title: "Confirm to submit",
      message: "Отменить Квитанцию?",
      buttons: [
        {
          label: "Да",
          onClick: () => {props.onCancelClickInvoice(props.invoice); props.onTrashClickInvoice(props.id)}
        },
        {
          label: "Нет"
          // onClick: () => alert("Click No")
        }
      ]
    });
    //props.onTrashClickInvoice(props.id);
  };

  const date = new Date(props.published_date)
  const day = ("0" + date.getDate()).slice(-2)
  const month = ("0" + (date.getMonth() + 1)).slice(-2)
  const year = date.getFullYear()
  const hours  = ('0'+date.getHours()).slice(-2);
  const minutes = ('0'+date.getMinutes()).slice(-2);
  const convertedDate = day+"-"+month+"-"+year+" "+hours+":"+minutes;


  return (
    <tr>
      <td><a href="#" onClick={() => setModalShow(true)}>{convertedDate}</a></td>
      <td>
        <InvoiceModal
        key={props.id}
        id={props.id}
        show={modalShow}
        onHide={() => setModalShow(false)}
        invoice={props.invoice}
        published_date={convertedDate}
        />
      </td>
      <td></td>
      <td>
        <div className="d-flex justify-content-between">
          <span
            className="pointer anticlockwise_arrow" data-bs-toggle="tooltip" title="отменить Квитанцию"
            onClick={handleCancelClick}
            aria-hidden="true"
            role="img"
            aria-label="x"
          >
            &#11119;
          </span>
          {(props.total_sum).toFixed(2)}
          <span
            className="pointer" data-bs-toggle="tooltip" title="удалить Квитанцию"
            onClick={handleTrashClick}
            aria-hidden="true"
            role="img"
            aria-label="x"
          >
            &#x274C;
          </span>
        </div>
      </td>
    </tr>
  );
}

function InvoiceModal(props) {
  const total_sum_no_vat = props.invoice.total_sum_no_vat;
  const total_sum = props.invoice.total_sum;

  const serv_invoice_rows = props.invoice.serviceRows.map(s_i_row => (
    <ServiceInvoiceRow
      key={s_i_row._id}
      id={s_i_row._id}
      title={s_i_row.title}
      price={s_i_row.price}
      count={s_i_row.count}
    />
  ));

  const vatS = props.invoice.srows_VAT;
  const vatSpercent = ((props.invoice.srows_VAT-1)*100).toFixed(0);
  const srows_sum_no_vat = props.invoice.srows_sum_no_vat;

  const material_invoice_rows = props.invoice.materialRows.map(m_i_row => (
    <MaterialInvoiceRow
      key={m_i_row._id}
      id={m_i_row._id}
      item={m_i_row.item}
      measure={m_i_row.measure}
      price={m_i_row.price}
      count={m_i_row.count}
    />
  ));

  const vatM = props.invoice.mrows_VAT;
  const vatMpercent = ((props.invoice.mrows_VAT-1)*100).toFixed(0);
  const mrows_sum_no_vat = props.invoice.mrows_sum_no_vat;

  function ServiceInvoiceRow(props) {
  
    return (
      <tr>
        <td className="text-start">
          {props.title}
        </td>
        <td>
          {(props.price).toFixed(2)}
        </td>
        <td>
          {(props.price * (vatS-1)).toFixed(2)}
        </td>
        <td>
          {(props.price * vatS).toFixed(2)}
        </td>
        <td>
          {props.count}
        </td>
        <td>
          {(props.price * props.count * vatS).toFixed(2)}
        </td>
      </tr>
    );
  }

  function MaterialInvoiceRow(props) {
  
    return (
      <tr>
        <td className="text-start">
          {props.item + ", " + props.measure}
        </td>
        <td>
          {(props.price).toFixed(2)}
        </td>
        <td>
          {(props.price * (vatM-1)).toFixed(2)}
        </td>
        <td>
          {(props.price * vatM).toFixed(2)}
        </td>
        <td>
          {props.count}
        </td>
        <td>
          {(props.price * props.count * vatM).toFixed(2)}
        </td>
      </tr>
    );
  }


  const pdf_serv_invoice_rows = props.invoice.serviceRows.map(s_i_row => (
    <PDF_ServiceInvoiceRow
      key={s_i_row._id}
      id={s_i_row._id}
      title={s_i_row.title}
      price={s_i_row.price}
      count={s_i_row.count}
    />
  ));
  function PDF_ServiceInvoiceRow(props) {
  
    return (
      <View style={styles.tableRow}>
        <View style={styles.tableCol_1}>
          <Text style={styles.tableCellLeft}>{props.title}</Text>
        </View>
        <View style={styles.tableCol}>
          <Text style={styles.tableCell}>{(props.price).toFixed(2)}</Text>
        </View>
        <View style={styles.tableCol}>
          <Text style={styles.tableCell}>{(props.price * (vatS-1)).toFixed(2)}</Text>
        </View>
        <View style={styles.tableCol}>
          <Text style={styles.tableCell}>{(props.price * vatS).toFixed(2)}</Text>
        </View>
        <View style={styles.tableCol}>
          <Text style={styles.tableCell}>{props.count}</Text>
        </View>
        <View style={styles.tableCol}>
          <Text style={styles.tableCell}>{(props.price * props.count * vatS).toFixed(2)}</Text>
        </View>
      </View>
    );
  }

  const  pdf_material_invoice_rows = props.invoice.materialRows.map(m_i_row => (
    <PDF_MaterialInvoiceRow
      key={m_i_row._id}
      id={m_i_row._id}
      item={m_i_row.item}
      measure={m_i_row.measure}
      price={m_i_row.price}
      count={m_i_row.count}
    />
  ));
  function PDF_MaterialInvoiceRow(props) {
  
    return (
      <View style={styles.tableRow}>
        <View style={styles.tableCol_1}>
          <Text style={styles.tableCellLeft}>{props.item + ", " + props.measure}</Text>
        </View>
        <View style={styles.tableCol}>
          <Text style={styles.tableCell}>{(props.price).toFixed(2)}</Text>
        </View>
        <View style={styles.tableCol}>
          <Text style={styles.tableCell}>{(props.price * (vatM-1)).toFixed(2)}</Text>
        </View>
        <View style={styles.tableCol}>
          <Text style={styles.tableCell}>{(props.price * vatM).toFixed(2)}</Text>
        </View>
        <View style={styles.tableCol}>
          <Text style={styles.tableCell}>{props.count}</Text>
        </View>
        <View style={styles.tableCol}>
          <Text style={styles.tableCell}>{(props.price * props.count * vatM).toFixed(2)}</Text>
        </View>
      </View>
    );
  }

  // Register font
Font.register({
  family: "Roboto",
  src:
    "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-medium-webfont.ttf"
});

// Reference font and etc.
const styles = StyleSheet.create({
  table: { 
    display: "table", 
    width: "auto", 
    borderStyle: "solid", 
    borderWidth: 1, 
    borderRightWidth: 0, 
    borderBottomWidth: 0,
    margin: 10
  }, 
  tableRow: { 
    margin: "auto", 
    flexDirection: "row" 
  },
  tableCol_1: { 
    width: "30%", 
    borderStyle: "solid", 
    borderWidth: 1, 
    borderLeftWidth: 0, 
    borderTopWidth: 0 
  },  
  tableCol: { 
    width: "14%", 
    borderStyle: "solid", 
    borderWidth: 1, 
    borderLeftWidth: 0, 
    borderTopWidth: 0 
  },
  tableCol_Sum: {
    width: "42%",  
    borderStyle: "solid", 
    borderWidth: 1, 
    borderLeftWidth: 0, 
    borderTopWidth: 0 
  }, 
  tableCell: { 
    margin: "auto", 
    marginTop: 5, 
    fontSize: 10 
  },
  tableCellRight: { 
    textAlign: "right",
    marginTop: 5, 
    fontSize: 10 
  },
  tableCellLeft: { 
    textAlign: "left",
    marginTop: 5, 
    fontSize: 10 
  },
  font: {
    fontFamily: 'Roboto'
  },
  center: { 
    textAlign: "center",
    fontSize: 14
  },
  center_2: { 
    textAlign: "center",
    fontSize: 10
  },
  td_important: {
    width: "14%", 
    borderStyle: "solid", 
    borderWidth: 1, 
    borderLeftWidth: 0, 
    borderTopWidth: 0,
    backgroundColor: "#35bddf1a"
  },
  td_very_important: {
    width: "14%", 
    borderStyle: "solid", 
    borderWidth: 1, 
    borderLeftWidth: 0, 
    borderTopWidth: 0,
    backgroundColor: "#df9b3538"
  }

})

  const element = (
    <View>
       <View style={styles.center}>
        <Text>АКТ-КВИТАНЦИЯ&nbsp;от&nbsp;{props.published_date}</Text> 
      </View>
      <View style={styles.center_2}>
        <Text>на выполнение дополнительных видов работ (услуг)</Text> 
      </View>
      <View style={styles.table}>
        <View style={styles.tableRow}>
          <View style={styles.tableCol_1}>
            <Text style={styles.tableCell}>Наименование работ (услуг)</Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}>Тариф без НДС</Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}>НДС {vatSpercent}%</Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}>Тариф с НДС</Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}>кол-во</Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}>сумма,р</Text>
          </View>
        </View>
          {pdf_serv_invoice_rows}
        <View style={styles.tableRow}>
          <View style={styles.tableCol_1}>
            <Text style={styles.tableCellRight}>Итого за работы:</Text>
          </View>
          <View style={styles.td_important}>
            <Text style={styles.tableCell}>{srows_sum_no_vat.toFixed(2)}</Text>
          </View>
          <View style={styles.tableCol_Sum}>
            <Text style={styles.tableCellRight}>рублей в том числе НДС:</Text>
          </View>
          <View style={styles.td_important}>
            <Text style={styles.tableCell}>{(srows_sum_no_vat * vatS).toFixed(2)}</Text>
          </View>
        </View>
        <View style={styles.tableRow}>
          <View style={styles.tableCol_1}>
            <Text style={styles.tableCell}>Наименование запчастей</Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}>Стоим. без НДС</Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}>НДС {vatMpercent}%</Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}>Стоим. с НДС</Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}>кол-во</Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}>сумма,р</Text>
          </View>
        </View>
            {pdf_material_invoice_rows}
        <View style={styles.tableRow}>
          <View style={styles.tableCol_1}>
            <Text style={styles.tableCellRight}>Итого за материалы:</Text>
          </View>
          <View style={styles.td_important}>
            <Text style={styles.tableCell}>{mrows_sum_no_vat.toFixed(2)}</Text>
          </View>
          <View style={styles.tableCol_Sum}>
            <Text style={styles.tableCellRight}>рублей в том числе НДС:</Text>
          </View>
          <View style={styles.td_important}>
            <Text style={styles.tableCell}>{(mrows_sum_no_vat * vatM).toFixed(2)}</Text>
          </View>
        </View>
        <View style={styles.tableRow}>
          <View style={styles.tableCol_1}>
            <Text style={styles.tableCellRight}>ИТОГО по Акту-квит.:</Text>
          </View>
          <View style={styles.td_very_important}>
            <Text style={styles.tableCell}>{(total_sum_no_vat).toFixed(2)}</Text>
          </View>
          <View style={styles.tableCol_Sum}>
            <Text style={styles.tableCellRight}>рублей в том числе НДС:</Text>
          </View>
          <View style={styles.td_very_important}>
            <Text style={styles.tableCell}>{(total_sum).toFixed(2)}</Text>
          </View>
        </View>
      </View>
    </View>
  );

  //const html = ReactDOMServer.renderToStaticMarkup(element);

  const MyDoc = () => (
    <Document>
      <Page size="A4" style={styles.font}>
        {element}
      </Page>
    </Document>
  );

  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
        <p>Дата и время выписки:&nbsp;<b>{props.published_date}</b></p>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
      <div className="row">
        <div className="col">
          <h2 className="d-flex justify-content-center">
            <b>АКТ-КВИТАНЦИЯ</b>
          </h2>
          <p className="d-flex justify-content-center">
            на выполнение дополнительных видов работ (услуг)
          </p>
        </div>
      <div>
        <table className="table table-sm table-bordered table-striped table-hover m-0">
          <tbody>
            <tr>
              <th scope="col" className="align-middle text-center">
                Наименование работ (услуг)
              </th>
              <th sscope="col" className="align-middle text-center">
                Тариф без НДС
              </th>
              <th scope="col" className="align-middle text-center">
                НДС {vatSpercent}%
              </th>
              <th scope="col" className="align-middle text-center">
                Тариф с НДС
              </th>
              <th scope="col" className="align-middle text-center">
                кол-во
              </th>
              <th scope="col" className="align-middle text-center">
                сумма,р
              </th>
            </tr>
            {serv_invoice_rows}
            <tr>
              <td className="align-middle text-end">Итого за работы:</td>
              <td className="td_important">{srows_sum_no_vat.toFixed(2)}</td>
              <td colSpan="3" className="align-middle text-end">
                рублей в том числе НДС:
              </td>
              <td className="td_important">{(srows_sum_no_vat * vatS).toFixed(2)}</td>
            </tr>
            <tr>
              <th scope="col" className="align-middle text-center">
                Наименование запчастей
              </th>
              <th sscope="col" className="align-middle text-center">
                Стоим. без НДС
              </th>
              <th scope="col" className="align-middle text-center">
                НДС {vatMpercent}%
              </th>
              <th scope="col" className="align-middle text-center">
                Стоим. с НДС
              </th>
              <th scope="col" className="align-middle text-center">
                кол-во
              </th>
              <th scope="col" className="align-middle text-center">
                сумма,р
              </th>
            </tr>
            {material_invoice_rows}
            <tr>
              <td className="align-middle text-end">Итого за материалы:</td>
              <td className="td_important">{mrows_sum_no_vat.toFixed(2)}</td>
              <td colSpan="3" className="align-middle text-end">
                рублей в том числе НДС:
              </td>
              <td className="td_important">{(mrows_sum_no_vat * vatM).toFixed(2)}</td>
            </tr>
            <tr>
              <th scope="col" className="align-middle text-end">
                ИТОГО по Акту-квит.:
              </th>
              <th scope="col" className="td_very_important align-middle text-center">
                {(total_sum_no_vat).toFixed(2)}
              </th>
              <th colSpan="3" scope="col" className="align-middle text-end">
                рублей в том числе НДС:
              </th>
              <th className="td_very_important align-middle text-center">
                {(total_sum).toFixed(2)}
              </th>
            </tr>
          </tbody>
        </table>
      </div>
      &nbsp;
    </div>
      </Modal.Body>
      <Modal.Footer>
      <div className="container">
        <div className="row">
          <div className="col text-start">
            <Button variant="success">
              <PDFDownloadLink document={<MyDoc />} fileName={props.published_date}>
                {({ blob, url, loading, error }) =>
                loading ? 'Загружается...' : 'Скачать .pdf'
                }
              </PDFDownloadLink>
            </Button>
          </div>
          <div className="col text-end">
            <Button variant="secondary" onClick={props.onHide}>Закрыть</Button>
          </div>
        </div>
      </div>
      </Modal.Footer>
    </Modal>
  );
}


function AddInvoices(props) {
  const vatS = 1 + props.s_VATpercent / 100;
  const vatM = 1 + props.m_VATpercent / 100;
  const srows_sum = (props.totallS * vatS).toFixed(2);
  const mrows_sum = (props.totallM * vatM).toFixed(2);
  const total_sum_no_vat = (props.totallS + props.totallM);
  const total_sum = Number(srows_sum) + Number(mrows_sum);


  useEffect(() => {
    console.log("SERV ROW" + total_sum);
    setInvoice({
      serviceRows: props.serv_rows,
      srows_sum_no_vat: props.totallS,
      srows_VAT: vatS,
      materialRows: props.material_rows,
      mrows_sum_no_vat: props.totallM,
      mrows_VAT: vatM,
      total_sum_no_vat: total_sum_no_vat,
      total_sum: (total_sum).toFixed(2)
    });
  }, [props]);

  const [invoice, setInvoice] = useState({});

  const handleAddInvoice = () => {
    //props.onAddInvoice(invoice);
    //const empty_m = helpers.newMaterial();
    //setInvoice(prevInvoice => ({
    //  ...prevInvoice,
    //  serviceRows: serv_rows,
    //  materialRows: material_rows
    //}));
    console.log("INVOICE" + invoice);
    //console.log(empty_m);
    //console.log(serv_rows);

    axios
    .post('http://localhost:3500/invoices', invoice)
    .then((res) => {
      console.log(res.data);
      props.onAddInvoice(res.data);
      //Object.assign(empty_m, {_id: res.data});
      //setMaterial([...materials, empty_m]);
    })
    .catch((err) => {
      console.log('Error in CreateInvoice!');
    });
  };
  //const invoices = props.invoices.map(invoice => (
  //  <InvoiceRow
  //    key={invoice.id}
  //    id={invoice.id}
  //  />
  //));

  return (
    <div>
      <button
        className="add_invoice font-weight-bold"
        onClick={handleAddInvoice}
      >Выписать Квитанцию
      </button>
      &nbsp;
      {/*invoices*/}
    </div>
  );
}

function InvoiceList(props) {

  const updateTotallService = e => {
    props.onSetTotallService(e);
  };

  const updateTotallMaterial = e => {
    props.onSetTotallMaterial(e);
  };

  console.log("Hi InvoiceList");
  const serv_rows = props.serv_rows.map(serv_row => (
    <ServiceRow
      key={serv_row.id}
      id={serv_row.id}
      title={serv_row.title}
      onTrashClickService={props.onTrashClickService}
      onEditService={props.onEditService}
      services={props.services}
      s_VATpercent={props.s_VATpercent}
    />
  ));
  const material_rows = props.material_rows.map(material_row => (
    <MaterialRow
      key={material_row.id}
      id={material_row.id}
      item_id={material_row.item_id}
      onTrashClickMaterial={props.onTrashClickMaterial}
      onEditMaterial={props.onEditMaterial}
      handleEditMaterialPrice={props.handleEditMaterialPrice}
      materials={props.materials}
      m_VATpercent={props.m_VATpercent}
    />
  ));

  return (
    <div className="row">
      <div className="col">
        <h2 className="d-flex justify-content-center">
          <b>АКТ-КВИТАНЦИЯ</b>
        </h2>
        <p className="d-flex justify-content-center">
          на выполнение дополнительных видов работ (услуг)
        </p>
        <p className="d-flex justify-content-center">
          <b>
            Тарифы на дополнительные виды работ по абонентским пунктам
            Приложение 46. Вводятся с 01 мая 2022 года
          </b>
        </p>
      </div>
      <div>
        <table className="table table-sm table-bordered table-striped table-hover m-0">
          <tbody>
            <tr>
              <th scope="col" className="align-middle text-center">
                Наименование работ (услуг)
              </th>
              <th sscope="col" className="align-middle text-center">
                Тариф без НДС
              </th>
              <th scope="col" className="align-middle text-center">
                НДС {props.s_VATpercent}%
              </th>
              <th scope="col" className="align-middle text-center">
                Тариф с НДС
              </th>
              <th scope="col" className="align-middle text-center">
                кол-во
              </th>
              <th scope="col" className="align-middle text-center">
                сумма,р
              </th>
            </tr>
            {serv_rows}
            <SumRows 
              rows={props.serv_rows}
              VATpercent={props.s_VATpercent}
              setTotall={total => updateTotallService(total)}
              text={"работы"}
            />
            <AddSorMRowButton onAddRow={props.onAddService} />
            <tr>
              <th scope="col" className="align-middle text-center">
                Наименование запчастей
              </th>
              <th sscope="col" className="align-middle text-center">
                Стоим. без НДС
              </th>
              <th scope="col" className="align-middle text-center">
                НДС {props.m_VATpercent}%
              </th>
              <th scope="col" className="align-middle text-center">
                Стоим. с НДС
              </th>
              <th scope="col" className="align-middle text-center">
                кол-во
              </th>
              <th scope="col" className="align-middle text-center">
                сумма,р
              </th>
            </tr>
            {material_rows}
            <SumRows
              rows={props.material_rows}
              VATpercent={props.m_VATpercent}
              setTotall={total => updateTotallMaterial(total)}
              text={"материалы"}
            />
            <AddSorMRowButton onAddRow={props.onAddMaterial} />
            <TotalSum
              serv_rows={props.serv_rows}
              material_rows={props.material_rows}
              sVATpercent={props.s_VATpercent}
              mVATpercent={props.m_VATpercent}
            />
          </tbody>
        </table>
      </div>
      &nbsp;
    </div>
  );
}

function ServiceRow(props) {
  const s_VATpercent = props.s_VATpercent;
  const vat = 1 + s_VATpercent / 100;
  const [price, handleChange] = useState(0);
  const [n, setN] = useState(0);
  //const [count, setCount] = useState("");
  const services = props.services;

  const updateCount = e => {
    setN(e);
    //console.log(e);
    props.onEditService({
      id: props.id,
      title: props.title,
      price: price,
      count: e
    });
  };

  const updatePrice = e => {
    const selected_price = services
    .filter(service => service.id === Number(e.target.value))
    .map(filteredService => filteredService.price)

    const selected_title = services
    .filter(service => service.id === Number(e.target.value))
    .map(filteredService => filteredService.title)

    handleChange(selected_price);
    props.onEditService({
      id: props.id,
      title: selected_title,
      price: selected_price,
      count: n
    });
  };

  const handleTrashClick = () => {
    props.onTrashClickService(props.id);
  };



  return (
    <tr>
      <td>
        <div className="row">
          <div className="col-12">
            <div className="card">
              <select onChange={updatePrice} defaultValue="">
                  <option></option>
                {services.map((option, index) => (
                  <option key={index} value={option.id}>
                    {option.title}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </td>
      <td>{price}</td>
      <td>{(price * (vat - 1)).toFixed(2)}</td>
      <td>{(price * vat).toFixed(2)}</td>
      <td>
        <InputSpinner step={1.0} onChange={count => updateCount(count)} />
      </td>
      <td>
        <div className="d-flex justify-content-between">
          {(n * price * vat).toFixed(2)}
          <span
            className="pointer"
            onClick={handleTrashClick}
            aria-hidden="true"
            role="img"
            aria-label="x"
          >
            &#x274C;
          </span>
        </div>
      </td>
    </tr>
  );
}

function SumRows(props) {
  useEffect(() => {
    console.log("SET Totall");
    props.setTotall(Number(total.toFixed(2)))
  }, [props]);

  const text = props.text;
  console.log(text);

  const rows = props.rows;
  const VATpercent = props.VATpercent;
  const vat = 1 + VATpercent / 100;
  var total = 0;
  for (var i = 0; i < rows.length; i++) {
    total += rows[i].price * rows[i].count;
  }
  //const totalWithVAT = (total * vat).toFixed(2)
  //const total = serv_rows.map((serv_row) => (
  //  <div key={this.props.id}>{serv_row.price * serv_row.count}</div>
  //))
  return (
    <tr>
      <td className="align-middle text-end">Итого за {text}:</td>
      <td className="td_important">{total.toFixed(2)}</td>
      <td colSpan="3" className="align-middle text-end">
        рублей в том числе НДС:
      </td>
      <td className="td_important">{(total * vat).toFixed(2)}</td>
    </tr>
  );
}
//editable input:
//<input value={this.state.price} onChange={this.handlePriceChange} />



function MaterialRow(props) {
  const m_VATpercent = props.m_VATpercent;
  const vat = 1 + m_VATpercent / 100;
  
  //const [price, handleChange] = useState(0);
  const [n, setN] = useState(0);
  //const [inpkey, setInpkey] = useState(0);
  //const [count, setCount] = useState("");
  const materials = props.materials;

  const init_price = materials
  .filter(material => material._id === props.item_id)
  .map(filteredMaterial => filteredMaterial.price)
  
  const material_id = materials
  .filter(material => material._id === props.item_id)
  .map(filteredMaterial => filteredMaterial._id)

  //const VATamount = (init_price * (vat - 1)).toFixed(2)
  //const priceWithVAT = (init_price * vat).toFixed(2)
  //const rowValue = (n * init_price * vat).toFixed(2)

  const updateCount = e => {
    setN(e);
    //console.log(e);
    const selected_item = materials
    .filter(material => material._id === props.item_id)
    .map(filteredMaterial => filteredMaterial.item)

    const selected_measure = materials
    .filter(material => material._id === props.item_id)
    .map(filteredMaterial => filteredMaterial.measure)

    props.onEditMaterial({
      id: props.id,
      item: String(selected_item),
      measure: String(selected_measure),
      price: init_price,
      count: e,
      item_id: props.item_id
    });
  };

  const updatePrice = e => {
    const selected_price = materials
    .filter(material => material._id === e.target.value)
    .map(filteredMaterial => filteredMaterial.price)

    const selected_item = materials
    .filter(material => material._id === e.target.value)
    .map(filteredMaterial => filteredMaterial.item)

    const selected_measure = materials
    .filter(material => material._id === e.target.value)
    .map(filteredMaterial => filteredMaterial.measure)
    //handleChange(e.target.value);
    //setInpkey(e.target.selectedIndex);
    props.onEditMaterial({
      id: props.id,
      item: String(selected_item),
      measure: String(selected_measure),
      price: selected_price,
      count: n,
      item_id: e.target.value
    });
    console.log(e.target.value);
  };

  const updateOnlyPrice = e => {////////should be changed!!!!!!
    //handleChange(e.target.value);
    //setInpkey(e.target.selectedIndex);
    props.handleEditMaterialPrice({
      item_id: String(material_id),
      price: e.target.value
    });
      //console.log(props.item_id);
  };

  const handleTrashClick = () => {
    props.onTrashClickMaterial(props.id);
  };

  

  return (
    <tr>
      <td>
        <div className="row">
          <div className="col-12">
            <div className="card">
              <select onChange={updatePrice} defaultValue="">
                  <option></option>
                {materials.map((option, index) => (
                  <option key={index} value={option._id}>
                    {option.item + ", " + option.measure}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </td>
      <td>
        <input
          className="inrow_material_price"
          value={init_price}
          onChange={updateOnlyPrice}
        />
      </td>
      <td>{(init_price * (vat - 1)).toFixed(2)}</td>
      <td>{(init_price * vat).toFixed(2)}</td>
      <td>
        <InputSpinner step={0.5} onChange={count => updateCount(count)} />
      </td>
      <td>
        <div className="d-flex justify-content-between">
          {(n * init_price * vat).toFixed(2)}
          <span
            className="pointer"
            onClick={handleTrashClick}
            aria-hidden="true"
            role="img"
            aria-label="x"
          >
            &#x274C;
          </span>
        </div>
      </td>
    </tr>
  );
}

function TotalSum(props) {
  const sVATpercent = props.sVATpercent;
  const mVATpercent = props.mVATpercent;
  const svat = 1 + sVATpercent / 100;
  const mvat = 1 + mVATpercent / 100;

  const material_rows = props.material_rows;
  var total_materials = 0;
  for (var i = 0; i < material_rows.length; i++) {
    total_materials += material_rows[i].price * material_rows[i].count;
  }
  const serv_rows = props.serv_rows;
  var total_serv = 0;
  for (i = 0; i < serv_rows.length; i++) {
    total_serv += serv_rows[i].price * serv_rows[i].count;
  }
  //const total = serv_rows.map((serv_row) => (
  //  <div key={this.props.id}>{serv_row.price * serv_row.count}</div>
  //))
  return (
    <tr>
      <th scope="col" className="align-middle text-end">
        ИТОГО по Акту-квит.:
      </th>
      <th scope="col" className="td_very_important align-middle text-center">
        {(total_materials + total_serv).toFixed(2)}
      </th>
      <th colSpan="3" scope="col" className="align-middle text-end">
        рублей в том числе НДС:
      </th>
      <th className="td_very_important align-middle text-center">
        {(total_materials * mvat + total_serv * svat).toFixed(2)}
      </th>
    </tr>
  );
}

function MaterialsList(props) {
  console.log(props.serv_materials);
  //const materials = props.serv_materials.map(material => (
  //  <MaterialsDBRow
  //    key={material._id}
  //    item_id={material._id}
  //    //onTrashClickService={props.onTrashClickService}
      //onEditService={props.onEditService}
  //    item={material.item}
  //    price={material.price}
  //    onEditMaterial={props.onEditMaterial}
  //    onEditMaterialItem={props.onEditMaterialItem}
  //    onAddNewMaterial={props.onAddNewMaterial}
  //    onTrashClickMaterialItem={props.onTrashClickMaterialItem}
  //  />
  //));

  //const handleShowMaterials = () => {};

  //const material_ids = props.serv_materials
  //.map(filteredMaterial => filteredMaterial._id)

  return (
    <div>
      <button
        type="button"
        className="materials_btn" data-bs-toggle="collapse" data-bs-target="#collapseExample" aria-expanded="false" aria-controls="collapseExample"
      >
        Материалы
      </button>
        {/*materials*/}
        <Dnd materials={props.serv_materials} updOrder={(items) => props.updMaterialOrder(items)} onEditMaterial={props.onEditMaterial} onEditMaterialItem={props.onEditMaterialItem} onEditMaterialMeasure={props.onEditMaterialMeasure} onEditMaterialStock={props.onEditMaterialStock} onTrashClickMaterialItem={props.onTrashClickMaterialItem} onAddNewMaterial={props.onAddNewMaterial}/>
        &nbsp;
    </div>
  );
}

export default Invoice;
//lsof -i tcp:3000
//kill -9 15640

//mistakes and tasks

//-
//added material then made invoice with that material and got the error:
//react-jsx-dev-runtime.development.js:87 Warning: Each child in a list should have a unique "key" prop.
//+

//-
//material list doesn't refresh live after canceling invoice
//+

//-
//If I'm adding new invoice with initial choise (i.e. empty materials and zero value) then cannot cancel it, getting error code 400
//+

//-
//When adding a price to newly added material row with initial choise (i.e. empty materials and zero value), getting error: PUT http://localhost:3500/invoices/materials/ 404 (Not Found)
//

