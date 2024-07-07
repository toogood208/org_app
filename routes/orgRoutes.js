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
  .route('/organizations')
  .post(authentication, createOrganization)
  .get(authentication, getOrganization);

router.route('/users/:id').get(authentication, getUserById);

router
  .route('/organizations/:orgId')
  .get(authentication, getSingleOrganization);

router.route('/organizations/:orgId/users').post(addUserToOrganozation);

export default router;
