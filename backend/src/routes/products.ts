import { Router, Request, Response } from 'express';
import {
  handleCreateProduct,
  handleDeleteProduct,
  handleGetProduct,
  handleGetProducts,
  handleUpdateProduct,
} from '../queries/product/ProductHandler';

const router = Router();

router.get('/', async (_req: Request, res: Response) => {
  try {
    res.json(await handleGetProducts());
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', async (req: Request, res: Response) => {
  try {
    const product = await handleGetProduct(req.params.id);

    if (!product) {
      return res.status(404).json({
        error: 'Producto no encontrado',
      });
    }

    res.json(product);
  } catch (error: any) {
    res.status(500).json({
      error: error.message,
    });
  }
});

router.post('/', async (req: Request, res: Response) => {
  try {
    const product = await handleCreateProduct(req.body);

    res.status(201).json(product);
  } catch (error: any) {
    res.status(500).json({
      error: error.message,
    });
  }
});

router.put('/:id', async (req: Request, res: Response) => {
  try {
    const product = await handleUpdateProduct(
      req.params.id,
      req.body
    );

    if (!product) {
      return res.status(404).json({
        error: 'Producto no encontrado',
      });
    }

    res.json(product);
  } catch (error: any) {
    res.status(500).json({
      error: error.message,
    });
  }
});

router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const product = await handleDeleteProduct(
      req.params.id
    );

    if (!product) {
      return res.status(404).json({
        error: 'Producto no encontrado',
      });
    }

    res.status(204).send();
  } catch (error: any) {
    res.status(500).json({
      error: error.message,
    });
  }
});

export default router;