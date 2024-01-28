import { useGetNotesQuery } from "./notesApiSlice"
import Note from "./Note"
import useAuth from "../../hooks/useAuth"
import useTitle from "../../hooks/useTitle"
import PulseLoader from 'react-spinners/PulseLoader'
import './style.css'
import { useGetMaterialsQuery } from "../invoice/materialsApiSlice"

const NotesList = () => {
    useTitle('techNotes: Notes List')

    const { username, isManager, isAdmin } = useAuth()

    const {
        data
    } = useGetMaterialsQuery('materialsList', {
        selectFromResult: ({ data }) => ({
            data: data?.ids.map(id => data?.entities[id])
        }),
        refetchOnFocus: true,
        refetchOnMountOrArgChange: true
    })

    if (data) {
        console.dir("IT IS OBJECT" + data)
    }

    const {
        data: notes,
        isSuccess: sdfgsdf,
        isError: srgsrg,
        error: strgrwqe
    } = useGetNotesQuery('notesList', {
        pollingInterval: 15000,
        refetchOnFocus: true,
        refetchOnMountOrArgChange: true
    })


    let content



    if (sdfgsdf) {
        const { ids, entities } = notes
        console.dir("notes" + notes)
        let filteredIds
        if (isManager || isAdmin) {
            filteredIds = [...ids]
        } else {
            filteredIds = ids.filter(noteId => entities[noteId].username === username)
        }

        const tableContent = ids?.length && filteredIds.map(noteId => <Note key={noteId} noteId={noteId} />)

        content = (
            <table className="table table--notes">
                <thead className="table__thead">
                    <tr className="tr_notes">
                        <th scope="col" className="table__th note__status">Username</th>
                        <th scope="col" className="table__th note__created">Created</th>
                        <th scope="col" className="table__th note__updated">Updated</th>
                        <th scope="col" className="table__th note__title">Title</th>
                        <th scope="col" className="table__th note__username">Owner</th>
                        <th scope="col" className="table__th note__edit">Edit</th>
                    </tr>
                </thead>
                <tbody className="tbody_notes">
                    {tableContent}
                </tbody>
            </table>
        )
    }

    return content
}
export default NotesList