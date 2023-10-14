import React, { useState, useContext, useCallback } from 'react';
import { Item } from './types';
import NoteView from './noteView';
import DirectoryView from './directoryView';
import Button from '@mui/material/Button';

import _ from 'lodash';

import '../styles/workspace.css'


function ItemView(item: Item) {
    const { itemStack, setCurrentItem } = useContext(WorkspaceContext);

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

    const itemIcon = (pathItem: Item):JSX.Element => {
        if (pathItem.type == 'note'){
            return <img src='/document.png'></img>
        } else {
            return <img src='/folder.png'></img>
        }
    }
    
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
            <h3>{itemIcon(item)} {item.name}</h3>
            <div className="item">    
                {item.type == 'directory' && (
                    <DirectoryView directory={item} />
                )}
                {item.type == 'note' && (
                    <NoteView note={item} />
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
}

export const WorkspaceContext = React.createContext<WorkspaceContextProps>({
    currentItem: null,
    itemStack: [],
    setCurrentItem: (item: Item) => {},
    addNote: (fileName: string, noteText: string) => {},
    addDirectory: (newDirName: string) => {},
    updateNote: (newText: string) => {},
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
            }
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

    return (
        <div className="workspace">
            <WorkspaceContext.Provider value={{ currentItem, itemStack, setCurrentItem, addNote, addDirectory, updateNote }}>
                <ItemView {...currentItem} />
            </WorkspaceContext.Provider>
        </div>
    );
}