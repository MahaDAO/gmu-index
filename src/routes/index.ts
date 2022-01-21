import { Router } from 'express';
import { GMU } from '../controller/exchangePrices'

const router = Router();

router.get('/', (req: any, res: any) => {
    res.json({
        status: 'online'
    });
});

router.get('/gmu', (req: any, res: any) => { GMU(req, res) });

export default router;
