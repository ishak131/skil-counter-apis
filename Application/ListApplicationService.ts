import ListRepositoryInterface from "../core/ListRepositoryInterface";
import List from "../core/List";

export default class ListApplicationService {
    private _listRepository: ListRepositoryInterface;

    constructor(listRepository: ListRepositoryInterface) {
        this._listRepository = listRepository;
    }

    public createList(name: string, userId: string){
        const list = List.buildList(name, userId);
        this._listRepository.addList(list);
    }

    public renameList(listId: string, newName: string, userId: string){
        const list = this._listRepository.getList(listId);
        if(userId !== list.getUserId()) throw new Error("You Don't have the permission to change this list")

        list.setName(newName);
        this._listRepository.saveList(list);
    }


}