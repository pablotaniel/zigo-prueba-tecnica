import { Router, Request, Response } from 'express';
import { handleGetSuppliers } from '../queries/supplier/listSupplier';
import { handleGetSupplier } from '../queries/supplier/getSupplier';
import { handleCreateSupplier } from '../commands/supplier/CreateSupplierHandler';
import { handleUpdateSupplier } from '../commands/supplier/UpdateSupplierHandler';
import { handleDeleteSupplier } from '../commands/supplier/DeleteSupplierHandler';

const router = Router();

router.get('/', async (_req: Request, res: Response) => {
  try {
    const suppliers = await handleGetSuppliers();
    res.json(suppliers);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', async (req: Request, res: Response) => {
  try {
    const supplier = await handleGetSupplier(req.params.id);

    if (!supplier) {
      return res.status(404).json({
        error: 'Proveedor no encontrado',
      });
    }

    res.json(supplier);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', async (req: Request, res: Response) => {
  try {
    const { name, email, phone } = req.body;

    if (!name?.trim()) {
      return res.status(400).json({
        error: 'El nombre es obligatorio',
      });
    }

    const supplier = await handleCreateSupplier({
      name: name.trim(),
      email: email?.trim() || undefined,
      phone: phone?.trim() || undefined,
    });

    res.status(201).json(supplier);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { name, email, phone } = req.body;

    if (!name?.trim()) {
      return res.status(400).json({
        error: 'El nombre es obligatorio',
      });
    }

    const supplier = await handleUpdateSupplier(req.params.id, {
      name: name.trim(),
      email: email?.trim() || undefined,
      phone: phone?.trim() || undefined,
    });

    if (!supplier) {
      return res.status(404).json({
        error: 'Proveedor no encontrado',
      });
    }

    res.json(supplier);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const supplier = await handleDeleteSupplier(req.params.id);

    if (!supplier) {
      return res.status(404).json({
        error: 'Proveedor no encontrado',
      });
    }

    res.status(204).send();
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;