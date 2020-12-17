import { Message } from 'element-ui'
import * as API from '../../api'

export default {
    state: {
        category: {
            category1Id: '',
            category2Id: '',
            category3Id: '',
        },
        category1List: [],
        category2List: [],
        category3List: []
    },
    actions: {
        /* 
            this.category2List = [];
            this.category3List = [];
            this.category.category2Id = "";
            this.category.category3Id = "";
        */
        async getCategory1List(commit) {
            const result = await API.attrs.getCategorys1();
            if (result.code === 200) {
                commit('GET_CATEGORY1_LIST', { category1Id, category2List: result.data })
            } else {
                Message.error(result.message);
            }
        },
        async getCategory2List(commit, { category2Id }) {
            const result = await API.attrs.getCategorys2(category2Id);
            if (result.code === 200) {
                commit('GET_CATEGORY2_LIST_SUCCESS', result.data)
            } else {
                commit('GET_CATEGORY2_LIST_ERROR')
                Message.error(result.message);
            }
        }

    },
    mutations: {
        GET_CATEGORY1_LIST(state, category1List) {
            state.category1List = category1List
        },
        GET_CATEGORY2_LIST_SUCCESS(state, category2List) {
            state.category2List = category2List
        },
        GET_CATEGORY2_LIST_ERROR(state, category2List) {

        }
    },
    getters: {}
}