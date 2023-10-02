import { expect } from 'chai';
import sinon, { SinonStub, SinonSandbox } from 'sinon';
import * as userService from '../src/service/userService';
import User from '../src/models/users';
import bcrypt from 'bcrypt';
import { before, describe, it } from 'mocha';

type UserWithPassword = {
    id: string;
    username: string;
    email: string;
    password: string;
    name: string;
    phoneNumber: string;
    city: string;
    pincode: string;
};

describe('User Service', () => {
    let sandbox: SinonSandbox;
    let createStub: SinonStub;
    let findOneByUsernameStub: SinonStub;

    before(() => {
        sandbox = sinon.createSandbox();
    });

    beforeEach(() => {
        sandbox.restore();
        createStub = sandbox.stub(User, 'create');
        findOneByUsernameStub = sandbox.stub(userService, 'findOneByUsername');
    });

    after(() => {
        sandbox.restore();
    });

    it('should create a new user with additional fields', async () => {
        findOneByUsernameStub.resolves(null);

        const hashedPassword = await bcrypt.hash('Password123', 10);
        const newUser: UserWithPassword = {
            id: '12345',
            username: 'testuser',
            email: 'test@example.com',
            password: hashedPassword,
            name: 'Test User',
            phoneNumber: '1234567890',
            city: 'Test City',
            pincode: '12345',
        };

        createStub.resolves(newUser);

        const result = await userService.createUser(
            'testuser',
            'test@example.com',
            'Password123',
            'Test User',
            '1234567890',
            'Test City',
            '12345'
        );

        sinon.assert.calledOnce(createStub);
        sinon.assert.calledWithMatch(createStub, {
            username: 'testuser',
            name: 'Test User',
            email: 'test@example.com',
            phoneNumber: '1234567890',
            city: 'Test City',
            pincode: '12345',
        });

        const { password, ...expectedUser } = newUser;
        expect(result).to.deep.equal(expectedUser);
    });




    it('should successfully login a user', async () => {
        const user: UserWithPassword = {
            id: '12345',
            username: 'testuser',
            email: 'test@example.com',
            password: await bcrypt.hash('Password123', 10),
            name: 'Test User',
            phoneNumber: '1234567890',
            city: 'Test City',
            pincode: '12345',
        };

        findOneByUsernameStub.resolves(user);

        const result = await userService.loginUser(
            'testuser',
            'Password123'
        );

        sinon.assert.calledOnce(findOneByUsernameStub);
        sinon.assert.calledWithExactly(findOneByUsernameStub, 'testuser');

        expect(result.status).to.equal(200);
        expect(result.message).to.equal('Login successful');
        expect(result.user).to.deep.equal({
            id: '12345',
            username: 'testuser',
            name: 'Test User',
            email: 'test@example.com',
            phoneNumber: '1234567890',
            city: 'Test City',
            pincode: '12345',
        });
        expect(result).to.have.property('token');
    });

    it('should handle errors for invalid username or password', async () => {
        const user: UserWithPassword = {
            id: '12345',
            username: 'testuser',
            email: 'test@example.com',
            password: await bcrypt.hash('Password123', 10),
            name: 'Test User',
            phoneNumber: '1234567890',
            city: 'Test City',
            pincode: '12345',
        };

        findOneByUsernameStub.resolves(user);

        const result = await userService.loginUser(
            'testuser',
            'InvalidPassword'
        );

        sinon.assert.calledOnce(findOneByUsernameStub);
        sinon.assert.calledWithExactly(findOneByUsernameStub, 'testuser');

        expect(result.status).to.equal(401);
        expect(result.message).to.equal('Invalid username or password');
    });

    it('should handle errors for user not found', async () => {
        findOneByUsernameStub.resolves(null);

        const result = await userService.loginUser(
            'nonexistentuser',
            'Password123'
        );

        sinon.assert.calledOnce(findOneByUsernameStub);
        sinon.assert.calledWithExactly(findOneByUsernameStub, 'nonexistentuser');

        expect(result.status).to.equal(404);
        expect(result.message).to.equal('User not found');
    });
});
