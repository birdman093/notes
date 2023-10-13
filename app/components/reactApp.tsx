'use client'

import React, {useEffect, useState} from 'react';
import { Workspace } from './workspace';

function Header() {
    return (
        <header>
            <h1>Quilt Labs Notes Filesystem App</h1>
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