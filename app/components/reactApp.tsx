'use client'

import React, {useEffect, useState} from 'react';
import { Workspace } from './workspace';
import { Header } from './header';
import '../styles/header.css';

export default function ReactApp() {
    return (
        <main>
            <Header />
            <Workspace />
        </main>
    );
}