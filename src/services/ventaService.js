import { supabase } from '../lib/supabaseClient';

export const registrarVenta = async (cart, total, sucursalActiva, vendedorNombre, estado = 'pendiente') => {
  try {
    // 1. Mapear el carrito para guardar un JSON prolijo en detalle_productos
    const detalleProductos = cart.map(item => ({
      nombre: item.nombre,
      cantidad: item.cantidad,
      precio: item.precio
    }));

    // 2. Armar el objeto a insertar en la tabla 'ventas'
    const nuevaVenta = {
      sucursal: sucursalActiva,
      vendedor_nombre: vendedorNombre,
      canal: 'Mostrador', // Ajustar según corresponda
      metodo_pago: 'Efectivo', // Ajustar según corresponda
      monto_total: total,
      estado: estado, // Mismas directrices que requirió el cliente ("completado" o "pendiente")
      detalle_productos: detalleProductos
    };

    // 3. Ejecutar el insert en Supabase
    const { data, error } = await supabase
      .from('ventas')
      .insert([nuevaVenta])
      .select();

    if (error) {
      throw error;
    }

    // 4. Lógica exitosa: Armar el mensaje y abrir link de WhatsApp
    let mensajeWhatsApp = `*Nuevo Pedido - ${sucursalActiva}*\n`;
    mensajeWhatsApp += `Vendedor: ${vendedorNombre}\n\n`;
    mensajeWhatsApp += `*Detalle de productos:*\n`;
    
    detalleProductos.forEach(prod => {
      mensajeWhatsApp += `- ${prod.cantidad}x ${prod.nombre} ($${prod.precio})\n`;
    });
    
    mensajeWhatsApp += `\n*Total abonado:* $${total}`;

    // Dinamismo en el número de WhatsApp según la sucursal
    const numerosWhatsApp = {
      'Concepcion': '5493442668753', // Cambiar por el número real
      'Colon': '5493442668753'       // Cambiar por el número real
    };

    const numeroWhatsApp = numerosWhatsApp[sucursalActiva];
    
    if (numeroWhatsApp) {
      const urlWhatsApp = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensajeWhatsApp)}`;
      window.open(urlWhatsApp, '_blank');
    } else {
      console.warn('No se encontró un número de WhatsApp asociado a la sucursal activa:', sucursalActiva);
    }

    return true; // Retorna true para confirmar en el componente que se insertó correctamente.

  } catch (error) {
    console.error('Error al intentar registrar la venta:', error.message || error);
    return false; // Permite manejar el error en el componente devuelviendo algo falsy
  }
};
