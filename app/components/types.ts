export interface Item {
    type: 'note' | 'directory'
    name: string
    parent?: Item
    note?: string
    items?: Item[]
}