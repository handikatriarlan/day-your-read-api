import { Hono } from 'hono';

import { validateBody } from '../middlewares/validate.middleware';
import { registerSchema } from '../schemas/auth.schema';
import { register } from '../controllers/registerController';

const router = new Hono()

router.post('/register', validateBody(registerSchema), register);

export const Routes = router;
