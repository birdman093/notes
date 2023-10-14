import React, { useState, useContext, useCallback, useEffect } from 'react';
import { Item } from './types';
import NoteView from './noteView';
import DirectoryView from './directoryView';
import Button from '@mui/material/Button';
import { itemIcon } from './itemIcon';

import _ from 'lodash';

import '../styles/workspace.css'


function ItemView(item: Item) {
    const { itemStack, setCurrentItem, updateName } = useContext(WorkspaceContext);
    const [isEditing, setIsEditing] = useState(false);
    const [editableName, setEditableName] = useState(item.name);

    useEffect(() => {
        setEditableName(item.name);
    }, [item.name]);

    const goToEnclosingFolder = useCallback(() => {
        if (item.parent == null) {
            alert('Cannot go to enclosing folder.');
            return;
        }
        setCurrentItem(item.parent);
    }, [item, setCurrentItem]);

    const fullFilePath = (pathItem: Item):string => {
        let pathList: string[] = [];
        let currentItem: Item | undefined = pathItem;
        while (currentItem != undefined)
        {
            pathList.unshift(currentItem.name);
            currentItem = currentItem.parent;
        }
        return pathList.join('/');
    }

    const handleDoubleClick = () => {
        setIsEditing(true);
    };

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEditableName(e.target.value);
    };
    
    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        setIsEditing(false);
        updateName(editableName);
    };
    
    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            setIsEditing(false);
            updateName(editableName);
        }
    };
    
    return (
        <div>
            <h2>Path: {fullFilePath(item)}</h2>
            {item.parent != null && 
            <Button onClick={goToEnclosingFolder} variant="contained"
                sx={{
                    marginRight: 2,
                    backgroundColor: '#6a3481',
                    '&:hover': {
                        backgroundColor: '#8c4ba2'
                    }
                  }}>Previous Directory</Button>
            }
            <h3 onDoubleClick={handleDoubleClick}>
                {itemIcon(item)} 
                {isEditing ? (
                    <input 
                        type="text" 
                        className="editable-input"
                        value={editableName} 
                        onChange={handleNameChange} 
                        onBlur={handleBlur} 
                        onKeyDown={handleKeyPress} 
                        autoFocus
                    />
                ) : (
                    <span className="name-container">{item.name}</span>
                )}
            </h3>
            <div className="item">    
                {item.type == 'directory' && (
                    <DirectoryView directory={item}/>
                )}
                {item.type == 'note' && (
                    <NoteView note={item}/>
                )}
            </div>
        </div>
    );
}


interface WorkspaceContextProps {
    currentItem: Item | null;
    itemStack: Item[];
    setCurrentItem: (item: Item) => void;
    addNote: (fileName: string, noteText: string) => void;
    addDirectory: (newDirName: string) => void;
    updateNote: (newText: string) => void;
    deletion: (selectedItems: Item[]) => void;
    updateName: (newName: string) => void;
}

export const WorkspaceContext = React.createContext<WorkspaceContextProps>({
    currentItem: null,
    itemStack: [],
    setCurrentItem: (item: Item) => {},
    addNote: (fileName: string, noteText: string) => {},
    addDirectory: (newDirName: string) => {},
    updateNote: (newText: string) => {},
    deletion: (selectedItems: Item[]) => {},
    updateName: (newName: string) => {}
});

export function Workspace() {
    const [itemStack, setItemStack] = useState<Item[]>([
        {
            name: 'root',
            type: 'directory',
            items: [],
        },
    ]);

    const setCurrentItem = useCallback((item: Item) => {
        setItemStack((prevStack: Item[]) => [...prevStack, item]);
    }, []);

    const addNote = useCallback((fileName: string, noteText: string) => {
        setItemStack(prevStack => {
            // Deep clone the itemStack
            const updatedStack = _.cloneDeep(prevStack);
            const currentDir = updatedStack[updatedStack.length - 1];
            if (currentDir.type === 'directory') {
                const newNote: Item = {
                    type: 'note',
                    name: fileName,
                    note: noteText,
                    parent: currentDir,
                };
                currentDir.items = currentDir.items ? [...currentDir.items, newNote] : [newNote];

                if (newNote.parent && newNote.parent.items){
                    newNote.parent.items = sortItems(newNote.parent.items);
                }
            }
            return updatedStack;
        });
    }, []);
    
    const addDirectory = useCallback((newDirName: string) => {
        setItemStack(prevStack => {
            // Deep clone the itemStack
            const updatedStack = _.cloneDeep(prevStack);
            const currentDir = updatedStack[updatedStack.length - 1];
            if (currentDir.type === 'directory') {
                const newDir: Item = {
                    type: 'directory',
                    name: newDirName,
                    items: [],
                    parent: currentDir,
                };
                currentDir.items = currentDir.items ? [...currentDir.items, newDir] : [newDir];
                if (newDir.parent && newDir.parent.items){
                    newDir.parent.items = sortItems(newDir.parent.items);
                }
            }
            return updatedStack;
        });
    }, []);

    const deletion = useCallback((selectedItems: Item[]) => {
        if (selectedItems.length === 0)
            {
                alert("No deletion. No selected items")
                return; 
            }

        setItemStack(prevStack => {
            // Deep clone the itemStack
            const updatedStack = _.cloneDeep(prevStack);
            const currentDir = updatedStack[updatedStack.length - 1];

            if (currentDir.items === undefined || currentDir.items.length === 0)
            {
                alert("No deletion. Current directory has no items")
                return updatedStack; 
            } 

            currentDir.items = currentDir.items.filter(item => !selectedItems.some(removeItem => removeItem.name === item.name));
            currentDir.items = sortItems(currentDir.items);
            return updatedStack;
        });

        
    }, []);

    const updateName = useCallback((newName: string) => {

        setItemStack(prevStack => {
            const updatedStack = [...prevStack];
            const currentItem = updatedStack[updatedStack.length - 1];
            currentItem.name = newName;
            updatedStack[updatedStack.length - 1] = { ...currentItem };
            return updatedStack;
        });
    }, []);
    
    const updateNote = useCallback((newText: string) => {
        setItemStack(prevStack => {
            const updatedStack = [...prevStack];
            const currentItem = updatedStack[updatedStack.length - 1];
            if (currentItem.type === 'note') {
                currentItem.note = newText;
                updatedStack[updatedStack.length - 1] = { ...currentItem };
            }
            return updatedStack;
        });
    }, []);

    const currentItem = itemStack[itemStack.length - 1];

    const sortItems = (items: Item[]): Item[] => {
        return items.sort((a, b) => {
            // Ensure directories are on top
            if (a.type === 'directory' && b.type !== 'directory') {
                return -1;
            }
            if (a.type !== 'directory' && b.type === 'directory') {
                return 1;
            }
    
            // Same type, sort them alphabetically by name
            return a.name.localeCompare(b.name);
        });
    };

    return (
        <div className="workspace">
            <WorkspaceContext.Provider value={{ currentItem, itemStack, setCurrentItem, addNote, addDirectory, updateNote, deletion, updateName}}>
                <ItemView {...currentItem} />
            </WorkspaceContext.Provider>
        </div>
    );
}