// This file will run first (before any tests) when calling `npm run test`

process.env.NODE_ENV = 'test';

// Test set up (defining global variables etc)

import chai from 'chai';
global.expect = chai.expect;

import supertest from 'supertest';
import expressApp from '../server.js';
global.api = supertest(expressApp);
