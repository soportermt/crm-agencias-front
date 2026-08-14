const ID_TO_TIPO_SERVICIO = { "1": "hospedaje", "2": "traslado" };

function parseLocalDate(dateString) {
    if (!dateString || dateString === "0000-00-00") return null;
    const [year, month, day] = dateString.split("-").map(Number);
    return new Date(year, month - 1, day);
}

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
        id_ventaservicio: vs.id_ventaservicio,
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
            checkIn: parseLocalDate(desglose.checkIn),
            checkOut: parseLocalDate(desglose.checkOut),
            limitePago: parseLocalDate(desglose.limitePago),
            limiteCliente: parseLocalDate(desglose.limiteCliente),
            provider: desglose.providerData?.value ?? vs.id_proveedor,
        };
    }

    if (tipo === "traslado") {
        data = {
            ...data,
            redondo: !!desglose.redondo,
            pickup: desglose.recogida_hotel,
            checkIn: parseLocalDate(vs.inicio_servicio),
            checkOut: parseLocalDate(vs.fin_servicio),
            limitePago: parseLocalDate(vs.fecha_limite),
            limiteCliente: parseLocalDate(vs.limite_cliente),
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
        fecha: parseLocalDate(venta.fecha) ?? new Date(),
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
        limiteCancelacion: parseLocalDate(venta.limite_cancelacion),
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