import { expect } from 'chai';
import { Request, Response, NextFunction } from 'express';
import * as sinon from 'sinon';
import * as userService from '../src/service/userService';
import { createUser, loginUser } from '../src/controller/users';

describe('UserController', () => {
    describe('createUser', () => {
        it('should create a new user', async () => {
            const req: Partial<Request> = {
                body: {
                    username: 'testuser',
                    email: 'test@example.com',
                    password: 'password',
                    name: 'Test User',
                    phoneNumber: '1234567890',
                    city: 'Test City',
                    pincode: '12345',
                },
            };

            const sandbox = sinon.createSandbox();
            const statusStub = sandbox.stub().returnsThis();
            const jsonStub = sandbox.stub();

            const res = ({
                status: statusStub,
                json: jsonStub,
            } as unknown) as Response;

            const next: NextFunction = sinon.spy();

            sandbox.stub(userService, 'createUser').resolves({
                id: 'someUserId',
                username: 'testuser',
                name: 'Test User',
                email: 'test@example.com',
                phoneNumber: '1234567890',
                city: 'Test City',
                pincode: '12345',
            });

            await createUser(req as Request, res, next);

            expect(statusStub.calledWith(201)).to.be.true;
            expect(jsonStub.calledWithMatch({
                status: 'ok',
                message: 'Account created successfully',
                data: {
                    id: 'someUserId',
                    username: 'testuser',
                    name: 'Test User',
                    email: 'test@example.com',
                    phoneNumber: '1234567890',
                    city: 'Test City',
                    pincode: '12345',
                },
            })).to.be.true;

            sandbox.restore();  
        });

        it('should handle errors when user already exists', async () => {
            const req: Partial<Request> = {
                body: {
                    username: 'existinguser',
                    email: 'existing@example.com',
                    password: 'password',
                    name: 'Existing User',
                    phoneNumber: '9876543210',
                    city: 'Existing City',
                    pincode: '54321',
                },
            };

            const sandbox = sinon.createSandbox();
            const statusStub = sandbox.stub().returnsThis();
            const jsonStub = sandbox.stub();

            const res = ({
                status: statusStub,
                json: jsonStub,
            } as unknown) as Response;

            const next: NextFunction = sinon.spy();

            sandbox.stub(userService, 'createUser').throws(new Error('Username or email already exists'));

            await createUser(req as Request, res, next);

            expect(statusStub.calledWith(400)).to.be.true;
            expect(jsonStub.calledWithMatch({ error: 'Username or email already exists' })).to.be.true;

            sandbox.restore();  
        });
    });

    describe('loginUser', () => {
        it('should successfully login a user', async () => {
            const req: Partial<Request> = {
                body: {
                    username: 'testuser',
                    password: 'password',
                },
            };

            const sandbox = sinon.createSandbox();
            const statusStub = sandbox.stub().returnsThis();
            const jsonStub = sandbox.stub();

            const res = ({
                status: statusStub,
                json: jsonStub,
            } as unknown) as Response;

            const next: NextFunction = sinon.spy();

            sandbox.stub(userService, 'loginUser').resolves({
                status: 200,
                message: 'Login successful',
                token: 'someToken',
                user: {
                    id: 'someUserId',
                    username: 'testuser',
                    name: 'Test User',
                    email: 'test@example.com',
                    phoneNumber: '1234567890',
                    city: 'Test City',
                    pincode: '12345',
                },
            });

            await loginUser(req as Request, res, next);
            expect(statusStub.calledWith(200)).to.be.true;
            expect(jsonStub.calledWithMatch({
                status: 'ok',
                message: 'Login successful',
                token: 'someToken',
                user: {
                    id: 'someUserId',
                    username: 'testuser',
                    name: 'Test User',
                    email: 'test@example.com',
                    phoneNumber: '1234567890',
                    city: 'Test City',
                    pincode: '12345',
                },
            })).to.be.true;

            sandbox.restore();  
        });

        it('should handle errors for invalid username or password', async () => {
            const req: Partial<Request> = {
                body: {
                    username: 'testuser',
                    password: 'wrongpassword',
                },
            };

            const sandbox = sinon.createSandbox();
            const statusStub = sandbox.stub().returnsThis();
            const jsonStub = sandbox.stub();

            const res = ({
                status: statusStub,
                json: jsonStub,
            } as unknown) as Response;

            const next: NextFunction = sinon.spy();

            sandbox.stub(userService, 'loginUser').resolves({
                status: 401,
                message: 'Invalid username or password',
            });
            await loginUser(req as Request, res, next);
            expect(statusStub.calledWith(401)).to.be.true;
            expect(jsonStub.calledWithMatch({
                status: 'nok',
                message: 'Invalid username or password',
            })).to.be.true;

            sandbox.restore();  
        });

        it('should handle errors for user not found', async () => {
            const req: Partial<Request> = {
                body: {
                    username: 'nonexistentuser',
                    password: 'password',
                },
            };

            const sandbox = sinon.createSandbox();
            const statusStub = sandbox.stub().returnsThis();
            const jsonStub = sandbox.stub();

            const res = ({
                status: statusStub,
                json: jsonStub,
            } as unknown) as Response;

            const next: NextFunction = sinon.spy();
            sandbox.stub(userService, 'loginUser').resolves({
                status: 404,
                message: 'User not found',
            });

            await loginUser(req as Request, res, next);
            expect(statusStub.calledWith(404)).to.be.true;
            expect(jsonStub.calledWithMatch({
                status: 'nok',
                message: 'User not found',
            })).to.be.true;

            sandbox.restore();  
        });

    });
});
