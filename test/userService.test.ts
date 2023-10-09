import { expect } from 'chai';
import sinon, { SinonStub, SinonSandbox } from 'sinon';
import * as userService from '../src/service/userService';
import User from '../src/models/users';
import bcrypt from 'bcrypt';
import { before, describe, it } from 'mocha';

const SALT_ROUNDS = 10;
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
    let getProfileStub: SinonStub;

    before(() => {
        sandbox = sinon.createSandbox();
    });

    beforeEach(() => {
        sandbox.restore();
        createStub = sandbox.stub(User, 'create');
        findOneByUsernameStub = sandbox.stub(userService, 'findOneByUsername');
        getProfileStub = sandbox.stub(userService, 'getProfile');
    });

    after(() => {
        sandbox.restore();
    });

    it('should create a new user with additional fields', async () => {
        findOneByUsernameStub.resolves(null);

        const hashedPassword = await bcrypt.hash('Password123', SALT_ROUNDS);
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

        // Omit password from the expected result for comparison
        const { password, ...expectedUser } = newUser;
        expect(result).to.deep.equal(expectedUser);
    });

    it('should successfully login a user', async () => {
        const user: UserWithPassword = {
            id: '12345',
            username: 'testuser',
            email: 'test@example.com',
            password: await bcrypt.hash('Password123', SALT_ROUNDS),
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
        
        // Omit password from the expected user in the result for comparison
        const { password, ...expectedUser } = user;
        expect(result.user).to.deep.equal(expectedUser);
        expect(result).to.have.property('token');
    });

    it('should handle errors for invalid username or password', async () => {
        const user: UserWithPassword = {
            id: '12345',
            username: 'testuser',
            email: 'test@example.com',
            password: await bcrypt.hash('Password123', SALT_ROUNDS),
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

    it('should get the profile of a user', async () => {
        const hashedPassword = await bcrypt.hash('Password123', SALT_ROUNDS);

        const user: UserWithPassword = {
            id: '12345',
            username: 'testuser',
            email: 'test@example.com',
            password: hashedPassword,
            name: 'Test User',
            phoneNumber: '1234567890',
            city: 'Test City',
            pincode: '12345',
        };

        getProfileStub.resolves(user);

        const result = await userService.getProfile('testuser');

        sinon.assert.calledOnce(getProfileStub);
        sinon.assert.calledWithExactly(getProfileStub, 'testuser');

        // Omit password from the expected profile in the result for comparison
        const { password, ...expectedProfile } = user;
        expect(result).to.deep.equal(expectedProfile);
    });

});
