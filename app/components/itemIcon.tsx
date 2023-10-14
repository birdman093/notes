import { Item } from './types';

export const itemIcon = (pathItem: Item):JSX.Element => {
    if (pathItem.type == 'note'){
        return <img src='/document.png'></img>
    } else {
        return <img src='/folder.png'></img>
    }
}