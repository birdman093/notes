'use client'

import React, {useEffect, useState} from 'react';
import { Workspace } from './workspace';
import '../styles/header.css'

function Header() {
    return (
        <header>
            <h1><img className='quilt-logo' src='quilt_name.png'/>Notes</h1>
        </header>
    );
}

export default function ReactApp() {
    return (
        <main>
            <Header />
            <Workspace />
        </main>
    );
}