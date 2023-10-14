import React, { useState, useContext } from 'react';
import { Item } from './types';
import { WorkspaceContext } from './workspace';
import Button from '@mui/material/Button';

import '../styles/note.css'

interface NoteViewProps {
    note: Item;
}

const NoteView: React.FC<NoteViewProps> = ({ note}) => {
    const { updateNote } = useContext(WorkspaceContext);
    const [isEditing, setIsEditing] = useState(false);
    const [text, setText] = useState(note.note);


    const handleNoteChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setText(event.target.value);
    };

    const handleNoteSubmit = () => {
        if (text == null) {
            alert('Cannot save empty note.');
            return
        }
        
        updateNote(text);
        setIsEditing(false);
    };

    const handleNoteCancel = () => {
        setText(note.note);
        setIsEditing(false);
    };

    return (
        <div>
            <div className="noteSection"  onClick={() => {
                if (!isEditing) {
                    setIsEditing(true)}
                }
            }>
                {isEditing ? (
                    <div className="full-width-div">
                        <textarea
                            rows={20}
                            value={text}
                            onChange={handleNoteChange}
                            className="full-width-input"
                        />
                    </div>

                ) : (
                    <div>
                        {text}
                    </div>
                )}
            </div>
            {isEditing ? (<Button className='push-button' onClick={handleNoteSubmit} variant="contained"
            sx={{
                marginRight: 2,
                backgroundColor: '#6a3481',
                '&:hover': {
                    backgroundColor: '#8c4ba2'
                }
              }}>Save</Button>):(<></>)}
            {isEditing ? (<Button className='push-button' onClick={handleNoteCancel} variant="contained"
            sx={{
                marginRight: 2,
                backgroundColor: '#6a3481',
                '&:hover': {
                    backgroundColor: '#8c4ba2'
                }
              }}>Cancel</Button>):(<></>)}
        </div>

    );
};

export default NoteView;
