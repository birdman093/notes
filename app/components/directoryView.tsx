import React, { useContext } from 'react';
import { Item } from './types';
import { WorkspaceContext } from './workspace';
import Button from '@mui/material/Button';

import '../styles/directory.css'


interface DirectoryViewProps {
    directory: Item;
}

const DirectoryView: React.FC<DirectoryViewProps> = ({ directory }) => {
    const { addNote, addDirectory, setCurrentItem } = useContext(WorkspaceContext);

    const handleAddNote = () => {
        const fileName = window.prompt("Enter the name of the new note:");
        if (fileName === null) return;
        const noteText = window.prompt("Enter the text of the new note:");
        if (noteText === null) return;
        addNote(fileName, noteText);
    };

    const handleAddDirectory = () => {
        const dirName = window.prompt("Enter the name of the new directory:");
        if (dirName === null) return;
        addDirectory(dirName);
    };

    const handleItemClick = (item: Item) => {
        setCurrentItem(item);
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
            </div>
            
            <table className="dirSection">
                <tbody>
                    {directory.items?.map((childItem, index) => (
                        <tr className="dirItem" key={index} onClick={() => handleItemClick(childItem)}>
                            <td>{childItem.name}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default DirectoryView;