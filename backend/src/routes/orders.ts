import { Router, Request, Response } from 'express';
import { handleGetOrders } from '../queries/order/listOrders';
import { handleGetOrder } from '../queries/order/getOrder';
import { handleCreateOrder } from '../commands/order/CreateOrderHandler';
import { handleUpdateOrder } from '../commands/order/UpdateOrderHandler';
import { handleDeleteOrder } from '../commands/order/DeleteOrderHandler';

const router = Router();

router.get('/', async (_req: Request, res: Response) => {
  try {
    const orders = await handleGetOrders();

    res.json(orders);
  } catch (error: any) {
    res.status(500).json({
      error: error.message,
    });
  }
});

router.get('/:id', async (req: Request, res: Response) => {
  try {
    const order = await handleGetOrder(req.params.id);

    if (!order) {
      return res.status(404).json({
        error: 'Orden no encontrada',
      });
    }

    res.json(order);
  } catch (error: any) {
    res.status(500).json({
      error: error.message,
    });
  }
});

router.post('/', async (req: Request, res: Response) => {
  try {
    const {
      customer_id,
      status,
      notes,
      items,
    } = req.body;

    if (!customer_id) {
      return res.status(400).json({
        error: 'El cliente es obligatorio',
      });
    }

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        error: 'La orden debe tener al menos un producto',
      });
    }

    for (const item of items) {
      if (!item.product_id) {
        return res.status(400).json({
          error: 'Todos los productos deben tener product_id',
        });
      }

      if (Number(item.quantity) <= 0) {
        return res.status(400).json({
          error: 'La cantidad debe ser mayor que cero',
        });
      }

      if (Number(item.unit_price) < 0) {
        return res.status(400).json({
          error: 'El precio no puede ser negativo',
        });
      }
    }

    const order = await handleCreateOrder({
      customer_id,
      status: status || 'DRAFT',
      notes,
      items,
    });

    res.status(201).json(order);
  } catch (error: any) {
    res.status(500).json({
      error: error.message,
    });
  }
});

router.put('/:id', async (req: Request, res: Response) => {
  try {
    const {
      customer_id,
      status,
      notes,
      items,
    } = req.body;

    if (!customer_id) {
      return res.status(400).json({
        error: 'El cliente es obligatorio',
      });
    }

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        error: 'La orden debe tener al menos un producto',
      });
    }

    const order = await handleUpdateOrder(req.params.id, {
      customer_id,
      status: status || 'DRAFT',
      notes,
      items,
    });

    if (!order) {
      return res.status(404).json({
        error: 'Orden no encontrada',
      });
    }

    res.json(order);
  } catch (error: any) {
    res.status(500).json({
      error: error.message,
    });
  }
});

router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const deleted = await handleDeleteOrder(req.params.id);

    if (!deleted) {
      return res.status(404).json({
        error: 'Orden no encontrada',
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