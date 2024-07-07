import sinon from 'sinon';
import { getOrganization, getSingleOrganization } from '../controller/organizationController.js';
import User from '../db/models/user.js';
import organization from '../db/models/organization.js';
import userorganization from '../db/models/userorganization.js';
import AppError from '../util/appError.js';
import { expect } from 'chai'; // Import expect from chai

describe('Organization Controller', () => {
  let req, res, next, sandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    req = {
      user: { userId: 'test-user-id' },
      params: {},
      body: {}
    };

    res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub().returnsThis()
    };

    next = sinon.stub();
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('getOrganization', () => {
    // ... existing tests for getOrganization ...
  });

  describe('getSingleOrganization',  () => {
    it('should return the organization if the user is associated with it', async () => {
      const orgData = { orgId: 'org-1', name: 'Org 1', description: 'Description 1' };
      req.params.orgId = 'org-1';

      sandbox.stub(organization, 'findByPk').resolves(orgData);

      await getSingleOrganization(req, res, next);

      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledWith({
        status: 'success',
        message: 'organization fetched successfully',
        data: orgData
      })).to.be.true;
    });

    it('should return error if the organization is not found', async () => {
      req.params.orgId = 'non-existent-org';

      sandbox.stub(organization, 'findByPk').resolves(null);

      await getSingleOrganization(req, res, next);

      expect(next.calledOnce).to.be.true;
      expect(next.firstCall.args[0]).to.be.instanceOf(AppError);
      expect(next.firstCall.args[0].message).to.equal('Organization not found'); // Change error message if different
    });

    // Add additional test cases here:
    // - Test case for handling invalid organization ID in params
    // - Test case for handling potential errors from organization.findByPk
  });
});
