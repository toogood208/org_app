import { expect } from 'chai';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import sinon from 'sinon';
import { generateToken } from '../util/generateToken.js';

dotenv.config({ path: `${process.cwd()}/.env` });

describe('Auth Controller - generateToken', () => {
  let sandbox;

  before(() => {
    
    process.env.JWT_SECRET_KEY = 'testsecret';
    process.env.JWT_EXPIRES_DAY = '1d';
  });

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should return a valid JWT token', () => {
    const payload = { id: 'test-user-id' };
    const token = generateToken(payload);

    
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    expect(decoded).to.have.property('id', payload.id);
    expect(decoded).to.have.property('iat');
    expect(decoded).to.have.property('exp');
  });

  it('should set the correct expiration', () => {
    const payload = { id: 'test-user-id' };
    const token = generateToken(payload);

   
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const expectedExpiration = Math.floor(Date.now() / 1000) + (60 * 60 * 24); 

    expect(decoded.exp).to.be.closeTo(expectedExpiration, 120); 
  });

  it('should include the correct payload', () => {
    const payload = { id: 'test-user-id' };
    const token = generateToken(payload);

 
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    expect(decoded).to.include(payload);
  });
});
