const ID_TO_TIPO_SERVICIO = { "1": "hospedaje", "2": "traslado" };

function normalizeHabitacion(hab) {
    const { adultos = [], menores = [] } = hab.pasajeros || {};
    return {
        ...hab,
        pasajeros: [
            ...adultos.map((p) => ({ tipo: "adult", nombre: p.nombre, apellidos: p.apellidos })),
            ...menores.map((p) => ({ tipo: "child", nombre: p.nombre, apellidos: p.apellidos, edad: p.edad })),
        ],
    };
}
function mapVentaServicioToItem(vs) {
    const tipo = ID_TO_TIPO_SERVICIO[String(vs.id_tipo_servicio)];
    const desglose = vs.desglose || {};

    let data = {
        tarifa_publica: vs.tarifa_publica,
        fee: vs.fee,
        costo: vs.costo,
        comision: vs.comision,
        comision_pesos: vs.comision_pesos,
        inicio_servicio: vs.inicio_servicio,
        fin_servicio: vs.fin_servicio,
        code: vs.codigo,
        providerData: desglose.providerData ?? { id_proveedor: vs.id_proveedor, comision: vs.comision },
        ...desglose,
    };

    if (tipo === "hospedaje") {
        data = {
            ...data,
            habitaciones: (desglose.habitaciones || []).map(normalizeHabitacion),
            checkIn: desglose.checkIn ? new Date(desglose.checkIn) : null,
            checkOut: desglose.checkOut ? new Date(desglose.checkOut) : null,
            limitePago: desglose.limitePago ? new Date(desglose.limitePago) : null,
            limiteCliente: desglose.limiteCliente ? new Date(desglose.limiteCliente) : null,
            provider: desglose.providerData?.value ?? vs.id_proveedor,
        };
    }

    if (tipo === "traslado") {
        data = {
            ...data,
            redondo: !!desglose.redondo,
            pickup: desglose.recogida_hotel,
            checkIn: vs.inicio_servicio ? new Date(vs.inicio_servicio) : null,
            checkOut: vs.fin_servicio ? new Date(vs.fin_servicio) : null,
            limitePago: vs.fecha_limite ? new Date(vs.fecha_limite) : null,
            limiteCliente: vs.limite_cliente ? new Date(vs.limite_cliente) : null,
            total_publico: vs.tarifa_publica,
            providerData: desglose.providerData ?? { value: vs.id_proveedor, label: `Proveedor #${vs.id_proveedor}`, comision: vs.comision },
            provider: vs.id_proveedor,
        };
    }

    return { id: vs.id_ventaservicio, tipo, data };
}

export function mapVentaToBooking(venta) {
    const cliente = venta.idCliente;
    return {
        idVenta: venta.id_venta,
        folio: venta.folio,
        fecha: venta.fecha ? new Date(venta.fecha) : new Date(),
        pasajeroTitular: venta.pasajero_titular,
        descripcion: venta.descripcion,
        observaciones: venta.observaciones,
        moneda: venta.moneda,
        idAgencia: venta.id_agencia,
        idUsuario: venta.id_usuario,
        idCliente: venta.id_cliente,
        idTipoVenta: venta.id_tipo_venta,
        perteneceA: venta.pertenece_a,
        cargoServicios: venta.cargo_servicios,
        limiteCancelacion: venta.limite_cancelacion ? new Date(venta.limite_cancelacion) : null,
        customerId: cliente?.id_cliente,
        customer: cliente
            ? {
                value: cliente.id_cliente,
                label: cliente.nombre,
                phone: cliente.telefono,
                email: cliente.correo,
                direccion: cliente.direccion,
            }
            : null,
        servicios: (venta.ventasServicioses || []).map(mapVentaServicioToItem),
    };
}