import api from '@/lib/api';

export interface LoginDTO {
  identifier: string;
  password: string;
}

export interface RegisterClientDTO {
  name: string;
  email?: string | null;
  phoneNumber: string;
  password: string;
}

export interface RegisterSupplierDTO extends RegisterClientDTO {
  shopName: string;
  phoneNumber: string;
  category: string;
}

const authService = {
  login: async (data: LoginDTO) => {
    const res = await api.post('/auth/login', data);
    return res.data;
  },

  registerClient: async (data: RegisterClientDTO) => {
    const res = await api.post('/auth/register', {
      ...data,
      role: 'CLIENT',
    });
    return res.data;
  },

  registerSupplier: async (data: RegisterSupplierDTO) => {
    // Étape 1 : Inscription utilisateur
    const registerRes = await api.post('/auth/register', {
      email: data.email,
      password: data.password,
      name: data.name,
      phoneNumber: data.phoneNumber,
      role: 'SUPPLIER',
    });

    const { user, token } = registerRes.data;

    // Étape 2 : Configuration de la boutique (Supplier Profile)
    await api.post('/suppliers/setup', {
      shopName: data.shopName,
      description: `Boutique de ${data.category}`,
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });

    return registerRes.data;
  },

  getMe: async () => {
    const res = await api.get('/users/me');
    return res.data;
  },

  updateMe: async (data: { name?: string; email?: string; phoneNumber?: string }) => {
    const res = await api.put('/users/me', data);
    return res.data;
  },
};

export default authService;
