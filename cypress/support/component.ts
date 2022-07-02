/// <reference path="./cypress.d.ts" />
// ***********************************************************
// https://on.cypress.io/configuration
// ***********************************************************
import './commands';
import { Cypress } from 'local-cypress';
import { mount } from 'cypress/react';

// Ensure global app styles are loaded:
import '../../src/index.css';
import '../../src/App.css';

Cypress.Commands.add('mount', mount);
