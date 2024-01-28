import { useEffect } from "react"
import { useNavigate } from 'react-router-dom'
import { useGetInvoicesQuery, useDeleteInvoiceMutation } from './invoicesApiSlice'
import { useGetMaterialsQuery, useAddNewMaterialMutation, updateCanceledMaterial } from './materialsApiSlice'
import { memo } from 'react'

const Invoice = ({ invoiceId }) => {

    const { invoice } = useGetInvoicesQuery("invoicesList", {
        selectFromResult: ({ data }) => ({
            invoice: data?.entities[invoiceId]
        }),
    })

    const {
        data: materials,
        isLoading: isLoadingmaterials,
        isSuccess: isSuccessmaterials,
        isError: isErrormaterials,
        error: errormaterials
    } = useGetMaterialsQuery('notesList', {
        pollingInterval: 15000,
        refetchOnFocus: true,
        refetchOnMountOrArgChange: true
    })

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

    const [updateMaterial, {
        isLoading,
        isSuccess,
        isError,
        error
    }] = updateCanceledMaterial()

    const [addNewMaterial, {
        isLoading: isaddNewMaterialLoading,
        isSuccess: isaddNewMaterialSuccess,
        isError: isaddNewMaterialError,
        error: isaddNewMaterialerror
    }] = useAddNewMaterialMutation()

    const [deleteInvoice, {
        isSuccess: isDelSuccess,
        isError: isDelError,
        error: delerror
    }] = useDeleteInvoiceMutation()

    const onUpdateMaterialClicked = async (e) => {
        const { ids, entities } = materials
        console.dir("DDDDDD" + ids)
        //const { ids, entities } = materials
        //let filteredIds = ids.filter(noteId => entities[noteId].username === username)

        const addnew_rows = invoice.materialRows.filter(material => !ids.map(filteredMaterial => filteredMaterial).includes(material.item_id) && material.item_id !== "")
        console.dir("HHHHHHHHHHHHHHHH" + addnew_rows)

        const update_rows = invoice.materialRows.filter(material => ids.map(filteredMaterial => filteredMaterial).includes(material.item_id))
        console.dir("NNNNNNNNNNNNNNNN" + update_rows)
        if (update_rows) {
            updateMaterial(update_rows)
        }
        //if (update_rows) {
        //    updateMaterial({ id: update_rows, in_stock: 5 })
        //}
    //    Promise.all(addnew_rows.map((materialRow) =>
    //        addNewMaterial({ user: materialRow.user , item: materialRow.item, price: materialRow.price, in_stock: materialRow.count, measure: materialRow.measure })
    //    ));
        //if (addnew_rows) {
        //    Promise.all(addnew_rows.map((materialRow) =>
        //        addNewMaterial({ id: materialRow.item_id, item: materialRow.item, price: materialRow.price, in_stock: materialRow.count, measure: materialRow.measure })
        //    ));
        //}
        //$inc: { in_stock: materialRow.count }
    //    Promise.all(update_rows.map((materialRow) =>
    //        updateMaterial({ id: materialRow.item_id, in_stock: materialRow.count })
    //    ));
    }

    const onDeleteInvoiceClicked = async () => {
        await deleteInvoice({ id: invoice.id })
    }

    const navigate = useNavigate()

    useEffect(() => {
        console.log(isSuccess || isDelSuccess)
    }, [isSuccess, isDelSuccess, navigate])

    if (invoice) {
        const created = new Date(invoice.published_date).toLocaleString('ru-RU', { day: 'numeric', month: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })

        const handleEdit = () => navigate(`/dash/invoices/${invoiceId}`)

        return (
            <tr className="table__row">
                <td className="table__cell invoice__created">{created}</td>
                <td className="table__cell invoice__title">{invoice.title}</td>
                <td className="table__cell invoice__username">{invoice.username}</td>

                <td className="table__cell">
                    <div className="d-flex justify-content-between">
                        <span
                            className="pointer anticlockwise_arrow" data-bs-toggle="tooltip" title="отменить Квитанцию"
                            onClick={onUpdateMaterialClicked}
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
            </tr>
        )

    } else return null
}

const memoizedInvoice = memo(Invoice)

export default memoizedInvoice