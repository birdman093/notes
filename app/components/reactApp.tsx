'use client'

import React, {useEffect, useState} from 'react';
import { Workspace } from './workspace';
import '../styles/header.css'

function Header() {
    return (
        <header>
            <h1><img className='feathers-logo' src='feathers.png'/><img className='quilt-logo' src='ql.png'/><span className="header-name">Notes</span></h1>
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