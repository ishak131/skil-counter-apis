import List from "./List";

export default interface ListRepositoryInterface {
    addList(list): void;
    getList(listId: string): List;
    saveList(list: List): void;
    deleteList(listId): void;
}