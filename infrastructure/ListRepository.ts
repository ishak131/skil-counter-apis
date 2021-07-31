import ListRepositoryInterface from "../core/ListRepositoryInterface";
import List from "../core/List";
import ListModel from "./schemas/ListModel";


export default class ListRepository implements ListRepositoryInterface {


    async addList(list: List) {
        const listmpde = new ListModel({
            name: list.name
        })
        await listmpde.save()
    }

    deleteList(listId){
        throw new Error("not implemented");
    }

    getList(listId: string): List {
        return undefined;
    }

    saveList(list: List): void {
    }
}