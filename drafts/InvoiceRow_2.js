import { useState } from "react"
import { useNavigate } from 'react-router-dom'
import { useGetInvoicesQuery, useDeleteInvoiceMutation } from './invoicesApiSlice'
import { useGetMaterialsQuery, useAddNewMaterialMutation, useUpdateMaterialMutation } from './materialsApiSlice'
import { memo } from 'react'
import { useDispatch } from 'react-redux'
import { setMaterials } from './MaterialsSlice'
import { confirmAlert } from "react-confirm-alert";
import InvoiceModal from './InvoiceModal'

const Invoice = ({ invoiceId }) => {
    const [modalShow, setModalShow] = useState(false);
    const dispatch = useDispatch()

    const { invoice } = useGetInvoicesQuery("invoicesList", {
        selectFromResult: ({ data }) => ({
            invoice: data?.entities[invoiceId]
        }),
    })

    const { data } = useGetMaterialsQuery("materialsList", {
        selectFromResult: ({ data }) => ({
            data: data?.ids.map(id => data?.entities[id])
        }),
        refetchOnFocus: true,
        refetchOnMountOrArgChange: true
    })
    //const [materials, setMaterials] = useState(data);
    console.dir("fdgs")
    console.dir(data)


    if (
        typeof data === 'object' &&
        !Array.isArray(data) &&
        data !== null
    ) {
        console.dir("IT IS OBJECT")
    }
    else if (
        Array.isArray(data)
    ) {
        console.dir("NOT AN OBJECT IT IS ARRAY")
    }

    //if (isSuccessmaterials) {
    //const { ids, entities } = materials
    //Object.keys(entities).map((materialId) => (console.dir(materialId)));
    //}

    //const { ids, entities } = materials

    //let filteredIds
    //  filteredIds = ids.filter(materialId => entities[materialId])

    //const { data: materials } = useGetMaterialsQuery()
    //materials?.data?.map((material) => (console.dir(material)
    //))
    //const { data } = useGetMaterialsQuery()
    //const { entities } = data
    //let materials;
    //materials= JSON.stringify(data.entities)

    //console.dir(materials)
    //console.dir(invoice)
    //console.dir("HHHHHHHHHHHHHHHH" + materials)

    const [updateMaterial] = useUpdateMaterialMutation()

    const [addNewMaterial] = useAddNewMaterialMutation()

    const [deleteInvoice] = useDeleteInvoiceMutation()

    const onCancelInvoiceClicked = async (e) => {
        confirmAlert({
            //title: "Confirm to submit",
            message: "Отменить Квитанцию?",
            buttons: [
                {
                    label: "Да",
                    onClick: () => { UpdateMaterialsList(); deleteInvoice({ id: invoice.id }) }
                },
                {
                    label: "Нет"
                    // onClick: () => alert("Click No")
                }
            ]
        })
    }

    const UpdateMaterialsList = () => {

        //const { ids, entities } = materials
        console.dir("materials")
        console.dir(data)
        //const { ids, entities } = materials
        //let filteredIds = ids.filter(noteId => entities[noteId].username === username)

        const addnew_rows = invoice.materialRows.filter(material => !data.map(filteredMaterial => filteredMaterial._id).includes(material.item_id) && material.item_id !== "")
        console.dir(addnew_rows)
        //setMaterials(prevState => ({ ...prevState, addnew_rows }));

        const update_rows = invoice.materialRows.filter(material => data.map(filteredMaterial => filteredMaterial._id).includes(material.item_id))
        console.dir("NNNNNNNNNNNNNNNN" + update_rows)
        console.dir(update_rows)
        //if (update_rows) {
        //    updateMaterial({ id: update_rows, in_stock: 5 })
        //}
        Promise.all(addnew_rows.map((materialRow) =>
            addNewMaterial({ _id: materialRow.item_id, user: materialRow.user, item: materialRow.item, price: materialRow.price, in_stock: materialRow.count, measure: materialRow.measure })
        ));
        //if (addnew_rows) {
        //    Promise.all(addnew_rows.map((materialRow) =>
        //        addNewMaterial({ id: materialRow.item_id, item: materialRow.item, price: materialRow.price, in_stock: materialRow.count, measure: materialRow.measure })
        //    ));
        //}
        //$inc: { in_stock: materialRow.count }
        Promise.all(update_rows.map((materialRow) =>
            updateMaterial({ id: materialRow.item_id, in_stock_inc: materialRow.count })
        ));

        //const materialRows = data
        //.filter(material => update_rows.map(filteredMaterial => filteredMaterial.item_id).includes(material._id) && material.item_id !=="")

        //const result = data.filter(material => update_rows.some(filteredMaterial => material._id === filteredMaterial.item_id))

        //const result = update_rows.filter(material => data.some(filteredMaterial => material.item_id === filteredMaterial._id))

        //const result2 = result.map(item => item.count = 123)

        const newData = update_rows//.filter(item => data.some(obj => obj._id === item.item_id))
            .map(i => ({
                ...i, count: i.count + (data.find(f => f._id === i.item_id).in_stock)
            }))
        //let arrCopy = {...item} // 👈️ create copy
        //if (obj._id === item.item_id) {
        //arrCopy.count = 1231
        //}

        // ? Object.assign({}, item, { count: item.count+obj.in_stock }) : null))

        //let newData = result.map((item) =>
        //    Object.assign({}, item, { count: 123 })
        //)

        //const newData = update_rows.map((obj) => {
        //    data.find((o) => {
        //        if (o._id === obj.item_id)
        //            return Object.assign({}, obj, {
        //                count: 4645

        //            })
        //    });
        //    return obj;
        //});

        //setNewarray(data)

        //let newData = result.map((item) =>
        //update_rows.map(obj => (obj.item_id === item._id)) ?
        //    Object.assign({}, item, { in_stock: 123 }) : false
        //)

        //let newData = result.map((item) =>
        //data.map(obj => (obj._id === item.item_id) ? Object.assign({}, item, { count: item.count+obj.in_stock }) : null))

        console.dir("YYYYYYYYYYYYYYYYYYYYY" + data)
        console.dir(newData)
        dispatch(setMaterials(newData))
    }

    const onDeleteInvoiceClicked = async () => {
        confirmAlert({
            //title: "Confirm to submit",
            message: "Удалить Квитанцию?",
            buttons: [
                {
                    label: "Да",
                    onClick: () => deleteInvoice({ id: invoice.id })
                },
                {
                    label: "Нет"
                    // onClick: () => alert("Click No")
                }
            ]
        });
    }

    //const navigate = useNavigate()

    //useEffect(() => {
    //    console.log(isSuccess || isDelSuccess)
    //}, [isSuccess, isDelSuccess, navigate])

    if (invoice) {
        const created = new Date(invoice.published_date).toLocaleString('ru-RU', { day: 'numeric', month: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })

        //const handleEdit = () => navigate(`/dash/invoices/${invoiceId}`)

        return (
            <tr>
                <td><a href="#" onClick={() => setModalShow(true)}>{created}</a></td>
                <td>
                </td>
                <td>{invoice.username}</td>

                <td>
                    <div className="d-flex justify-content-between">
                        <span
                            className="pointer anticlockwise_arrow" data-bs-toggle="tooltip" title="отменить Квитанцию"
                            onClick={onCancelInvoiceClicked}
                            aria-hidden="true"
                            role="img"
                            aria-label="x"
                        >
                            &#11119;
                        </span>
                        {(invoice.total_sum).toFixed(2)}
                        <span
                            className="pointer" data-bs-toggle="tooltip" title="удалить Квитанцию"
                            onClick={onDeleteInvoiceClicked}
                            aria-hidden="true"
                            role="img"
                            aria-label="x"
                        >
                            &#x274C;
                        </span>
                    </div>
                </td>
                <InvoiceModal
                    key={invoice.id}
                    id={invoice.id}
                    show={modalShow}
                    onHide={() => setModalShow(false)}
                    invoice={invoice}
                    published_date={created}
                />
            </tr>
        )

    } else return null
}

const memoizedInvoice = memo(Invoice)

export default memoizedInvoice