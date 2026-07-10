import { Router, Request, Response } from 'express';
import { handleGetCustomers } from '../queries/customer/listCustomer';
import { handleGetCustomer } from '../queries/customer/getCustomer';
import { handleCreateCustomer } from '../commands/customer/CreateCustomerHandler';
import { handleUpdateCustomer } from '../commands/customer/UpdateCustomerHandler';
import { handleDeleteCustomer } from '../commands/customer/DeleteCustomerHandler';


const router = Router();

router.get('/', async (_req: Request, res: Response) => {
  try {
    const customers = await handleGetCustomers();

    res.json(customers);
  } catch (error: any) {
    console.error('Error al obtener clientes:', error);

    res.status(500).json({
      error: 'Error al obtener los clientes',
      detail: error.message,
    });
  }
});

router.get('/:id', async (req: Request, res: Response) => {
  try {
    const customer = await handleGetCustomer(req.params.id);

    if (!customer) {
      return res.status(404).json({
        error: 'Cliente no encontrado',
      });
    }

    res.json(customer);
  } catch (error: any) {
    console.error('Error al obtener cliente:', error);

    res.status(500).json({
      error: 'Error al obtener el cliente',
      detail: error.message,
    });
  }
});

router.post('/', async (req: Request, res: Response) => {
  try {
    const { email, name, phone, address } = req.body;

    if (!name?.trim()) {
      return res.status(400).json({
        error: 'El nombre es obligatorio',
      });
    }

    if (!email?.trim()) {
      return res.status(400).json({
        error: 'El correo electrónico es obligatorio',
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email.trim())) {
      return res.status(400).json({
        error: 'El correo electrónico no es válido',
      });
    }

    const customer = await handleCreateCustomer({
      email,
      name
    });

    res.status(201).json(customer);
  } catch (error: any) {
    console.error('Error al crear cliente:', error);

    if (error.code === '23505') {
      return res.status(409).json({
        error: 'Ya existe un cliente con ese correo electrónico',
      });
    }

    res.status(500).json({
      error: 'Error al crear el cliente',
      detail: error.message,
    });
  }
});

router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { email, name, phone, address } = req.body;

    if (name !== undefined && !name.trim()) {
      return res.status(400).json({
        error: 'El nombre no puede estar vacío',
      });
    }

    if (email !== undefined) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!email.trim() || !emailRegex.test(email.trim())) {
        return res.status(400).json({
          error: 'El correo electrónico no es válido',
        });
      }
    }

    const customer = await handleUpdateCustomer(req.params.id, {
      email,
      name
    });

    if (!customer) {
      return res.status(404).json({
        error: 'Cliente no encontrado',
      });
    }

    res.json(customer);
  } catch (error: any) {
    console.error('Error al actualizar cliente:', error);

    if (error.code === '23505') {
      return res.status(409).json({
        error: 'Ya existe otro cliente con ese correo electrónico',
      });
    }

    res.status(500).json({
      error: 'Error al actualizar el cliente',
      detail: error.message,
    });
  }
});

router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const deleted = await handleDeleteCustomer(req.params.id);

    if (!deleted) {
      return res.status(404).json({
        error: 'Cliente no encontrado',
      });
    }

    res.status(204).send();
  } catch (error: any) {
    console.error('Error al eliminar cliente:', error);

    if (error.code === '23503') {
      return res.status(409).json({
        error:
          'No se puede eliminar el cliente porque tiene órdenes asociadas',
      });
    }

    res.status(500).json({
      error: 'Error al eliminar el cliente',
      detail: error.message,
    });
  }
});

export default router;