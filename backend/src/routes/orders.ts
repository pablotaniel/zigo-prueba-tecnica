import { Router, Request, Response } from 'express';
import { handleCreateOrder } from '../commands/create-order/CreateOrderHandler';
import { handleGetOrder } from '../queries/get-order/GetOrderHandler';
import { handleGetProducts } from '../queries/list-products/GetProductsHandler';

const router = Router();

router.get('/products', async (_req: Request, res: Response) => {
  try {
    const products = await handleGetProducts();
    res.json(products);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id?', async (req: Request, res: Response) => {
  try {
    const result = await handleGetOrder(req.params.id);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req: Request, res: Response) => {
  try {
    const result = await handleCreateOrder(req.body);
    res.status(201).json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
