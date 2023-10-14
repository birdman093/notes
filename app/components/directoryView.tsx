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
        window.confirm("Please confirm you would like to delete the selected files")
        deletion(selectedItems);
    }

    const handleItemClick = (item: Item) => {
        setCurrentItem(item);
    };

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
                <Button className='push-button' onClick={handleAddNote} variant="contained"
                sx={{
                    marginRight: 2,
                    backgroundColor: '#6a3481',
                    '&:hover': {
                        backgroundColor: '#8c4ba2'
                    }
                  }}>+ Note</Button>
                <Button className='push-button' onClick={handleAddDirectory} variant="contained"
                sx={{
                    marginRight: 2,
                    backgroundColor: '#6a3481',
                    '&:hover': {
                        backgroundColor: '#8c4ba2'
                    }
                  }}>+ Directory</Button>
                <Button className='push-button' onClick={handleDelete} variant="contained"
                sx={{
                    backgroundColor: '#6a3481',
                    '&:hover': {
                        backgroundColor: '#8c4ba2'
                    }
                  }}>- Delete</Button>
            </div>
            
            <table className="dirSection">
                <tbody>
                    {directory.items?.map((childItem, index) => (
                        <tr className={`dirItem ${selectedItems.includes(childItem) ? "selected" : ""}`}
                        key={index} 
                        onDoubleClick={() => handleItemClick(childItem)} 
                        onClick={(event) => handleSelectionClick(event, childItem, index)}>
                            <td>{itemIcon(childItem)}{childItem.name}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default DirectoryView;