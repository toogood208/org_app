import express from 'express';
import {
  createOrganization,
  getOrganization,
  getUserById,
  getSingleOrganization,
  addUserToOrganozation,
} from '../controller/organizationController.js';
import  {authentication}  from '../controller/authController.js';

const router = express.Router();

router
  .route('/organisations')
  .post(authentication, createOrganization)
  .get(authentication, getOrganization);

router.route('/users/:id').get(authentication, getUserById);

router
  .route('/organisations/:orgId')
  .get(authentication, getSingleOrganization);

router.route('/organisations/:orgId/users').post(addUserToOrganozation);

export default router;
