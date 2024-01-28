import {
    createSelector,
    createEntityAdapter
} from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice"

const materialsAdapter = createEntityAdapter({})

const initialState = materialsAdapter.getInitialState()

export const materialsApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getMaterials: builder.query({
            query: () => ({
                url: '/invoices/materials',
                validateStatus: (response, result) => {
                    return response.status === 200 && !result.isError
                },
            }),
            transformResponse: responseData => {
                const loadedMaterials = responseData.map(material => {
                    material.id = material._id
                    return material
                });
                return materialsAdapter.setAll(initialState, loadedMaterials)
            }
        }),
        addNewMaterial: builder.mutation({
            query: initialMaterial => ({
                url: '/invoices/materials',
                method: 'POST',
                body: {
                    ...initialMaterial,
                }
            }),
            invalidatesTags: [
                { type: 'Material', id: "LIST" }
            ]
        }),
        updateMaterial: builder.mutation({
            query: initialMaterial => ({
                url: '/invoices/materials',
                method: 'PATCH',
                body: {
                    ...initialMaterial,
                }
            }),
            invalidatesTags: (result, error, arg) => [
                { type: 'Material', id: arg.id }
            ]
        }),
        deleteMaterial: builder.mutation({
            query: ({ id }) => ({
                url: `/invoices/materials`,
                method: 'DELETE',
                body: { id }
            }),
            invalidatesTags: (result, error, arg) => [
                { type: 'Material', id: arg.id }
            ]
        }),
    }),
})

export const {
    useGetMaterialsQuery,
    useAddNewMaterialMutation,
    useUpdateMaterialMutation,
    useDeleteMaterialMutation,
} = materialsApiSlice

// returns the query result object
export const selectMaterialsResult = materialsApiSlice.endpoints.getMaterials.select()

// creates memoized selector
const selectMaterialsData = createSelector(
    selectMaterialsResult,
    materialsResult => materialsResult.data // normalized state object with ids & entities
)

//getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
    selectAll: selectAllMaterials,
    selectById: selectMaterialById,
    selectIds: selectMaterialIds
    // Pass in a selector that returns the materials slice of state
} = materialsAdapter.getSelectors(state => selectMaterialsData(state) ?? initialState)