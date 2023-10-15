import React, { useContext, useState } from 'react';
import { Item } from './types';
import { WorkspaceContext } from './workspace';
import Button from '@mui/material/Button';
import { itemIcon } from './itemIcon';

import '../styles/directory.css'


interface DirectoryViewProps {
    directory: Item;
}

const DirectoryView: React.FC<DirectoryViewProps> = ({ directory}) => {
    const { addNote, addDirectory, setCurrentItem, deletion } = useContext(WorkspaceContext);
    const [selectedItems, setSelectedItems] = useState<Item[]>([]);
    const [lastClickedItem, setLastClickedItem] = useState<number | null>(null);

    const handleAddNote = () => {
        const fileName = window.prompt("Enter the name of the new note:");
        if (fileName === null) return;
        addNote(fileName, "");
    };

    const handleAddDirectory = () => {
        const dirName = window.prompt("Enter the name of the new directory:");
        if (dirName === null) return;
        addDirectory(dirName);
    };

    const handleDelete = () => {
        if(selectedItems.length == 0){
            alert("No items selected");
            return
        }
        const fileNames = selectedItems.map(item => item.name);
        const fileList = fileNames.join('\n');
        const confirmationMessage = `Please confirm you would like to delete the following files:\n\n${fileList}`;

        if (window.confirm(confirmationMessage)) {
            deletion(selectedItems);
        }
    }

    const handleItemClick = (item: Item) => {
        setCurrentItem(item);
    };

    // Similar to Google Drive logic
    const handleSelectionClick = (event: React.MouseEvent, childItem: Item, index: number) => {
        // Shift held and previously clicked item
        if (event.shiftKey && lastClickedItem !== null) {
            const start = Math.min(lastClickedItem, index);
            const end = Math.max(lastClickedItem, index);
            const itemsToSelect = directory.items?.slice(start, end + 1);
            if (itemsToSelect) {
                setSelectedItems(prevItems => [...Array.from(new Set([...prevItems, ...itemsToSelect]))]);
            }
        } else {
            if (selectedItems.includes(childItem)) {
                setSelectedItems([]);
            } else {
                setSelectedItems([childItem]);
            }
        }
        setLastClickedItem(index);
    };
    

    return (
        <div>
            <div className='push-button'>
                <Button className = "custom-button" onClick={handleAddNote} 
                variant="contained">+ Note</Button>
                <Button className = "custom-button" onClick={handleAddDirectory} 
                variant="contained">+ Directory</Button>
                <Button className = "custom-button" onClick={handleDelete} 
                variant="contained">- Delete</Button>
            </div>
            
            <table className="dirSection">
                <tbody>
                    <th>
                        <td>Name</td>
                    </th>
                    {directory.items?.map((childItem, index) => (
                        <tr className={`dirItem no-select ${selectedItems.includes(childItem) ? "selected" : ""}`}
                        key={index} 
                        onDoubleClick={() => handleItemClick(childItem)} 
                        onClick={(event) => handleSelectionClick(event, childItem, index)}>
                            <td className="td-content">{itemIcon(childItem)}<span className="list-item">{childItem.name}</span></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default DirectoryView;